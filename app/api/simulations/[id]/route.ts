import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import { z } from 'zod';

// Add Schema for validating PATCH request body
const updateSimulationSchema = z.object({
  duration: z.number().int().positive().optional(),
  transcript: z.array(z.any()).optional(), // Keep transcript flexible for now
  callStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
});

// GET handler to fetch a specific simulation by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: simulationId } = await params;

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!simulationId) {
      return new NextResponse("Simulation ID is required", { status: 400 });
    }

    const simulation = await prisma.callSimulation.findUnique({
      where: {
        id: simulationId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    if (!simulation) {
      return new NextResponse("Simulation not found", { status: 404 });
    }
    
    const personaDetails = (simulation.personaDetails || {}) as any;

    const responseData = {
        id: simulation.id,
        user: {
            name: simulation.user.name,
            image: simulation.user.image,
        },
        personaDetails: personaDetails, 
        callStatus: simulation.callStatus,
        duration: simulation.duration,
        transcript: simulation.transcript || [],
        createdAt: simulation.createdAt,
        feedback: simulation.feedback || null,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    let idForError = 'unknown';
    try {
      const awaitedParams = await params;
      idForError = awaitedParams?.id || 'unknown';
    } catch { /* Ignore if awaiting params fails here */ }
    console.error(`[SIMULATIONS_GET_${idForError}]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 

// Add PATCH handler to update simulation results
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: simulationId } = await params;

    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!simulationId) {
        return NextResponse.json({ message: 'Simulation ID is required' }, { status: 400 });
    }

    const body = await request.json();

    const validation = updateSimulationSchema.safeParse(body);
    if (!validation.success) {
        console.error("[API SIMULATION PATCH] Validation Error:", validation.error.errors);
        return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }
    
    const { duration, transcript, callStatus } = validation.data;

    const existingSimulation = await prisma.callSimulation.findUnique({
        where: { id: simulationId, userId: session.user.id }
    });

    if (!existingSimulation) {
         return NextResponse.json({ message: 'Simulation not found or access denied' }, { status: 404 });
    }

    const updatedSimulation = await prisma.callSimulation.update({
      where: {
        id: simulationId,
      },
      data: {
        duration,
        transcript,
        callStatus,
      },
    });

    return NextResponse.json(updatedSimulation);

  } catch (error) {
    console.error("[API SIMULATION PATCH] Error updating simulation:", error);
     if (error instanceof Error && 'code' in error && error.code === 'P2025') {
         return NextResponse.json({ message: 'Simulation not found during update' }, { status: 404 });
     }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 