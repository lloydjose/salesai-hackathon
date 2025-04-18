"use client";

import { Mic, Loader2, User, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Define the states for the demo animation
type DemoState =
  | "idle"
  | "prospect-talking"
  | "listening-prospect"
  | "user-talking"
  | "listening-user"
  | "analyzing";

interface AIVoiceInputProps {
  visualizerBars?: number;
  demoMode?: boolean;
  prospectTalkDuration?: number;
  listenProspectDuration?: number;
  userTalkDuration?: number;
  listenUserDuration?: number;
  analyzeDuration?: number;
  idleDuration?: number;
  className?: string;
}

// Colors inspired by trusted-section stats cards
const prospectColor = "hsl(25 60% 33%)"; // ~ #874621
const userColor = "hsl(315 55% 29%)"; // ~ #732065
const analyzeColor = "hsl(348 50% 39%)"; // ~ #933349
const listeningColor = "hsl(var(--muted-foreground))";

export function AIVoiceInput({
  visualizerBars = 48,
  demoMode = false,
  prospectTalkDuration = 4000,
  listenProspectDuration = 1500,
  userTalkDuration = 5000,
  listenUserDuration = 1500,
  analyzeDuration = 3000,
  idleDuration = 1000,
  className,
}: AIVoiceInputProps) {
  const [currentState, setCurrentState] = useState<DemoState>("idle");
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

    const sequence: { state: DemoState; duration: number }[] = [
      { state: "idle", duration: idleDuration },
      { state: "prospect-talking", duration: prospectTalkDuration },
      { state: "listening-prospect", duration: listenProspectDuration },
      { state: "user-talking", duration: userTalkDuration },
      { state: "listening-user", duration: listenUserDuration },
      { state: "analyzing", duration: analyzeDuration },
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
    prospectTalkDuration,
    listenProspectDuration,
    userTalkDuration,
    listenUserDuration,
    analyzeDuration,
    idleDuration
  ]);

  const getCurrentColor = () => {
    switch (currentState) {
      case "prospect-talking": return prospectColor;
      case "user-talking": return userColor;
      case "listening-prospect":
      case "listening-user": return listeningColor;
      case "analyzing": return analyzeColor;
      case "idle":
      default: return "hsl(var(--muted-foreground) / 0.3)";
    }
  };

  const currentBgColor = getCurrentColor();

  const getStatusContent = (): { icon: React.ReactNode, text: string } => {
     switch (currentState) {
      case "prospect-talking": return { icon: <Bot size={18} style={{color: prospectColor}} />, text: "Prospect Speaking"};
      case "listening-prospect": return { icon: <Mic size={18} style={{color: listeningColor}} />, text: "Listening..."};
      case "user-talking": return { icon: <User size={18} style={{color: userColor}} />, text: "Your Turn"};
      case "listening-user": return { icon: <Mic size={18} style={{color: listeningColor}} />, text: "Listening..."};
      case "analyzing": return { icon: <Loader2 size={18} style={{color: analyzeColor}} className="animate-spin" />, text: "Analyzing Call..."};
      case "idle":
      default: return { icon: <Mic size={18} className="text-muted-foreground/50" />, text: "Ready for Simulation"};
    }
  }
  const { icon: statusIcon, text: statusText } = getStatusContent();

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center", className)}>
        <div className="flex items-center gap-2 mb-4 h-6">
            {statusIcon}
            <p className="text-sm font-medium text-muted-foreground">{statusText}</p>
        </div>

        <div className="h-16 w-full flex items-center justify-center gap-1">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-150",
                (currentState === "prospect-talking" || currentState === 'user-talking') && 'animate-pulse-fast'
              )}
              style={{
                  backgroundColor: currentBgColor,
                  height: isClient ? `${
                      currentState === 'idle' ? 5 :
                      currentState === 'listening-prospect' || currentState === 'listening-user' ? 10 + Math.random() * 15 :
                      currentState === 'analyzing' ? 15 + Math.random() * 5 :
                      currentState === 'prospect-talking' ? 20 + Math.random() * 60 :
                      currentState === 'user-talking' ? 25 + Math.random() * 75 :
                      5
                  }%` : '5%',
                  animationDelay: `${i * 0.02}s`,
                  animationPlayState: (currentState === 'idle' || currentState === 'analyzing' || currentState === 'listening-prospect' || currentState === 'listening-user') ? 'paused' : 'running'
              }}
            />
          ))}
        </div>
         <style jsx>{`
            @keyframes pulse-fast {
                50% { opacity: .6; }
            }
            .animate-pulse-fast {
                animation: pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
         `}</style>
    </div>
  );
}