import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardTemplate({
	children,
}: {
	children: React.ReactNode;
}) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			redirect("/authentication");
		}

		return children;
	} catch (error) {
		console.error(error);
		// If there's an error checking session, redirect to auth
		redirect("/authentication");
	}
} 