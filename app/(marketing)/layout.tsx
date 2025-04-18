"use client";

import Navbar from "@/components/shared/header";
import Footer from "@/components/shared/footer";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-grow">
			{children}
			</main>
			<Footer />
		</div>
	);
} 