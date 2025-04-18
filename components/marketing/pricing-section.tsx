'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Star } from "lucide-react";

// Define plan features - adjust features for marketing page
const plansData = [
	{
		id: "starter",
		name: "Starter",
		priceMonthly: "$50",
		priceAnnual: "$480", // $40/month
        period: "/month",
		features: [
			"Core AI Features",
			"1 User Seat",
			"Basic Call Simulation",
			"Standard Email Generation",
            "Community Support"
		],
        isPopular: false,
        cta: "Get Started",
        href: "/authentication"
	},
	{
		id: "professional",
		name: "Professional",
		priceMonthly: "$99",
        priceAnnual: "$948", // $79/month
        period: "/month",
		features: [
			"All Starter Features",
			"5 User Seats",
            "Advanced Call Simulation",
            "Enhanced Email Generation & Analysis",
            "Conversation Intelligence",
            "Priority Support"
		],
        isPopular: true,
        cta: "Choose Plan",
        href: "/authentication"
	},
	{
		id: "enterprise",
		name: "Enterprise",
		priceMonthly: "Custom",
        priceAnnual: "Custom",
        period: "",
		features: [
			"All Professional Features",
			"Unlimited Users",
			"Custom AI Models",
			"Dedicated Infrastructure",
			"24/7 Premium Support",
            "Custom Integrations & API"
		],
        isPopular: false,
        cta: "Contact Sales",
        href: "/contact" // Link to a contact page or form
	},
];

export function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing Plans</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose the right plan for your team</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Scalable solutions designed for sales teams of all sizes. Start improving your performance today.
                        </p>
                    </div>
                    {/* Billing Toggle */}
                    <div className="flex items-center space-x-2 pt-4">
                        <Label htmlFor="billing-toggle" className="text-sm font-medium">Monthly</Label>
                        <Switch
                            id="billing-toggle"
                            checked={isAnnual}
                            onCheckedChange={setIsAnnual}
                            aria-label={isAnnual ? 'Switch to monthly billing' : 'Switch to annual billing'}
                        />
                        <Label htmlFor="billing-toggle" className="text-sm font-medium">
                            Annual <span className="text-xs text-green-600 font-semibold">(Save ~20%)</span>
                        </Label>
                    </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                    {plansData.map((plan) => {
                        const displayPrice = isAnnual ? plan.priceAnnual : plan.priceMonthly;
                        const displayPeriod = plan.id !== 'enterprise' ? (isAnnual ? '/year' : '/month') : '';

                        return (
                            <Card
                                key={plan.id}
                                className={cn(
                                    "flex flex-col transition-shadow duration-300 hover:shadow-lg relative border",
                                    plan.isPopular ? "border-primary ring-2 ring-primary shadow-xl" : "border-border",
                                )}
                            >
                                {plan.isPopular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary py-1 px-3 rounded-full flex items-center z-10 shadow-md">
                                        <Star className="text-primary-foreground h-4 w-4 fill-current mr-1.5" />
                                        <span className="text-primary-foreground text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <CardHeader className="pt-8">
                                    <CardTitle className="text-2xl font-bold text-center mb-2">{plan.name}</CardTitle>
                                    <CardDescription className="flex items-baseline justify-center gap-1 text-center">
                                        <span className="text-4xl font-extrabold tracking-tight text-foreground">
                                            {displayPrice}
                                        </span>
                                        <span className="text-sm font-semibold text-muted-foreground">
                                            {displayPeriod}
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between pt-4 pb-8 px-6"> {/* Use flex to push button down */}
                                    <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Check className="size-5 shrink-0 text-green-500 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        asChild
                                        className={cn(
                                            "w-full mt-auto text-md py-3",
                                            plan.isPopular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                                        )}
                                        size="lg"
                                    >
                                        <Link href={plan.href}>{plan.cta}</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
} 