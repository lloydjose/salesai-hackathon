"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Testimonial data
const testimonials = [
	{
		quote: "Our sales team is now able to see the entire customer journey in one place. This has helped us to identify opportunities and close deals faster.",
		author: "Marcus Maximus",
		location: "California",
		position: "Director of Sales",
		company: "Procore"
	},
	{
		quote: "From sales training to customer success, Scalaro has everything we need to track our customers and close deals faster.",
		author: "Jane Johnson",
		location: "New York",
		position: "Sales Manager",
		company: "Opus Telecom"
	},
	{
		quote: "A great tool to understand your sales pipeline and make sure you're always on top of your game!",
		author: "John Smith",
		location: "Texas",
		position: "Sales Director",
		company: "Active"
	}
];

// Carousel images and captions
const carouselItems = [
	{
		id: 1,
		title: "Prospect Intelligence Hub",
		description: "Before outreach — know exactly who they are, if they're worth it, and how to approach them."
	},
	{
		id: 2,
		title: "AI-Powered Outreach Engine",
		description: "For crafting smart, hyper-personalized outreach at scale — and reactivating lost leads."
	},
	{
		id: 3,
		title: "Call Training & Simulation Suite",
		description: "Make every rep perform like a top closer — without burning real leads."
	},
	{
		id: 4,
		title: "Call Intelligence & Deal Coaching",
		description: "After the call — find what you missed, what you nailed, and how to close."
	},
	{
		id: 5,
		title: "Sales Knowledge Loop",
		description: "Learn from every deal, and build organizational intelligence that compounds."
	}
];

export default function Hero() {
	const [activeIndex, setActiveIndex] = useState(0)
	const [activeTestimonial, setActiveTestimonial] = useState(0)

	// Auto rotate testimonials
	useEffect(() => {
		const interval = setInterval(() => {
			setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
		}, 5000)
		return () => clearInterval(interval)
	}, [])

	return (
		<div className="w-full bg-white dark:bg-black overflow-hidden relative -top-24 pt-24">
			{/* Gradient SVG background */}
			<svg
				className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-full min-w-[80rem] h-auto"
				width="1171"
				height="241"
				viewBox="0 0 1171 241"
				fill="none"
			>
				<g opacity=".175" filter="url(#filter0_f)">
					<path
						d="M731.735 -179.55C596.571 -157.762 516.36 -74.1815 552.576 7.13199C588.793 88.4455 727.724 136.701 862.887 114.913C998.051 93.1247 1078.26 9.54454 1042.05 -71.769C1005.83 -153.082 866.898 -201.337 731.735 -179.55Z"
						fill="url(#paint0_linear)"
					/>
					<path
						d="M378 114.106C520.489 114.106 636 45.8883 636 -38.2623C636 -122.413 520.489 -190.63 378 -190.63C235.511 -190.63 120 -122.413 120 -38.2623C120 45.8883 235.511 114.106 378 114.106Z"
						fill="url(#paint1_linear)"
					/>
				</g>
				<defs>
					<filter
						id="filter0_f"
						x="0"
						y="-310.63"
						width="1170.74"
						height="550.775"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
						<feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
					</filter>
					<linearGradient
						id="paint0_linear"
						x1="567.5"
						y1="1.03997"
						x2="1029.02"
						y2="64.6468"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#FF3B9A" />
						<stop offset="1" stopColor="#7000FF" />
					</linearGradient>
					<linearGradient
						id="paint1_linear"
						x1="155"
						y1="-11.0234"
						x2="511.855"
						y2="-162.127"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#FF3B9A" />
						<stop offset="0.504191" stopColor="#FF008A" />
						<stop offset="1" stopColor="#7000FF" />
					</linearGradient>
				</defs>
			</svg>
			
			<div className="container mx-auto md:py-14 relative">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
					{/* Left column - Text content */}
					<div className="flex flex-col space-y-6">
						{/* Floating banner */}
						<div className="hidden sm:flex items-center rounded-full bg-white/75 bg-linear-to-r from-pink-200/40 via-violet-200/40 to-indigo-200/40 border border-white/50 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-lg shadow-gray-800/5 ring-1 ring-gray-800/[.075] backdrop-blur-xl w-fit">
							<span>✨ Launching Early Access</span>
							<span className="mx-2">•</span>
							<a href="#" className="text-primary hover:text-primary/80 transition-colors">
								Join the waitlist
							</a>
						</div>

						<div className="space-y-4">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
								Your perfect wedding,
								<span className="text-primary block">effortlessly planned</span>
							</h1>
							<p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-[600px]">
								Plan, organize, and collaborate on your dream wedding. With a little help from AI.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							<Button asChild size="lg" className="h-12 px-6">
								<Link href="/authentication?type=sign-up">
									Plan your special day
								</Link>
							</Button>
						</div>

						<div className="pt-2">
							<div className="space-y-2">
								<div className="relative">
									<h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
										You are one step away from your best wedding plan
									</h3>
									<div className="relative h-[90px]">
										{testimonials.map((testimonial, index) => (
											<div
												key={index}
												className={`absolute top-0 left-0 w-full transition-all duration-500 ${
													activeTestimonial === index
														? "opacity-100 translate-y-0"
														: "opacity-0 translate-y-4"
												}`}
											>
												<div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800 max-w-[400px]">
													<p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
														{testimonial.quote}
													</p>
													<div className="mt-2 flex items-center gap-2">
														<div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
															<span className="text-[10px] font-medium text-primary">
																{testimonial.author.split(' ').map((name) => name[0]).join('')}
															</span>
														</div>
														<div className="flex items-center gap-2">
															<div className="font-medium text-xs text-primary">{testimonial.author}</div>
															<span className="text-gray-400 text-xs">•</span>
															<span className="text-gray-400 text-xs">•</span>
															<div className="text-xs text-gray-500">{testimonial.position} at {testimonial.company}</div>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right column - Feature descriptions */}
					<div className="relative rounded-xl">
						<div className="aspect-4/3 w-full relative">
							{carouselItems.map((item, index) => (
								<div
									key={item.id}
									className={cn(
										"absolute inset-0 transition-opacity duration-300",
										activeIndex === index ? "opacity-100" : "opacity-0 pointer-events-none",
									)}
								>
									<div className="p-6">
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
										<p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-md">
											{item.description}
										</p>
									</div>
								</div>
							))}
						</div>
						<div className="absolute bottom-0 right-0 p-4 flex gap-2">
							{carouselItems.map((_, index) => (
								<button
									key={index}
									onClick={() => setActiveIndex(index)}
									className={cn(
										"w-2.5 h-2.5 rounded-full transition-all",
										activeIndex === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80",
									)}
									aria-label={`View feature ${index + 1}`}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Carousel thumbnails/buttons */}
				<div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
					{carouselItems.map((item, index) => (
						<button
							key={item.id}
							onClick={() => setActiveIndex(index)}
							className={cn(
								"relative p-4 rounded-lg border transition-all overflow-hidden group",
								activeIndex === index
									? "border-primary bg-primary/5 shadow-xs"
									: "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
							)}
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
									{index === 0 && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
											<path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
										</svg>
									)}
									{index === 1 && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M3 8v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
											<path d="M20 8 9 15l-5-3" />
											<path d="m20 8-9-5-8 5" />
										</svg>
									)}
									{index === 2 && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<rect width="18" height="18" x="3" y="3" rx="2" />
											<path d="M3 9h18" />
											<path d="M9 21V9" />
										</svg>
									)}
									{index === 3 && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle cx="12" cy="12" r="10" />
											<path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
											<path d="M12 18V6" />
										</svg>
									)}
									{index === 4 && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
											<path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
											<path d="M22 12h-4" />
										</svg>
									)}
								</div>
								<div className="text-left">
									<h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h4>
								</div>
							</div>
							<div
								className={cn(
									"absolute bottom-0 left-0 h-0.5 bg-primary transition-all",
									activeIndex === index ? "w-full" : "w-0 group-hover:w-1/4",
								)}
							/>
						</button>
					))}
				</div>
			</div>
		</div>
	)
} 