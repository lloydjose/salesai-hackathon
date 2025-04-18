"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail, // For Cold Email
  Target, // For Objection Trainer
  BookOpen, // For Playbook
  Briefcase, // For Planner
} from "lucide-react";
import Image from 'next/image'; // Import Image
import { SavedProspectsTab } from "./saved-prospects-tab"; // Import SavedProspectsTab
import { CallReportsTab } from "./call-reports-tab"; // Import CallReportsTab

// Data for Large Action Cards
const largeActionCards = [
  {
    title: "Analyze a Prospect",
    description: "Import from LinkedIn and get AI-driven insights.",
    href: "/dashboard/prospect-research",
    imageSrc: "/images/prospecting-feature.webp", // Replace with actual image
    alt: "Illustration for prospect analysis",
    bgColor: "#fff3f6" // Added background color
  },
  {
    title: "Start Call Simulation",
    description: "Practice pitches and handle objections with an AI.",
    href: "/dashboard/realtime-simulator",
    imageSrc: "/images/cold-calling.webp", // Replace with actual image
    alt: "Illustration for AI call simulation",
    bgColor: "#fff8f3" // Added background color
  },
  {
    title: "Review Past Calls",
    description: "Upload recordings for deep conversation analysis.",
    href: "/dashboard/conversation-intelligence",
    imageSrc: "/images/conversation-feature.webp", // Replace with actual image
    alt: "Illustration for conversation intelligence",
    bgColor: "#fff3fb" // Added background color
  }
];

// Data for Small Feature Cards
const smallFeatureCards = [
  { title: "Pre-Call Planner", href: "/dashboard/pre-call-planner", icon: Briefcase, description: "Generate tailored call plans." },
  { title: "Cold Email Writer", href: "/dashboard/cold-emails", icon: Mail, description: "Craft effective outreach emails." },
  { title: "Objection Trainer", href: "#", icon: Target, description: "Master handling difficult responses." }, // Placeholder link
  { title: "Sales Playbook", href: "#", icon: BookOpen, description: "Build and share team strategies." }, // Placeholder link
];

// Mock Data for Recent Activity - This can be removed now
// const recentActivities = [...];

export function DashboardOverview() {
  // Placeholder - Replace with actual user name from session eventually
  const userName = "Sales Pro";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Welcome Header */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Welcome back, {userName}!</h1>
      </div>

      {/* Remove Quick Stats Grid */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> ... </div> */}

      {/* --- NEW: Large Action Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {largeActionCards.map((card) => (
          <Link key={card.title} href={card.href} className="group block">
            <Card className="overflow-hidden h-full transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg rounded-xl">
              <div className="relative w-full h-40 bg-muted/50 overflow-hidden rounded-t-xl">
                <Image
                  src={card.imageSrc}
                  alt={card.alt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
              </div>
              <div style={{ backgroundColor: card.bgColor }} className="p-4 rounded-b-xl">
                <CardHeader className="p-0 pb-1">
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Remove Old Quick Actions Grid */}
      {/* <div className="grid gap-4 md:grid-cols-2"> ... </div> */}
      
      {/* --- NEW: Small Feature Cards --- */}
      <div className="mb-6">
          <h2 className="text-base font-semibold text-muted-foreground mb-3 px-1">Explore More Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {smallFeatureCards.map((card) => (
              <Link key={card.title} href={card.href} className="group block">
                <Card className="p-4 h-full transition-all duration-300 group-hover:bg-muted/60 group-hover:border-border/80">
                    <div className="mb-3">
                         <card.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{card.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                </Card>
              </Link>
            ))}
        </div>
      </div>

      {/* --- NEW: Two Column Layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Saved Prospects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Prospects</CardTitle>
            <CardDescription>Quick view of your latest saved prospects.</CardDescription>
          </CardHeader>
          <CardContent>
            <SavedProspectsTab />
          </CardContent>
        </Card>

        {/* Column 2: Call Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Call Reports</CardTitle>
            <CardDescription>Summary of analyzed call performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <CallReportsTab />
          </CardContent>
        </Card>
      </div>

      {/* Removed Recent Activity Card */}
      {/* <Card> ... </Card> */}
    </div>
  );
} 