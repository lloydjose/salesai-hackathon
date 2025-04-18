import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Import NextRequest
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { advancedProspectMessagingSchema } from '@/lib/ai/schemas';
import { generateProfileInsightsprompt } from '@/lib/ai/utils';

export async function POST(
  request: NextRequest, // Use NextRequest
  { params }: { params: Promise<{ id: string }> } // Use Promise for params
) {
  try {
    const { id: prospectId } = await params; // Await params before accessing id
    
    console.log(`[API analyze] Received request for ID: ${prospectId}`); // Use awaited/destructured id
    // Get headers from the request object directly
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      console.log("[API analyze] Unauthorized access attempt.");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // const prospectId = routeParams.id; // Already destructured above
    if (!prospectId) {
      console.log("[API analyze] Prospect ID missing.");
      return NextResponse.json({ message: 'Prospect ID is required' }, { status: 400 });
    }

    // 1. Fetch the prospect data
    const prospect = await prisma.prospect.findUnique({
      where: {
        id: prospectId,
        userId: session.user.id, // Ensure ownership
      },
      select: {
        id: true,
        source: true,
        linkedinData: true,
        aiAnalysis: true, // Check if analysis already exists
      }
    });

    if (!prospect) {
      console.log(`[API analyze] Prospect not found or access denied for ID: ${prospectId}`);
      return NextResponse.json({ message: 'Prospect not found or access denied' }, { status: 404 });
    }

    // 2. Validate source and LinkedIn data
    if (prospect.source !== 'LINKEDIN') {
      console.log(`[API analyze] Analysis requested for non-LinkedIn prospect ID: ${prospectId}. Source: ${prospect.source}`);
      return NextResponse.json({ message: 'AI analysis is only available for prospects added via LinkedIn.' }, { status: 400 });
    }

    if (!prospect.linkedinData || typeof prospect.linkedinData !== 'object' || Object.keys(prospect.linkedinData).length === 0) {
      console.log(`[API analyze] Missing or invalid LinkedIn data for prospect ID: ${prospectId}`);
      return NextResponse.json({ message: 'LinkedIn data is missing or invalid for this prospect.' }, { status: 400 });
    }

    // 3. Check if analysis already exists
    if (prospect.aiAnalysis && typeof prospect.aiAnalysis === 'object' && Object.keys(prospect.aiAnalysis).length > 0) {
      console.log(`[API analyze] Analysis already exists for prospect ID: ${prospectId}. Returning existing analysis.`);
      return NextResponse.json({ analysis: prospect.aiAnalysis }); // Return existing analysis
    }

    // 4. Generate the prompt
    const prompt = generateProfileInsightsprompt(prospect.linkedinData);
    if (prompt.startsWith("Error:")) {
       console.error(`[API analyze] Error generating prompt for ID ${prospectId}:`, prompt);
       return NextResponse.json({ message: prompt }, { status: 500 });
    }

    console.log(`[API analyze] Calling OpenAI for prospect ID: ${prospectId}...`);

    // 5. Call AI SDK to generate structured analysis
    const { object: analysisObject } = await generateObject({
        model: openai(process.env.OPENAI_API_MODEL || 'gpt-4o-mini'), // Use your desired model
        schema: advancedProspectMessagingSchema,
        prompt: prompt,
        temperature: 0.5, // Adjust temperature for more deterministic output if needed
        maxTokens: 2500, // Adjust based on expected output size
    });

     console.log(`[API analyze] OpenAI response received for prospect ID: ${prospectId}.`);

    // 6. Save the generated analysis to the database
    const updatedProspect = await prisma.prospect.update({
        where: { id: prospectId },
        data: {
            aiAnalysis: analysisObject as any, // Store the structured object
        },
        select: { aiAnalysis: true } // Select only the updated field to return
    });

    console.log(`[API analyze] Analysis saved successfully for prospect ID: ${prospectId}.`);

    // 7. Return the newly generated analysis
    return NextResponse.json({ analysis: updatedProspect.aiAnalysis });

  } catch (error) {
    console.error("[API analyze] Error generating or saving analysis:", error);
    // Handle potential AI SDK errors or Prisma errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error generating analysis', error: errorMessage }, { status: 500 });
  }
} 