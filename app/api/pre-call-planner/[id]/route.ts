import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: briefId } = await params;

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    if (!briefId) {
      return NextResponse.json({ message: 'Brief ID is required' }, { status: 400 });
    }

    console.log(`[API PreCallPlanner GET /id] Fetching brief: ${briefId} for user: ${userId}`);

    const brief = await prisma.callPrepBrief.findUnique({
      where: {
        id: briefId,
        userId: userId, // Ensure the user owns this brief
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        formInput: true,  // User's input for the plan
        aiCallPrep: true, // The generated AI brief
        prospect: {       // Include prospect details
          select: {
            id: true,
            name: true,
            linkedinProfileUrl: true // Maybe useful for linking back
          }
        }
      }
    });

    if (!brief) {
      console.log(`[API PreCallPlanner GET /id] Brief not found or access denied for ID: ${briefId}`);
      return NextResponse.json({ message: 'Pre-call plan not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(brief);

  } catch (error) {
    console.error("[API PreCallPlanner GET /id] Error fetching brief:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to fetch pre-call plan details', error: errorMessage }, { status: 500 });
  }
} 