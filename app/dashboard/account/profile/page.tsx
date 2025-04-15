export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import UserProfileCard from "@/components/profile/user-profile-card";
import { PageHeader } from "@/components/shared/page-header";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication?type=sign-in");
  }

  const userProfile = await prisma.userProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <>
      <PageHeader title="Profile" />
      <div className="flex gap-4 flex-col p-4">
        <UserProfileCard
          session={JSON.parse(JSON.stringify(session))}
          userProfile={JSON.parse(JSON.stringify(userProfile))}
        />
      </div>
    </>
  );
} 