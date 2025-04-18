"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Group features for better organization
const featureGroups = [
  {
    category: "Prospecting & Outreach",
    features: [
      "Get Linkedin Prospect",
      "Analyze Prospect With AI",
      "Personalized Outreach",
      "Prepare For Call With Prospect",
    ],
  },
  {
    category: "Call Simulation & Training",
    features: [
      "1 to 1 AI Cold Call Simulation",
      "Performance Feedback",
      "Personal Progress Tracking",
    ],
  },
  {
    category: "Intelligence & Analytics",
    features: [
      "Upload And Analyze Cold Calls",
      "Manual Deal Notes",
      "Get Insights Into Your Pipeline",
    ],
  },
];

// Colors inspired by TrustedBySection stats cards
const cardColorStyles = [
  { bg: "bg-[#fff8f3]", text: "text-[#874621]" }, // Orange-ish
  { bg: "bg-[#fff4fc]", text: "text-[#732065]" }, // Purple-ish
  { bg: "bg-[#fff4f6]", text: "text-[#933349]" }, // Pink-ish
];

export default function PricingSection() {
  return (
    // Section container with subtle background gradient and standard width/padding
    <section className="relative w-full py-16 md:py-24 px-4 max-w-6xl mx-auto">
       {/* Subtle background like hero but softer */}
        <div
            className="absolute inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
            >
            <div
                className="absolute left-1/2 top-0 h-[90rem] w-[80rem] -translate-x-1/2"
                style={{
                backgroundImage:
                    'radial-gradient(closest-side, hsl(var(--primary)/0.1), transparent)',
                }}
            />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
        {/* Left Side: Feature List */}
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
            Close Your Next Deal Today
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Pricing that helps you start you closing rate efficiently
          </p>

          {/* Features Grid - Apply cyclical colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {featureGroups.map((group, index) => {
              const colors = cardColorStyles[index % cardColorStyles.length];
              return (
                // Conditionally apply col-span-2 to the first card on sm screens and up
                <div 
                  key={group.category} 
                  className={cn(
                    "rounded-xl p-6 border border-border/50", 
                    colors.bg,
                    index === 0 && "sm:col-span-2" // Make first card full width on sm+
                  )}
                >
                  <h3 className={cn("text-base font-semibold mb-3", colors.text)}>
                    {group.category}
                  </h3>
                  {/* Feature list within the card */}
                  <ul role="list" className="space-y-2">
                    {group.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className={cn("h-4 w-4 flex-shrink-0 mr-2 mt-1", colors.text)} strokeWidth={2.5} />
                        {/* Use the dynamic text color for features too, but muted */}
                        <span className={cn("text-sm leading-snug", colors.text)} style={{ opacity: 0.8 }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: CTA Card (Sticky on Large Screens) */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <div className="bg-muted/40 rounded-l p-8 border">
            <h3 className="text-lg font-semibold text-foreground">Free Plan</h3>
            <p className="mt-1 text-muted-foreground text-sm mb-6">
              Perfect for individual reps exploring AI sales tools.
            </p>
            <p className="relative flex items-baseline gap-x-1 mb-6">
              <span className="text-5xl font-bold tracking-tight text-foreground">$0</span>
              <span className="text-sm font-semibold leading-6 text-muted-foreground">/ month</span>
            </p>
            <Link href="/authentication?type=sign-up" className="w-full">
              <Button size="lg" className="w-full">Get Started Free</Button>
            </Link>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" strokeWidth={3}/>
                Core AI Prospecting Tools
              </li>
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" strokeWidth={3}/>
                Basic Call Simulation
              </li>
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" strokeWidth={3}/>
                Standard Call Analysis
              </li>
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" strokeWidth={3}/>
                Playbook Builder For Teams
              </li>
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" strokeWidth={3}/>
                Email Writer Intelligence
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
} 