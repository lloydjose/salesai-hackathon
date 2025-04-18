import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema to validate the ID parameter *directly*
const idParamSchema = z.string({ required_error: "Email ID parameter is required." }).min(1, "Email ID cannot be empty.");

export async function GET(
    request: Request, 
    context: { params: { id?: string } } // Use context object name
) {
  try {
    // Await params from context before accessing
    const params = context.params; 

    // Log the received params object and the specific id property
    console.log(`[API ColdEmail GET /id] Received params object:`, params);
    const potentialId = params?.id; // Extract the ID directly
    console.log(`[API ColdEmail GET /id] Extracted potential ID: ${potentialId}, Type: ${typeof potentialId}`);

    // Validate the extracted ID string
    const emailId = idParamSchema.parse(potentialId); 
    console.log(`[API ColdEmail GET /id] Successfully validated ID: ${emailId}`);

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    console.log(`[API ColdEmail GET /${emailId}] Fetching email for user: ${userId}`);

    const email = await prisma.coldEmail.findUnique({
        // Use the directly validated emailId
        where: {
            id: emailId, 
            userId: userId, // Ensure ownership
        },
        select: {
            id: true,
            userInput: true,
            aiGeneratedEmail: true,
            editedContent: true,
            createdAt: true,
            prospect: { select: { name: true } } // Include prospect name for context
        },
    });

    if (!email) {
        return NextResponse.json({ message: 'Email not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(email);

  } catch (error) {
    console.error(`[API ColdEmail GET /id] Error fetching email:`, error);
    if (error instanceof z.ZodError) {
        // Now refers to idParamSchema error
        return NextResponse.json({ message: 'Invalid Email ID parameter.', errors: error.flatten().formErrors }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to fetch email', error: errorMessage }, { status: 500 });
  }
}

// TODO: Add DELETE handler here later if needed (already in history page logic)
// export async function DELETE(...) { ... }

// Schema for PATCH request body validation
const updateEmailSchema = z.object({
    editedContent: z.string().optional(),
    // You might want to add subject editing later:
    // editedSubject: z.string().optional(), 
});

export async function PATCH(
    request: Request,
    context: { params: { id?: string } } // Use context object name
) {
    try {
        // Await params from context before accessing
        const params = context.params;

        // Validate extracted ID string
        const potentialId = params?.id;
        const emailId = idParamSchema.parse(potentialId);
        console.log(`[API ColdEmail PATCH /${emailId}] Validated ID.`);

        // Validate request body
        const body = await request.json();
        const validatedBody = updateEmailSchema.parse(body);
        const { editedContent /*, editedSubject */ } = validatedBody;

        // Check if there's anything to update
        if (!editedContent /* && !editedSubject */) {
            return NextResponse.json({ message: 'No content provided for update' }, { status: 400 });
        }

        // Authentication
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        console.log(`[API ColdEmail PATCH /${emailId}] User ${userId} updating email.`);

        // Prepare data for update
        const dataToUpdate: { editedContent?: string } = {};
        if (editedContent !== undefined) {
            dataToUpdate.editedContent = editedContent;
        }
        // if (editedSubject !== undefined) {
        //     dataToUpdate.editedSubject = editedSubject; // Add field to prisma schema if needed
        // }


        // Update the email in the database
        const updatedEmail = await prisma.coldEmail.update({
            where: {
                id: emailId,
                userId: userId, // Ensure ownership
            },
            data: dataToUpdate,
            select: { id: true }, // Only return ID on success
        });

        console.log(`[API ColdEmail PATCH /${emailId}] Email updated successfully.`);
        return NextResponse.json({ message: 'Email updated successfully', id: updatedEmail.id });

    } catch (error) {
        console.error(`[API ColdEmail PATCH /id] Error updating email:`, error);
        if (error instanceof z.ZodError) {
            // Distinguish between ID error and body error if necessary
            if (error.issues.some(issue => issue.path.length === 0)) { // Heuristic: errors with empty path are likely from idParamSchema
                 return NextResponse.json({ message: 'Invalid Email ID parameter.', errors: error.flatten().formErrors }, { status: 400 });
            } else {
                 return NextResponse.json({ message: 'Invalid request body data.', errors: error.flatten().fieldErrors }, { status: 400 });
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
        return NextResponse.json({ message: 'Failed to update email', error: errorMessage }, { status: 500 });
    }
} 