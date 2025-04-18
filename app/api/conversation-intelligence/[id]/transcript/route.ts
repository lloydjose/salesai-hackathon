import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Import NextRequest
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AssemblyAI } from 'assemblyai';
// Remove Zod import if no longer needed elsewhere
// import { z } from 'zod'; 
import { generateConversationInsightsPrompt } from '@/lib/ai/utils';
import { salesCallConversationInsightsSchema } from '@/lib/ai/schemas';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';

// Initialize AssemblyAI Client
const assemblyClient = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

// Remove the RouteContext interface
// interface RouteContext {
//     params: { id?: string }; 
// }

// Define expected statuses from AssemblyAI
type AssemblyAIStatus = 'queued' | 'processing' | 'completed' | 'error';

export async function GET(
    request: NextRequest, // Use NextRequest
    { params }: { params: Promise<{ id: string }> } // Use Promise for params
) {
    try {
        // Await params before accessing id
        const { id: analysisId } = await params;
        
        // Perform the simple type check on the now definitely string result
        if (typeof analysisId !== 'string') {
            console.error("[API Transcript Poll] Invalid or missing analysis ID parameter after await:", analysisId);
            return NextResponse.json({ message: 'Invalid or missing analysis ID parameter.' }, { status: 400 });
        }
        console.log(`[API Transcript Poll] Processing request for analysis ID: ${analysisId}`);

        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        // 1. Fetch the current record
        const analysisRecord = await prisma.conversationAnalysis.findUnique({
            where: { id: analysisId },
        });

        if (!analysisRecord) {
            return NextResponse.json({ message: 'Analysis record not found' }, { status: 404 });
        }

        // Ensure the user owns this record
        if (analysisRecord.userId !== userId) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        // 2. If already complete or failed, return the current record
        if (analysisRecord.status === 'COMPLETE' || analysisRecord.status === 'FAILED') {
            console.log(`[API Transcript Poll] Record ${analysisId} already ${analysisRecord.status}. Returning existing.`);
            return NextResponse.json(analysisRecord);
        }

        // 3. Check if AssemblyAI ID exists
        if (!analysisRecord.assemblyAiTranscriptId) {
            console.error(`[API Transcript Poll] Record ${analysisId} is ${analysisRecord.status} but missing assemblyAiTranscriptId.`);
            // Optionally update status to FAILED here
            await prisma.conversationAnalysis.update({
                 where: { id: analysisId },
                 data: { status: 'FAILED', errorMessage: 'Missing AssemblyAI Transcript ID.' },
            });
            return NextResponse.json({ message: 'Missing AssemblyAI Transcript ID.' }, { status: 500 });
        }

        // 4. Poll AssemblyAI
        console.log(`[API Transcript Poll] Polling AssemblyAI for transcript ID: ${analysisRecord.assemblyAiTranscriptId}`);
        const transcriptResult = await assemblyClient.transcripts.get(analysisRecord.assemblyAiTranscriptId);
        const assemblyStatus = transcriptResult.status as AssemblyAIStatus;

        console.log(`[API Transcript Poll] AssemblyAI status for ${analysisRecord.assemblyAiTranscriptId}: ${assemblyStatus}`);

        // 5. Handle AssemblyAI Status
        switch (assemblyStatus) {
            case 'queued':
            case 'processing':
                // Still processing, return the current record status
                return NextResponse.json({ status: 'PROCESSING' }); // Indicate still processing

            case 'error':
                console.error(`[API Transcript Poll] AssemblyAI transcription failed for ${analysisRecord.assemblyAiTranscriptId}. Error: ${transcriptResult.error}`);
                const failedRecord = await prisma.conversationAnalysis.update({
                    where: { id: analysisId },
                    data: {
                        status: 'FAILED',
                        errorMessage: transcriptResult.error || 'Transcription failed in AssemblyAI.',
                    },
                });
                return NextResponse.json(failedRecord);

            case 'completed':
                console.log(`[API Transcript Poll] Transcription complete for ${analysisRecord.assemblyAiTranscriptId}. Fetching text.`);
                const transcriptText = transcriptResult.text;
                const utterances = transcriptResult.utterances;

                if (!transcriptText) {
                    console.error(`[API Transcript Poll] AssemblyAI transcription complete but text is missing for ${analysisRecord.assemblyAiTranscriptId}.`);
                     const noTextRecord = await prisma.conversationAnalysis.update({
                        where: { id: analysisId },
                        data: {
                            status: 'FAILED',
                            errorMessage: 'Transcription completed but no text was returned.',
                            transcript: transcriptResult as any, // Store raw result for debugging
                        },
                    });
                    return NextResponse.json(noTextRecord);
                }
                
                // Create the refined structure to save
                const refinedTranscriptData = {
                    full_text: transcriptText,
                    // Include utterances if they exist, otherwise empty array
                    utterances: utterances || [], 
                };

                console.log(`[API Transcript Poll] Transcript text received. Length: ${transcriptText.length}. Triggering AI analysis...`);

                // Update DB with the REFINED transcript structure
                await prisma.conversationAnalysis.update({
                    where: { id: analysisId },
                    data: {
                        transcript: refinedTranscriptData as any, // Save the refined JSON object
                    },
                 });

                // 6. Trigger OpenAI Analysis (still uses the full transcriptText)
                let aiAnalysisResult: any = null;
                let analysisError: string | null = null;
                try {
                    const prompt = generateConversationInsightsPrompt(transcriptText, analysisRecord.description);
                    
                    // Use generateObject directly
                    const { object } = await generateObject({
                        model: openai(process.env.OPENAI_API_MODEL || 'gpt-4o-mini'), // Use your desired model
                        schema: salesCallConversationInsightsSchema,
                        prompt: prompt,
                        temperature: 0.5, // Adjust temperature as needed
                        maxTokens: 2000, // Adjust max tokens as needed for the insights schema
                    });
                    aiAnalysisResult = object; // Assign the structured object
                    console.log(`[API Transcript Poll] AI analysis complete for ${analysisId}.`);

                } catch (error) {
                    console.error(`[API Transcript Poll] AI analysis failed for ${analysisId}:`, error);
                    analysisError = error instanceof Error ? error.message : "AI analysis failed.";
                }

                // 7. Update Final Record
                const finalStatus = analysisError ? 'FAILED' : 'COMPLETE';
                const finalData: any = {
                    status: finalStatus,
                    aiAnalysis: aiAnalysisResult, 
                    errorMessage: analysisError, 
                };

                const finalRecord = await prisma.conversationAnalysis.update({
                    where: { id: analysisId },
                    data: finalData,
                });

                console.log(`[API Transcript Poll] Final update complete for ${analysisId}. Status: ${finalStatus}`);
                return NextResponse.json(finalRecord);

            default:
                console.error(`[API Transcript Poll] Unknown AssemblyAI status: ${assemblyStatus} for ${analysisRecord.assemblyAiTranscriptId}`);
                const unknownStatusRecord = await prisma.conversationAnalysis.update({
                    where: { id: analysisId },
                    data: {
                        status: 'FAILED',
                        errorMessage: `Unknown transcription status: ${assemblyStatus}`,
                    },
                });
                return NextResponse.json(unknownStatusRecord);
        }

    } catch (error) {
        console.error("[API Transcript Poll] Error:", error);
        // Remove specific ZodError catch block
        const message = error instanceof Error ? error.message : "Unknown server error during transcript polling.";
        return NextResponse.json({ message: message }, { status: 500 });
    }
} 