import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AuthTemplate({
	children,
}: {
	children: React.ReactNode;
}) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		console.log(session);
		// If session exists, redirect to dashboard
		// if (session) {
		// 	redirect("/dashboard");
		// }

		return children;
	} catch (error) {
		console.error(error);
		// If there's an error checking session, allow access to auth pages
		return children;
	}
} 