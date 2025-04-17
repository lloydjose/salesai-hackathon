import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const prospects = await prisma.prospect.findMany({
      where: {
        userId: userId,
      },
      // Select specific fields needed for the list view card
      select: {
        id: true,
        name: true,
        linkedinProfileUrl: true,
        linkedinData: true, // Need this for image/title extraction
        customData: true,
        source: true,
        createdAt: true,
        // Avoid selecting large fields like aiAnalysis if not needed for list
      },
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
    });

    return NextResponse.json(prospects);

  } catch (error) {
    console.error("[API Prospects GET]", error);
    return NextResponse.json({ message: 'Failed to fetch prospects' }, { status: 500 });
  }
} 