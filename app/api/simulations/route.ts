import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
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
      headers: await headers(),
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