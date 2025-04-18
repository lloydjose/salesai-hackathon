import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { coldEmailGeneratorSchema } from '@/lib/ai/schemas';
import { generateColdEmailPrompt } from '@/lib/ai/utils';
import { ColdEmailFormInput, coldEmailStyles, psychologyAngles } from '@/lib/ai/types';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

// Input validation schema for the API endpoint
const emailGenInputSchema = z.object({
  recipientName: z.string().optional().nullable(),
  recipientTitle: z.string().optional().nullable(),
  recipientCompany: z.string().optional().nullable(),
  // Preprocess prospectId: turn empty string into undefined before CUID validation
  prospectId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().cuid({ message: "Invalid Prospect ID format"}).optional().nullable()
  ),
  emailSubjectContext: z.string().min(10, { message: "Email context must be at least 10 characters" }),
  emailStyle: z.enum(coldEmailStyles, { required_error: "Email style is required" }),
  psychologyAngle: z.enum(psychologyAngles, { required_error: "Psychology angle is required" }),
  customInstructions: z.string().optional().nullable(),
}).refine(data => data.prospectId || data.recipientName, {
    message: "Either select a Prospect or provide a Recipient Name.",
    path: ["recipientName"], // Point error to recipientName if neither is provided
});

interface LinkedInData {
  profile_url?: string;
  headline?: string;
  current_company?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration?: string;
  }>;
}

interface ProspectData {
  id: string;
  name: string | null;
  linkedinData: LinkedInData | null;
}

interface EmailGenerationResponse {
  subject: string;
  body: string;
  callToAction: string;
  tone: string;
  personalization: string[];
}

interface ProcessedEmail {
  id: string;
  createdAt: Date;
  recipientName: string;
  subjectContext: string;
  aiGeneratedEmail: EmailGenerationResponse;
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // Fetch user details along with session
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
            name: true, 
            profile: { // Include UserProfile if it exists
                select: { roleTitle: true }
            } 
        }
    });

    const body = await request.json();

    // Validate input
    const validation = emailGenInputSchema.safeParse(body);
    if (!validation.success) {
      console.error("[API ColdEmail POST] Invalid input:", validation.error.flatten());
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    const userInput: ColdEmailFormInput = validation.data;

    console.log(`[API ColdEmail POST] Received request from user: ${user?.name || userId}, Prospect ID: ${userInput.prospectId || 'N/A'}`);

    // 1. Fetch prospect data if ID is provided
    let prospectData: ProspectData | null = null;
    if (userInput.prospectId) {
      const fetchedProspect = await prisma.prospect.findUnique({
        where: {
          id: userInput.prospectId,
          userId: userId,
        },
        select: {
          id: true,
          name: true,
          linkedinData: true,
        }
      });

      if (!fetchedProspect) {
        return NextResponse.json({ message: 'Selected Prospect not found or access denied.' }, { status: 404 });
      }

      // Safely cast linkedinData to our expected type
      const linkedinData = fetchedProspect.linkedinData as unknown as LinkedInData;
      
      prospectData = {
        id: fetchedProspect.id,
        name: fetchedProspect.name,
        linkedinData: linkedinData
      };

      if (!userInput.recipientName && prospectData.name) {
          userInput.recipientName = prospectData.name;
      }
    }

    // 2. Generate the prompt, passing user info
    const prompt = generateColdEmailPrompt(
        userInput, 
        prospectData, 
        user?.name, // Pass sender name
        user?.profile?.roleTitle // Pass sender title if available
    );

    console.log(`[API ColdEmail POST] Calling OpenAI for user: ${userId}...`);

    // 3. Call AI SDK to generate structured email
    const { object: aiOutput } = await generateObject({
        model: openai(process.env.OPENAI_API_MODEL || 'gpt-4o-mini'), // Use your desired model
        schema: coldEmailGeneratorSchema,
        prompt: prompt,
        temperature: 0.7, // Slightly higher temp for creativity
        maxTokens: 1000, // Email outputs are usually shorter
    });

    console.log(`[API ColdEmail POST] OpenAI response received for user: ${userId}.`);

    // 4. Save the request and response to the database
    const newColdEmail = await prisma.coldEmail.create({
      data: {
        userId: userId,
        prospectId: userInput.prospectId, // Link to prospect if ID was used
        userInput: JSON.parse(JSON.stringify(userInput)) as Prisma.JsonObject, // Store the validated user input
        aiGeneratedEmail: aiOutput as Prisma.JsonObject, // Store the structured AI output
      },
      select: {
          id: true,
          aiGeneratedEmail: true // Return the generated email directly
      }
    });

    console.log(`[API ColdEmail POST] New Cold Email record saved. ID: ${newColdEmail.id}`);

    // 5. Return the generated email content AND the ID
    return NextResponse.json({
         id: newColdEmail.id, 
         aiGeneratedEmail: newColdEmail.aiGeneratedEmail 
    });

  } catch (error) {
    console.error("[API ColdEmail POST] Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to generate cold email', error: errorMessage }, { status: 500 });
  }
}

// --- GET Handler to list generated emails ---
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    console.log(`[API ColdEmail GET] Fetching emails for user: ${userId}`);

    const emails = await prisma.coldEmail.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        createdAt: true,
        userInput: true, // Needed to display context/recipient
        aiGeneratedEmail: true, // Needed for the dialog view
        prospect: {      // Include prospect name if linked
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit the number of results initially
    });

    // Process to extract relevant display info easily
    const processedEmails: ProcessedEmail[] = emails.map((email: {
        id: string;
        createdAt: Date;
        userInput: any;
        aiGeneratedEmail: any;
        prospect?: {
            id: string;
            name: string | null;
        } | null;
    }) => {
        const input = email.userInput as Record<string, unknown>;
        const recipientName = email.prospect?.name || (input?.recipientName as string) || 'Unknown Recipient';
        const subjectContext = (input?.emailSubjectContext as string) || 'No Context';
        
        // Safely cast aiGeneratedEmail to our expected type
        const aiGeneratedEmail = email.aiGeneratedEmail as unknown as EmailGenerationResponse;
        
        return {
            id: email.id,
            createdAt: email.createdAt,
            recipientName,
            subjectContext,
            aiGeneratedEmail,
        };
    });

    return NextResponse.json(processedEmails);

  } catch (error) {
    console.error("[API ColdEmail GET] Error fetching emails:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to fetch generated emails', error: errorMessage }, { status: 500 });
  }
} 