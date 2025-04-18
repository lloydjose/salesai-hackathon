import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { AssemblyAI } from 'assemblyai'; // Import AssemblyAI SDK

// Initialize AssemblyAI Client
const assemblyClient = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

// Initialize S3 Client for Cloudflare R2
const R2 = new S3Client({
    region: "auto", // Required by AWS SDK v3, set to "auto" for R2
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_R2_ENDPOINT = process.env.NEXT_PUBLIC_R2_ENDPOINT!; // Public URL base

// Define accepted MIME types for stricter server-side validation
const ACCEPTED_AUDIO_MIME_TYPES = [
    'audio/mpeg', // MP3
    'audio/wav',  // WAV
    'audio/x-m4a',// M4A
    'audio/m4a',
];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB - Ensure this matches client-side

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        const formData = await request.formData();
        const audioFile = formData.get('audioFile') as File | null;
        const description = formData.get('description') as string | null;

        // --- Basic Validation ---
        if (!audioFile) {
            return NextResponse.json({ message: 'No audio file provided.' }, { status: 400 });
        }
        if (!ACCEPTED_AUDIO_MIME_TYPES.includes(audioFile.type)) {
            return NextResponse.json({ message: 'Invalid file type.' }, { status: 400 });
        }
        if (audioFile.size > MAX_FILE_SIZE_BYTES) {
            return NextResponse.json({ message: 'File size exceeds limit.' }, { status: 400 });
        }
        // --- End Validation ---

        console.log(`[API ConvIntel Upload] Received file: ${audioFile.name}, Size: ${audioFile.size}, Type: ${audioFile.type} by user: ${userId}`);

        // --- Upload to R2 --- 
        const fileExtension = audioFile.name.split('.').pop() || 'bin';
        const uniqueFilename = `${userId}/${uuidv4()}.${fileExtension}`;
        const fileBuffer = Buffer.from(await audioFile.arrayBuffer());

        const putCommand = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueFilename,
            Body: fileBuffer,
            ContentType: audioFile.type,
            // ACL: 'public-read', // Uncomment if you want files public by default (adjust bucket policy too)
        });

        console.log(`[API ConvIntel Upload] Uploading ${uniqueFilename} to R2...`);
        await R2.send(putCommand);
        console.log(`[API ConvIntel Upload] Upload complete.`);

        // Construct the public URL (adjust if your bucket isn't public)
        const storagePath = `${PUBLIC_R2_ENDPOINT}/${uniqueFilename}`;

        // --- Create Initial Database Record --- 
        console.log(`[API ConvIntel Upload] Creating initial database record...`);
        const newAnalysis = await prisma.conversationAnalysis.create({
            data: {
                userId: userId,
                originalFilename: audioFile.name,
                storagePath: storagePath, 
                description: description,
                status: 'PENDING', // Start as PENDING, update after AssemblyAI submission
            },
            select: {
                id: true // Still need the ID
            }
        });
        console.log(`[API ConvIntel Upload] Initial DB record created. ID: ${newAnalysis.id}`);

        // --- Submit to AssemblyAI for Transcription --- 
        console.log(`[API ConvIntel Upload] Submitting ${storagePath} to AssemblyAI...`);
        let assemblyTranscriptId: string | undefined;
        try {
            const transcript = await assemblyClient.transcripts.create({
                audio_url: storagePath, // Use the public R2 URL
                speaker_labels: true, // Enable speaker diarization
                // Optional: Add webhook URL here if using webhooks
                // webhook_url: process.env.ASSEMBLYAI_WEBHOOK_URL,
                // webhook_auth_header_name: 'X-Webhook-Secret', // Example header
                // webhook_auth_header_value: process.env.ASSEMBLYAI_WEBHOOK_SECRET, // Example secret
            });
            assemblyTranscriptId = transcript.id;
            console.log(`[API ConvIntel Upload] Submitted to AssemblyAI with speaker labels. Transcript ID: ${assemblyTranscriptId}`);

            // --- Update Database Record with AssemblyAI ID and Status --- 
            console.log(`[API ConvIntel Upload] Updating database record with AssemblyAI ID and status...`);
            await prisma.conversationAnalysis.update({
                where: { id: newAnalysis.id },
                data: { 
                    status: 'PROCESSING', // Update status to processing
                    assemblyAiTranscriptId: assemblyTranscriptId // Store the transcript ID
                },
            });
            console.log(`[API ConvIntel Upload] Database record updated.`);

        } catch (assemblyError) {
            console.error("[API ConvIntel Upload] AssemblyAI submission failed:", assemblyError);
            // Update DB status to FAILED if AssemblyAI submission fails
            await prisma.conversationAnalysis.update({
                where: { id: newAnalysis.id },
                data: { 
                    status: 'FAILED',
                    errorMessage: assemblyError instanceof Error ? assemblyError.message : 'AssemblyAI submission failed.',
                },
            });
            // Re-throw or return error to prevent sending success response
            throw new Error('Failed to submit audio for transcription.'); 
        }

        // --- Return Response --- 
        // Return the ID so the frontend can redirect
        return NextResponse.json({ analysisId: newAnalysis.id }, { status: 201 });

    } catch (error) {
        console.error("[API ConvIntel Upload] Error:", error);
        const message = error instanceof Error ? error.message : "Unknown server error during upload process.";
        // Ensure we don't try to update a non-existent record if initial create failed
        // The specific error handling might need refinement depending on where the error occurs
        return NextResponse.json({ message: message }, { status: 500 });
    }
} 