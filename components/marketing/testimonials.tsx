"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn if not already globally available
import { InfiniteSlider } from "@/components/ui/infinite-slider"; // Import InfiniteSlider

// Sample Testimonial Data (Replace with your actual data)
const testimonialsData = [
  {
    id: 1,
    quote: "Scalaro completely transformed how our sales team approaches cold calls. The AI simulation is incredibly realistic and provides actionable feedback.",
    author: "Marcus Cole",
    position: "Head of Sales",
    company: "Innovate Solutions",
    // avatarUrl: "/images/avatar-fallback.jpg", // Removed
    rating: 5,
  },
  {
    id: 2,
    quote: "The pre-call planner is a game-changer. Our reps are more prepared, confident, and close deals faster than ever before.",
    author: "Samantha Lee",
    position: "Sales Manager",
    company: "Apex Enterprises",
    // avatarUrl: "/images/avatar-fallback.jpg", // Removed
    rating: 5,
  },
  {
    id: 3,
    quote: "Conversation Intelligence helps us pinpoint exactly where reps can improve. It's like having a personal coach for every call.",
    author: "David Rodriguez",
    position: "VP of Revenue",
    company: "Synergy Corp",
    // avatarUrl: "/images/avatar-fallback.jpg", // Removed
    rating: 4,
  },
  // Added 4th testimonial
  {
    id: 4,
    quote: "Integrating Scalaro was seamless. The insights we gain into our pipeline health are invaluable for forecasting and strategy.",
    author: "Chen Wang",
    position: "Sales Operations Lead",
    company: "Quantum Dynamics",
    // avatarUrl: "/images/avatar-fallback.jpg", // Removed
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="w-full mt-12 px-4 max-w-6xl mx-auto">
      {/* Header Section - Adjusted styles */}
      <div className="max-w-2xl text-left lg:text-left mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          We help 10X your <span className="font-serif font-normal italic">Closing Rate</span>
        </h2>
        {/* Standard muted-foreground for description */}
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          Hear how sales teams like yours are using Scalaro to boost performance.
        </p>
      </div>

      {/* Replace flex container with InfiniteSlider, use number for gap */}
      <InfiniteSlider gap={24} duration={40}> {/* Use number for gap, set duration */} 
        {testimonialsData.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-muted/30 rounded-xl p-6 flex flex-col gap-4 w-80 md:w-96"
          >
            {/* Rating */}
            {testimonial.rating && (
              <div className="flex items-center gap-0.5"> 
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < testimonial.rating ? "fill-primary text-primary" : "fill-muted stroke-muted-foreground/60"
                    )}
                    strokeWidth={1}
                  />
                ))}
              </div>
            )}
            {/* Quote */} 
            <blockquote className="text-base md:text-lg leading-relaxed text-foreground flex-grow">
               &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            {/* Author Info - No avatar, styled text */} 
            <div className="mt-auto pt-4 border-t border-border/30"> {/* Added separator */} 
              <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
              <p className="text-sm text-muted-foreground">
                {testimonial.position}, {testimonial.company}
              </p>
            </div>
          </div>
        ))}
      </InfiniteSlider>
    </section>
  );
}
