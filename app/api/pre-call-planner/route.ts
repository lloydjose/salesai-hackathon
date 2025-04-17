import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { salesCallPrepBriefSchema } from '@/lib/ai/schemas';
import { generateCallPrepBriefPrompt } from '@/lib/ai/utils';
import { z } from 'zod';

// Input validation schema for the API endpoint
const createPlanSchema = z.object({
  prospectId: z.string().cuid({ message: "Invalid Prospect ID" }),
  callType: z.enum(['Discovery', 'Demo', 'Follow-up', 'Cold Outreach', 'Upsell', 'Renewal']),
  productPitchContext: z.string().optional().nullable(),
  callObjective: z.string().min(5, { message: "Call objective must be at least 5 characters" }),
  customNotes: z.string().optional().nullable(),
  knownPainPoints: z.array(z.string()).optional().nullable(),
  competitorMentioned: z.array(z.string()).optional().nullable(),
  priorityLevel: z.enum(['Low', 'Medium', 'High']).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();

    // Validate input
    const validation = createPlanSchema.safeParse(body);
    if (!validation.success) {
      console.log("[API PreCallPlanner POST] Invalid input:", validation.error.flatten());
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    const userInput = validation.data;

    console.log(`[API PreCallPlanner POST] Received request for prospect: ${userInput.prospectId} by user: ${userId}`);

    // 1. Fetch the selected prospect data (specifically linkedinData)
    const prospect = await prisma.prospect.findUnique({
      where: {
        id: userInput.prospectId,
        userId: userId, // Ensure ownership
      },
      select: {
        id: true,
        linkedinData: true,
        source: true, // Check source if needed
      }
    });

    if (!prospect) {
      return NextResponse.json({ message: 'Prospect not found or access denied' }, { status: 404 });
    }

    // Optional: Check if source is LinkedIn if required for this feature
    if (!prospect.linkedinData || typeof prospect.linkedinData !== 'object' || Object.keys(prospect.linkedinData).length === 0) {
      return NextResponse.json({ message: 'Selected prospect does not have LinkedIn data required for AI planning.' }, { status: 400 });
    }

    // 2. Generate the prompt using user input and LinkedIn data
    const prompt = generateCallPrepBriefPrompt(userInput, prospect.linkedinData);
    if (prompt.startsWith("Error:")) {
       console.error(`[API PreCallPlanner POST] Error generating prompt:`, prompt);
       return NextResponse.json({ message: prompt }, { status: 500 });
    }

    console.log(`[API PreCallPlanner POST] Calling OpenAI for prospect ID: ${userInput.prospectId}...`);

    // 3. Call AI SDK to generate structured brief
    const { object: aiOutput } = await generateObject({
        model: openai(process.env.OPENAI_API_MODEL || 'gpt-4o-mini'),
        schema: salesCallPrepBriefSchema,
        prompt: prompt,
        temperature: 0.6,
        maxTokens: 1500,
    });

    console.log(`[API PreCallPlanner POST] OpenAI response received.`);

    // 4. Save the brief (user input + AI output) to the database
    const newBrief = await prisma.callPrepBrief.create({
      data: {
        userId: userId,
        prospectId: userInput.prospectId,
        // Store user input as a JSON object in the 'formInput' field
        formInput: {
            callType: userInput.callType,
            productPitchContext: userInput.productPitchContext,
            callObjective: userInput.callObjective,
            customNotes: userInput.customNotes,
            knownPainPoints: userInput.knownPainPoints ?? [],
            competitorMentioned: userInput.competitorMentioned ?? [],
            priorityLevel: userInput.priorityLevel,
        } as any, // Cast needed as Prisma expects Json type
        // Store AI output in the 'aiCallPrep' field
        aiCallPrep: aiOutput as any, // Cast as Prisma expects Json type
      },
      select: {
          id: true,
          // Include other fields if needed by the frontend immediately
      }
    });

    console.log(`[API PreCallPlanner POST] New Call Prep Brief saved. ID: ${newBrief.id}`);

    // 5. Return the newly created brief (or just its ID or a success message)
    return NextResponse.json({ briefId: newBrief.id, message: 'Pre-call plan created successfully.' }, { status: 201 });

  } catch (error) {
    console.error("[API PreCallPlanner POST] Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to create pre-call plan', error: errorMessage }, { status: 500 });
  }
}

// --- GET Handler to list briefs ---
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    console.log(`[API PreCallPlanner GET] Fetching briefs for user: ${userId}`);

    // Fetch briefs including the formInput JSON and prospect details
    const briefsRaw = await prisma.callPrepBrief.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        createdAt: true,
        formInput: true, // Fetch the JSON field
        prospect: {      // Include prospect name
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Map the raw data to extract callType from formInput
    const briefs = briefsRaw.map(brief => {
      let callType = 'Unknown'; // Default value
      if (brief.formInput && typeof brief.formInput === 'object' && 'callType' in brief.formInput) {
          // Basic type check before accessing
          callType = (brief.formInput as any).callType;
      }
      return {
        id: brief.id,
        createdAt: brief.createdAt,
        prospect: brief.prospect,
        callType: callType, // Add the extracted callType
      };
    });

    return NextResponse.json(briefs);

  } catch (error) {
    console.error("[API PreCallPlanner GET] Error fetching briefs:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to fetch pre-call plans', error: errorMessage }, { status: 500 });
  }
} 