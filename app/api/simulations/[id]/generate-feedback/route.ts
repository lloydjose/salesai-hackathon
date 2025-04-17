import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { salesCallAnalysisSchema } from '@/lib/ai/schemas';
import { generateFeedbackPrompt } from '@/lib/ai/utils';
import { headers } from 'next/headers';
import { z } from 'zod';

// Helper function to format transcript array into a simple string
// Adjust this based on the actual structure stored in your DB
function formatTranscriptForPrompt(transcript: any[] | null): string {
    if (!transcript || !Array.isArray(transcript)) {
        return "Transcript not available.";
    }
    return transcript
        .filter(item => item && item.type === 'transcript' && item.role && item.transcript)
        .map(item => `${item.role === 'user' ? 'Salesperson' : 'Prospect'}: ${item.transcript}`)
        .join('\n');
}


export async function POST(
  request: Request, // Note: request object isn't used here, but required by Next.js
  { params }: { params: { id: string } }
) {
  try {
    const routeParams = await params; // *** Await params ***
    console.log("[API generate-feedback] Received request for ID:", routeParams.id);
    const headerData = await headers(); 
    const session = await auth.api.getSession({ headers: headerData });

    if (!session?.user?.id) {
      console.log("[API generate-feedback] Unauthorized access attempt.");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const simulationId = routeParams.id; // Use awaited params
    if (!simulationId) {
      console.log("[API generate-feedback] Simulation ID missing.");
      return NextResponse.json({ message: 'Simulation ID is required' }, { status: 400 });
    }

    // 1. Fetch the simulation data, especially the transcript and user name
    const simulation = await prisma.callSimulation.findUnique({
      where: {
        id: simulationId,
        userId: session.user.id, // Ensure ownership
      },
      select: {
        transcript: true,
        feedback: true,
        id: true, 
        personaDetails: true, // Need personaDetails to extract prospect name
        user: { // Need user relation for salesperson name
            select: { name: true }
        }
      }
    });

    if (!simulation) {
      console.log(`[API generate-feedback] Simulation not found for ID: ${simulationId}`);
      return NextResponse.json({ message: 'Simulation not found' }, { status: 404 });
    }
    
    // Extract names
    const salespersonName = simulation.user?.name;
    let prospectName: string | undefined;
    try {
        // Safely parse personaDetails
        if (simulation.personaDetails && typeof simulation.personaDetails === 'object') {
            prospectName = (simulation.personaDetails as any)?.prospectName;
        } else if (typeof simulation.personaDetails === 'string') {
             // Handle case where it might be stored as a stringified JSON
             const details = JSON.parse(simulation.personaDetails);
             prospectName = details?.prospectName;
        }
    } catch (parseError) {
         console.error(`[API generate-feedback] Error parsing personaDetails for ID ${simulationId}:`, parseError);
         // prospectName remains undefined, the prompt function will handle default
    }

    // 2. Check if feedback already exists
    if (simulation.feedback && typeof simulation.feedback === 'object' && Object.keys(simulation.feedback).length > 0) {
        // Basic check to see if feedback JSON is not empty
        // You might want a more sophisticated check
        console.log(`[API generate-feedback] Feedback already exists for simulation ID: ${simulationId}. Returning existing feedback.`);
        // We need to return it in a format the client expects, maybe wrap it
        return NextResponse.json({ feedback: simulation.feedback }); 
    }

    // 3. Format transcript and generate prompt
    const transcriptText = formatTranscriptForPrompt(simulation.transcript as any[] | null);
    if (transcriptText === "Transcript not available.") {
        console.log(`[API generate-feedback] Transcript not available for simulation ID: ${simulationId}`);
        return NextResponse.json({ message: 'Transcript is required to generate feedback' }, { status: 400 });
    }
    const prompt = generateFeedbackPrompt(transcriptText, salespersonName, prospectName);

    console.log(`[API generate-feedback] Calling OpenAI for simulation ID: ${simulationId}...`);
    
    // 4. Call AI SDK to generate structured feedback
    const { object: feedbackObject } = await generateObject({
        model: openai(process.env.OPENAI_API_MODEL || 'gpt-4o-mini'), // Use your desired model
        schema: salesCallAnalysisSchema,
        prompt: prompt,
        temperature: 0.7, // Adjust parameters as needed
        maxTokens: 2000,
        // You might not need messages array if prompt template is sufficient
        // messages: [{ role: 'user', content: prompt }], 
    });

     console.log(`[API generate-feedback] OpenAI response received for simulation ID: ${simulationId}.`);

    // 5. Save the generated feedback to the database
    await prisma.callSimulation.update({
        where: { id: simulationId },
        data: {
            feedback: feedbackObject as any, // Store the structured object (Prisma handles JSON)
        },
    });

    console.log(`[API generate-feedback] Feedback saved successfully for simulation ID: ${simulationId}.`);

    // 6. Return the generated feedback
    return NextResponse.json({ feedback: feedbackObject });

  } catch (error) {
    console.error("[API generate-feedback] Error generating or saving feedback:", error);
    // Consider more specific error handling (e.g., AI SDK errors)
    return NextResponse.json({ message: 'Error generating feedback', error: (error as Error).message || 'Unknown error' }, { status: 500 });
  }
} 