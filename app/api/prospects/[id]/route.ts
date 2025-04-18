import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
// eslint-disable-next-line
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: prospectId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    if (!prospectId) {
      return NextResponse.json({ message: 'Prospect ID is required' }, { status: 400 });
    }

    const prospect = await prisma.prospect.findUnique({
      where: {
        id: prospectId,
        userId: userId, // Security check: Ensure user owns this prospect
      },
      // Select all fields needed for the detail view
      // select: { ... } // Or omit select to get all fields
    });

    if (!prospect) {
      return NextResponse.json({ message: 'Prospect not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(prospect);

  } catch (error) {
    console.error("[API Prospect GET /id]", error);
    return NextResponse.json({ message: 'Failed to fetch prospect details' }, { status: 500 });
  }
} 