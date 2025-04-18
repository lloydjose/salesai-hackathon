import Hero from "@/components/marketing/hero";
import { Feature } from "@/components/marketing/features";
import TrustedBySection from "@/components/marketing/trusted-section";
import Testimonials from "@/components/marketing/testimonials";
import Pricing from "@/components/marketing/pricing";

export const metadata = {
	title: "Scalaro - The revenue intelligence layer for sales teams",
	description: "Scalaro is the revenue intelligence layer for sales teams. It helps you understand your customers, your sales, and your business.",
};

export default function Home() {
	return (
		<main className="min-h-screen">
				<Hero />
				<TrustedBySection />
				<Feature />
				<div className="bg-muted/40 py-4">
				<Testimonials />
				</div>
				<Pricing />
		</main>
	);
} 