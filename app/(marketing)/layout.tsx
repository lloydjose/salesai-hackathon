"use client";

import Navbar from "@/components/shared/header";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative min-h-screen">
			<Navbar />
			{children}
		</div>
	);
} 