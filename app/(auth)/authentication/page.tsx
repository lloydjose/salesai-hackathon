"use client";

import SignIn from "@/components/auth/sign-in";
import { SignUp } from "@/components/auth/sign-up";
import { client } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

// Testimonial data
const testimonials = [
	{
		quote: "Our sales team is now able to see the entire customer journey in one place. This has helped us to identify opportunities and close deals faster.",
		author: "Anthony",
		date: "Director of Sales, Procore"
	},
	{
		quote: "From sales training to customer success, Scalaro has everything we need to track our customers and close deals faster.",
		author: "Jane Johnson",
		date: "Sales Manager, Opus Telecom"
	},
	{
		quote: "A great tool to understand your sales pipeline and make sure you're always on top of your game!",
		author: "John Smith",
		date: "Sales Director, Active"
	}
];

export default function Page() {
	return (
		<Suspense>
			<AuthenticationContent />
		</Suspense>
	);
}

function AuthenticationContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [activeForm, setActiveForm] = useState(
		searchParams.get("type") === "sign-up" ? "sign-up" : "sign-in"
	);
	const initialEmailFromUrl = searchParams.get("email");
	const [activeTestimonial, setActiveTestimonial] = useState(0);

	useEffect(() => {
		client.oneTap({
			fetchOptions: {
				onError: ({ error }) => {
					toast.error(error.message || "An error occurred");
				},
				onSuccess: () => {
					toast.success("Successfully signed in");
					router.push("/dashboard");
				},
			},
		});
	}, [router]);

	useEffect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set("type", activeForm);
		window.history.replaceState({}, "", url.pathname + url.search);
	}, [activeForm]);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed inset-0 flex flex-col lg:flex-row bg-background">
			{/* Left side - Content */}
			<div className="w-full lg:w-[40%] p-6 lg:p-10 flex flex-col">
				<div className="mb-0">
					<Link href="/">
						<Image
							src="/mainlogo.svg"
							alt="Scalaro"
							width={120}
							height={30}
							className="dark:invert"
						/>
					</Link>
				</div>
				<div className="lg:min-h-[200px] flex flex-col justify-center">
					<h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 py-4">
						{activeForm === "sign-in" ? (
							"Welcome back"
						) : (
							"Let's get you started"
						)}
					</h1>
					<p className="text-lg lg:text-xl text-muted-foreground">
						{activeForm === "sign-in" ? (
							"Sales leaders are using Scalaro to make their sales teams unstoppable."
						) : (
							"Begin your sales journey with AI-powered assistance every step of the way."
						)}
					</p>
				</div>

				{/* Testimonial carousel - Hidden on mobile until after form */}
				<div className="hidden lg:block lg:flex-1">
					<div className="h-full flex flex-col justify-center">
						<div className="relative">
							<div className="space-y-4 bg-[#eeeeee] p-4 rounded-lg">
								{testimonials.map((testimonial, index) => (
									<div
										key={index}
										className={`transition-all duration-500 ${
											activeTestimonial === index
												? "opacity-100 translate-y-0"
												: "opacity-0 translate-y-4 absolute"
										}`}
									>
										<blockquote className="text-lg italic text-muted-foreground">
											{testimonial.quote}
										</blockquote>
										<div className="mt-2">
											<div className="font-semibold">{testimonial.author}</div>
											<div className="text-sm text-muted-foreground">{testimonial.date}</div>
										</div>
									</div>
								))}
							</div>
							<div className="flex gap-2 mt-4">
								{testimonials.map((_, index) => (
									<button
										key={index}
										onClick={() => setActiveTestimonial(index)}
										className={`w-2 h-2 rounded-full transition-all ${
											activeTestimonial === index
												? "bg-primary w-4"
												: "bg-muted hover:bg-muted-foreground"
										}`}
										aria-label={`Go to testimonial ${index + 1}`}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right side - Form */}
			<div className="w-full lg:w-[60%] bg-muted/10 flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-center p-6 lg:p-10">
				<div className="w-full max-w-[400px]">
					{activeForm === "sign-in" ? (
						<>
							<SignIn />
							<div className="text-center text-sm mt-6">
								<span className="text-muted-foreground">Not registered yet? </span>
								<button
									onClick={() => setActiveForm("sign-up")}
									className="text-primary hover:text-primary/80 font-medium transition-colors"
								>
									Create an account
								</button>
							</div>
						</>
					) : (
						<>
							<SignUp initialEmail={initialEmailFromUrl} />
							<div className="text-center text-sm mt-6">
								<span className="text-muted-foreground">Already have an account? </span>
								<button
									onClick={() => setActiveForm("sign-in")}
									className="text-primary hover:text-primary/80 font-medium transition-colors"
								>
									Sign in
								</button>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Mobile testimonials - Shown only on mobile after form */}
			<div className="lg:hidden p-6 mt-auto">
				<div className="relative">
					<div className="space-y-4">
						{testimonials.map((testimonial, index) => (
							<div
								key={index}
								className={`transition-all duration-500 ${
									activeTestimonial === index
										? "opacity-100 translate-y-0"
										: "opacity-0 translate-y-4 absolute"
								}`}
							>
								<blockquote className="text-lg italic text-muted-foreground">
									{testimonial.quote}
								</blockquote>
								<div className="mt-2">
									<div className="font-semibold">{testimonial.author}</div>
									<div className="text-sm text-muted-foreground">{testimonial.date}</div>
								</div>
							</div>
						))}
					</div>
					<div className="flex gap-2 mt-4">
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => setActiveTestimonial(index)}
								className={`w-2 h-2 rounded-full transition-all ${
									activeTestimonial === index
										? "bg-primary w-4"
										: "bg-muted hover:bg-muted-foreground"
								}`}
								aria-label={`Go to testimonial ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
