import { Inter } from "next/font/google";
import { AppSidebar } from "@/components/shared/app-sidebar";
import {
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={`relative min-h-screen ${inter.className}`}>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<main className="flex flex-1 flex-col">
						{children}
					</main>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
} 