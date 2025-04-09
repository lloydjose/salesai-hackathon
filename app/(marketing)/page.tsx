import Hero from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";

export const metadata = {
	title: "Scalaro - The revenue intelligence layer for sales teams",
	description: "Scalaro is the revenue intelligence layer for sales teams. It helps you understand your customers, your sales, and your business.",
};

export default function Home() {
	return (
		<main className="min-h-screen">
				<Hero />
				<Features />
		</main>
	);
} 