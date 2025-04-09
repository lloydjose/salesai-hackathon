export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import UserCard from "@/components/account/user-card";
import { OrganizationCard } from "@/components/account/organization-card";
import AccountSwitch from "@/components/account/account-switch";
import { PageHeader } from "@/components/shared/page-header";

export default async function AccountPage() {
	const [activeSessions, deviceSessions, organization, subscriptions] =
		await Promise.all([
			auth.api.listSessions({
				headers: await headers(),
			}),
			auth.api.listDeviceSessions({
				headers: await headers(),
			}),
			auth.api.getFullOrganization({
				headers: await headers(),
			}),
			auth.api.listActiveSubscriptions({
				headers: await headers(),
			}),
		]);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<>
			<PageHeader title="Settings" />
			<div className="flex gap-4 flex-col p-4">
				<AccountSwitch
					sessions={JSON.parse(JSON.stringify(deviceSessions))}
				/>
				<UserCard
					session={JSON.parse(JSON.stringify(session))}
					activeSessions={JSON.parse(JSON.stringify(activeSessions))}
					subscription={subscriptions.find(
						(sub) => sub.status === "active" || sub.status === "trialing",
					)}
				/>
				<OrganizationCard
					session={JSON.parse(JSON.stringify(session))}
					activeOrganization={JSON.parse(JSON.stringify(organization))}
				/>
			</div>
		</>
	);
}
