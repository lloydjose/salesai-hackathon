import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userProfile } from "@/lib/data/user-profile";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[USER_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = userProfile.parse(body);

    const updatedProfile = await prisma.userProfile.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        ...validatedData,
        userId: session.user.id,
      },
      update: validatedData,
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[USER_PROFILE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 