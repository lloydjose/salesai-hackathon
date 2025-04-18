import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for validating the incoming persona details
const createSimulationSchema = z.object({
  personaDetails: z.object({
    arroganceLevel: z.string(),
    objectionLevel: z.string(),
    talkativeness: z.string(),
    confidenceLevel: z.string(),
    trustLevel: z.string(),
    emotionalTone: z.string(),
    decisionMakingStyle: z.string(),
    problemAwareness: z.string(),
    currentSolution: z.string(),
    urgencyLevel: z.string(),
    budgetConstraints: z.string(),
    painPoints: z.array(z.string()),
    prospectName: z.string(),
    jobTitle: z.string(),
    industry: z.string(),
  }).transform(val => JSON.parse(JSON.stringify(val))), // Ensure proper JSON serialization
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = createSimulationSchema.parse(body);

    const newSimulation = await prisma.callSimulation.create({
      data: {
        userId: session.user.id,
        personaDetails: validatedData.personaDetails,
        callStatus: "NOT_STARTED",
        duration: 0,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ id: newSimulation.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    
    console.error("[SIMULATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const simulations = await prisma.callSimulation.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        createdAt: true,
        callStatus: true,
        duration: true,
        personaDetails: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(simulations);
  } catch (error) {
    console.error('Failed to fetch simulations:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 