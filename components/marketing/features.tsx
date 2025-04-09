import { Sparkles, Users2, Wallet, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Features() {
	return (
		<section className="py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:text-center">
					<h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
						Plan your wedding with confidence
					</p>
					<p className="mt-6 text-lg leading-8 text-muted-foreground">
						Our AI-powered platform provides all the tools you need to plan your perfect wedding,
						from budgeting to vendor selection.
					</p>
				</div>

				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
						{features.map((feature) => (
							<div 
								key={feature.name} 
								className="relative group rounded-3xl border p-8 hover:border-foreground/20 transition-colors"
							>
								<div className="flex items-center gap-x-3">
									<div className={`rounded-lg p-2 ring-1 ring-border/10 ${feature.iconBackground}`}>
										<feature.icon className="h-5 w-5 text-foreground" aria-hidden="true" />
									</div>
									<h3 className="text-lg font-semibold leading-7">
										{feature.name}
									</h3>
								</div>
								<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
									<p className="flex-auto">{feature.description}</p>
									<p className="mt-6">
										<Button variant="ghost" className="px-0 text-sm group-hover:text-primary">
											Learn more <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
										</Button>
									</p>
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}

const features = [
	{
		name: "AI-Powered Planning",
		description: "Get personalized recommendations for every aspect of your wedding based on your preferences, style, and budget.",
		icon: Sparkles,
		iconBackground: "bg-pink-500/10",
	},
	{
		name: "Smart Budgeting",
		description: "Track expenses, optimize costs, and get AI-powered suggestions to make the most of your wedding budget.",
		icon: Wallet,
		iconBackground: "bg-violet-500/10",
	},
	{
		name: "Vendor Matching",
		description: "Connect with pre-vetted vendors that match your style and budget requirements, all in one place.",
		icon: Users2,
		iconBackground: "bg-blue-500/10",
	},
];