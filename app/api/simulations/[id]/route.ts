import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from 'zod';

// Add Schema for validating PATCH request body
const updateSimulationSchema = z.object({
  duration: z.number().int().positive().optional(),
  transcript: z.array(z.any()).optional(), // Keep transcript flexible for now
  callStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
});

// GET handler to fetch a specific simulation by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await headers() and params as they are now async
    const headerData = await headers(); 
    const routeParams = await params; // Await params here

    const session = await auth.api.getSession({
      headers: headerData, // Pass awaited headers
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const simulationId = routeParams.id; // Use awaited params

    if (!simulationId) {
      return new NextResponse("Simulation ID is required", { status: 400 });
    }

    const simulation = await prisma.callSimulation.findUnique({
      where: {
        id: simulationId,
        userId: session.user.id, // Ensure the user owns this simulation
      },
      include: {
        user: {
          select: { name: true, image: true }, // Select only needed user fields
        },
      },
    });

    if (!simulation) {
      return new NextResponse("Simulation not found", { status: 404 });
    }
    
    // Directly use personaDetails from Prisma (assuming it parses JSON correctly)
    const personaDetails = (simulation.personaDetails || {}) as any; // Cast to any or define type

    // Ensure the response includes all necessary data for the feedback page
    const responseData = {
        id: simulation.id,
        user: {
            name: simulation.user.name,
            image: simulation.user.image,
        },
        // prospect: { // Redundant if personaDetails is included below
        //     name: personaDetails?.prospectName || 'Prospect', 
        // },
        personaDetails: personaDetails, 
        callStatus: simulation.callStatus,
        duration: simulation.duration, // *** Add duration ***
        transcript: simulation.transcript || [], // *** Add transcript (default to empty array) ***
        createdAt: simulation.createdAt, // Might be useful for display
    };

    return NextResponse.json(responseData);

  } catch (error) {
    // Use routeParams here as well if needed for logging
    const idForError = await params.id || 'unknown';
    console.error(`[SIMULATIONS_GET_${idForError}]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 

// Add PATCH handler to update simulation results
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } } // Use params.id here
) {
  try {
    // Await headers and params first
    const headerData = await headers();
    const routeParams = await params; // *** Await params ***

    const session = await auth.api.getSession({
      headers: headerData, // Pass awaited headers
    });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const simulationId = routeParams.id; // Use id from awaited/assigned params
    if (!simulationId) {
        return NextResponse.json({ message: 'Simulation ID is required' }, { status: 400 });
    }

    const body = await request.json();

    // Validate request body
    const validation = updateSimulationSchema.safeParse(body);
    if (!validation.success) {
        console.error("[API SIMULATION PATCH] Validation Error:", validation.error.errors);
        return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }
    
    const { duration, transcript, callStatus } = validation.data;

    // Check if simulation exists and belongs to the user
    const existingSimulation = await prisma.callSimulation.findUnique({
        where: { id: simulationId, userId: session.user.id } // Use simulationId from params.id
    });

    if (!existingSimulation) {
         return NextResponse.json({ message: 'Simulation not found or access denied' }, { status: 404 });
    }

    // Update the simulation
    const updatedSimulation = await prisma.callSimulation.update({
      where: {
        id: simulationId, // Use simulationId from params.id
      },
      data: {
        duration,
        transcript, // Prisma handles JSON type
        callStatus,
      },
    });

    return NextResponse.json(updatedSimulation);

  } catch (error) {
    console.error("[API SIMULATION PATCH] Error updating simulation:", error);
     // Handle potential Prisma errors (e.g., record not found if check failed somehow)
     if (error instanceof Error && 'code' in error && error.code === 'P2025') {
         return NextResponse.json({ message: 'Simulation not found during update' }, { status: 404 });
     }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 