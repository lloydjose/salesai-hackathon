"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { Phone, PhoneOff, Loader2, BarChartHorizontalBig } from "lucide-react";
import { formatTime } from "@/lib/call-simulator/utils";
import { cn } from "@/lib/utils";

interface SimulationControlsProps {
  isCallActive: boolean;
  displayElapsedTime: number;
  handleToggleCall: () => void;
  isLoading: boolean;
  callStatusMessage: string;
  callStatus?: string | null;
}

export const SimulationControls = ({
  isCallActive,
  displayElapsedTime,
  handleToggleCall,
  isLoading,
  callStatusMessage,
  callStatus
}: SimulationControlsProps) => {
  const router = useRouter();
  const params = useParams();
  const simulationId = params.id as string;

  const isCompleted = callStatus === 'COMPLETED';
  const showAnalyzeButton = isCompleted && !isCallActive;

  console.log("[SimControls] Render:", {
      isCallActive,
      callStatus,
      isCompleted,
      showAnalyzeButton,
      simulationId
  });

  const handleAnalyzeClick = () => {
    console.log("[SimControls] handleAnalyzeClick called. Navigating to:", `/dashboard/realtime-simulator/${simulationId}/feedback`);
    if (simulationId) {
        router.push(`/dashboard/realtime-simulator/${simulationId}/feedback`);
    } else {
        console.error("[SimControls] Cannot navigate, simulationId is missing.");
    }
  };

  let buttonLabel = "Start Call Session";
  let ButtonIcon = Phone;
  let buttonAction: (() => void) | undefined = handleToggleCall;
  let buttonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined = "default";
  let buttonColorClass = "bg-green-600 hover:bg-green-700";

  if (showAnalyzeButton) {
      buttonLabel = "Analyze How You Performed";
      ButtonIcon = BarChartHorizontalBig;
      buttonAction = handleAnalyzeClick;
      buttonColorClass = "bg-blue-600 hover:bg-blue-700";
      buttonVariant = "default";
  } else if (isCallActive) {
      buttonLabel = "End Call Session";
      ButtonIcon = PhoneOff;
      buttonAction = undefined;
      buttonColorClass = "bg-red-600 hover:bg-red-700";
      buttonVariant = "destructive";
  } else if (callStatusMessage === "Connecting call...") {
       ButtonIcon = Loader2;
       buttonAction = undefined;
  }

  const CallButton = (
        <Button
            size="lg"
            onClick={buttonAction}
            disabled={isLoading || callStatusMessage === "Connecting call..."}
            variant={buttonVariant}
            className={cn(
                "gap-2 px-5 sm:px-8 transition-colors h-10 sm:h-11", 
                buttonColorClass
            )}
            aria-live="polite"
        >
            <ButtonIcon className={cn("w-4 h-4 sm:w-5", callStatusMessage === "Connecting call..." && "animate-spin")} />
            <span>{buttonLabel}</span>
        </Button>
  );

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-8 p-3 md:p-4 bg-muted/60 border-t">
      
      {isCallActive ? (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                     <Button
                        size="lg"
                        disabled={isLoading}
                        variant={"destructive"}
                        className={cn(
                            "gap-2 px-5 sm:px-8 transition-colors h-10 sm:h-11", 
                            "bg-red-600 hover:bg-red-700"
                        )}
                        aria-live="polite"
                    >
                        <PhoneOff className="w-4 h-4 sm:w-5" />
                        <span>End Call Session</span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>End Call Session?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure? This will terminate the current call simulation.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleToggleCall} className="bg-red-600 hover:bg-red-700">
                        End Call Now
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
      ) : (
         CallButton
      )}
      
      <div className="text-sm sm:text-base font-mono bg-background text-foreground px-3 py-1.5 rounded border shadow-inner min-w-[5ch]">
          {formatTime(displayElapsedTime)}
      </div>
    </div>
  );
}; 