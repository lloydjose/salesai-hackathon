"use client";

import { Loader2, Database, FileText, CheckCircle2, Rocket } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image"; // Import Image
import { cn } from "@/lib/utils";

// Define the states for the demo animation
type PlannerState =
  | "idle"
  | "fetching-info"   // Getting prospect details
  | "analyzing-data"  // Processing info
  | "generating-plan" // Creating the plan doc
  | "plan-ready";     // Plan complete

interface PreCallPlannerAnimationProps {
  demoMode?: boolean;
  fetchDuration?: number;
  analyzeDuration?: number;
  generateDuration?: number;
  readyDuration?: number;
  idleDuration?: number;
  className?: string;
  prospectImageUrl?: string; // Optional image URL
}

// Colors (can adjust as needed)
const fetchColor = "hsl(var(--primary))"; // Use primary for fetching
const analyzeColor = "hsl(315 55% 29%)"; // User color from voice input
const generateColor = "hsl(348 50% 39%)"; // Analyze color from voice input
const readyColor = "hsl(140 60% 33%)"; // A green success color
const idleColor = "hsl(var(--muted-foreground) / 0.5)";

export function PreCallPlannerAnimation({
  demoMode = false,
  fetchDuration = 2500,
  analyzeDuration = 3000,
  generateDuration = 3500,
  readyDuration = 4000,
  idleDuration = 1500,
  className,
  prospectImageUrl,
}: PreCallPlannerAnimationProps) {
  const [currentState, setCurrentState] = useState<PlannerState>("idle");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Demo animation loop effect
  useEffect(() => {
    if (!demoMode || !isClient) {
        setCurrentState("idle");
        return;
    }

    let timeoutId: NodeJS.Timeout;

    const sequence: { state: PlannerState; duration: number }[] = [
      { state: "idle", duration: idleDuration },
      { state: "fetching-info", duration: fetchDuration },
      { state: "analyzing-data", duration: analyzeDuration },
      { state: "generating-plan", duration: generateDuration },
      { state: "plan-ready", duration: readyDuration },
    ];

    let currentIndex = 0;

    const runSequence = () => {
        const currentStep = sequence[currentIndex];
        setCurrentState(currentStep.state);

        timeoutId = setTimeout(() => {
            currentIndex = (currentIndex + 1) % sequence.length;
            runSequence();
        }, currentStep.duration);
    };

    const initialTimeout = setTimeout(runSequence, 100);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [
    demoMode,
    isClient,
    fetchDuration,
    analyzeDuration,
    generateDuration,
    readyDuration,
    idleDuration
  ]);

  const getStatusContent = (): { icon: React.ReactNode; text: string; color: string } => {
     switch (currentState) {
      case "fetching-info": return { icon: <Database size={18} />, text: "Fetching Prospect Data...", color: fetchColor };
      case "analyzing-data": return { icon: <Loader2 size={18} className="animate-spin" />, text: "Analyzing Information...", color: analyzeColor };
      case "generating-plan": return { icon: <FileText size={18} />, text: "Generating Pre-Call Plan...", color: generateColor };
      case "plan-ready": return { icon: <CheckCircle2 size={18} />, text: "Personalized Plan Ready!", color: readyColor };
      case "idle":
      default: return { icon: <Rocket size={18} />, text: "Ready to Plan Call", color: idleColor };
    }
  };
  const { icon: statusIcon, text: statusText, color: currentStatusColor } = getStatusContent();

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center", className)}>
      {/* Status Icon and Text Area */}
      <div className="flex items-center gap-2 mb-4 h-6 w-full justify-center px-2">
        {/* Wrap icon in a span and apply style to the span */}
        <span style={{ color: currentStatusColor }} className="flex items-center justify-center">
          {statusIcon}
        </span>
        <p className="text-sm font-medium text-muted-foreground truncate">{statusText}</p>
      </div>

      {/* Enhanced Animation Canvas Area */}
      <div className="relative w-full h-24 bg-muted/30 rounded-lg overflow-hidden border-2 border-transparent transition-colors duration-500" style={{ borderColor: currentState !== 'idle' ? currentStatusColor : 'transparent' }}>
        {/* Optional Prospect Image Background */}
        {prospectImageUrl && (
          <Image
            src={prospectImageUrl}
            alt="Prospect"
            layout="fill"
            objectFit="cover"
            className="opacity-10 blur-sm"
          />
        )}

        {/* Centered Core Element (represents the focus) */}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className={cn("w-8 h-8 rounded-full border-2 transition-all duration-500",
                currentState === 'idle' && 'bg-muted',
                currentState === 'fetching-info' && 'bg-primary/20 border-primary animate-pulse',
                currentState === 'analyzing-data' && 'bg-purple-500/20 border-purple-500 scale-110',
                currentState === 'generating-plan' && 'bg-pink-500/20 border-pink-500 animate-pulse',
                currentState === 'plan-ready' && 'bg-green-500/20 border-green-500'
           )} style={{ borderColor: currentStatusColor, backgroundColor: `${currentStatusColor}20`}}/>
        </div>

        {/* State Icons - Fade In/Out */}
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Fetch Icon */}
            <Database size={24} className={cn("absolute transition-opacity duration-300", currentState === 'fetching-info' ? 'opacity-80 animate-pulse' : 'opacity-0')} style={{ color: fetchColor, left: '15%' }} />
            {/* Analyze Icon */}
            <Loader2 size={24} className={cn("absolute transition-opacity duration-300", currentState === 'analyzing-data' ? 'opacity-80 animate-spin' : 'opacity-0')} style={{ color: analyzeColor }} />
            {/* Generate Icon */}
            <FileText size={24} className={cn("absolute transition-opacity duration-300", currentState === 'generating-plan' ? 'opacity-80 animate-pulse' : 'opacity-0')} style={{ color: generateColor, right: '15%' }} />
             {/* Ready Icon */}
             <CheckCircle2 size={24} className={cn("absolute transition-opacity duration-300 scale-110", currentState === 'plan-ready' ? 'opacity-100' : 'opacity-0')} style={{ color: readyColor }} />
        </div>

      </div>
    </div>
  );
} 