"use client";

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

import { useVapiController } from "@/hooks/use-vapi-controller";
import { SimulationControls } from "./simulation-controls";
import { SimulationView } from "./simulation-view";
// eslint-disable-next-line
import { SimulationData, PersonaDetails } from "@/lib/ai/types";

interface SimulationCallUIProps {
  simulationId: string;
}

export function SimulationCallUI({ simulationId }: SimulationCallUIProps) {
  // Initial data fetching state
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // View state
  const [mainView, setMainView] = useState<"user" | "prospect">("prospect");

  // --- Custom Hooks ---
  const { 
    isCallActive,
    callStatusMessage,
    // eslint-disable-next-line
    transcript, 
    vapiError,
    isAssistantSpeaking,
    displayElapsedTime,
    handleToggleCall,
  } = useVapiController(
      simulationId, 
      simulationData?.personaDetails ?? null, 
  );

  // Fetch initial simulation data
  useEffect(() => {
    if (!simulationId) {
        setDataError("Simulation ID is missing.");
        setIsLoadingData(false);
        return;
    }
    
    let isMounted = true; // Prevent state updates on unmounted component
    console.log("[SimulationUI] Fetching initial data...");
    setIsLoadingData(true);
    setDataError(null);

    fetch(`/api/simulations/${simulationId}`)
      .then(async (response) => {
        if (!isMounted) return;
        if (!response.ok) {
          let errorMessage = `Error: ${response.statusText}`;
          try { const errorBody = await response.json(); errorMessage = errorBody.message || errorMessage; } catch (e) { 
            console.error("[SimulationUI] Error fetching data:", e);
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data: SimulationData) => {
        if (!isMounted) return;
        if (!data || !data.personaDetails || !data.personaDetails.prospectName) { 
            throw new Error("Persona details missing or incomplete in fetched data.");
        }
        console.log("[SimulationUI] Initial data received:", data);
        setSimulationData(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("[SimulationUI] Failed to fetch simulation data:", err);
        setDataError(err instanceof Error ? err.message : "An unknown error occurred");
      })
      .finally(() => {
         if (isMounted) setIsLoadingData(false);
      });

    return () => { isMounted = false; }; // Cleanup function
  }, [simulationId]);

  const handleSwitchView = useCallback(() => {
    setMainView((prev) => (prev === "user" ? "prospect" : "user"));
  }, []);

  // --- Render Logic ---

  if (isLoadingData) {
    return (
      <div className="flex flex-col h-full w-full space-y-4 animate-pulse">
        <div className="relative flex-grow bg-muted rounded-lg overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
          <div className="absolute bottom-4 right-4 z-10">
            <Skeleton className="w-32 h-20 sm:w-40 sm:h-24 rounded-lg" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 p-4 bg-background rounded-lg border shadow-sm">
          <Skeleton className="h-6 w-16 rounded" />
          <Skeleton className="h-10 w-44 rounded-md" />
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <Alert variant="destructive" className="w-full m-4">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Simulation Data</AlertTitle>
        <AlertDescription>{dataError}</AlertDescription>
      </Alert>
    );
  }

  if (!simulationData) {
    return <p className="text-center text-muted-foreground p-4">Simulation data unavailable.</p>;
  }

  // Prepare participant data for the view component
  const userParticipant = { name: simulationData.user?.name ?? null, image: simulationData.user?.image ?? null };
  const prospectParticipant = { name: simulationData.personaDetails?.prospectName ?? null }; 

  // Combine potential errors for display
  const currentError = dataError || vapiError;

  return (
    <div className="flex flex-col h-full w-full bg-background rounded-lg border shadow-sm overflow-hidden">
      <SimulationView 
        user={userParticipant}
        prospect={prospectParticipant}
        mainView={mainView}
        handleSwitchView={handleSwitchView}
        callStatusMessage={callStatusMessage}
        isAssistantSpeaking={isAssistantSpeaking}
      />
      <SimulationControls 
        isCallActive={isCallActive}
        displayElapsedTime={displayElapsedTime}
        handleToggleCall={handleToggleCall}
        isLoading={isLoadingData}
        callStatusMessage={callStatusMessage}
        callStatus={simulationData?.callStatus}
      />
      {currentError && (
            <Alert variant="destructive" className="m-2 border-t-0 rounded-t-none">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{currentError}</AlertDescription>
            </Alert>
      )}
    </div>
  );
} 