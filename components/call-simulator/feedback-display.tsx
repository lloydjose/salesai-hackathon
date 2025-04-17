'use client';

import { useEffect, useState } from 'react';
import { SimulationFeedback } from '@/components/call-simulator/simulation-feedback';
import { SimulationData } from '@/lib/ai/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface FeedbackDisplayProps {
  simulationId: string;
}

export function FeedbackDisplay({ simulationId }: FeedbackDisplayProps) {
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    // Add check if simulationId is actually passed
    if (!simulationId) {
      setError("Simulation ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedbackError(null);
    console.log(`[FeedbackDisplay] Fetching initial data for simulation ID: ${simulationId}`);

    fetch(`/api/simulations/${simulationId}`) 
      .then(async (response) => {
        if (!isMounted) return;
        if (!response.ok) {
          let errorMessage = `Error fetching data: ${response.statusText}`;
          try { const errorBody = await response.json(); errorMessage = errorBody.message || errorMessage; } catch (e) { /* Ignore */ }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data: SimulationData) => {
        if (!isMounted) return;
        console.log("[FeedbackDisplay] Initial Fetched Data:", data);
        setSimulationData(data);
        // Check if feedback needs generation AFTER initial data is loaded
        if (data && (!data.feedback || (typeof data.feedback === 'object' && Object.keys(data.feedback).length === 0))) {
          console.log("[FeedbackDisplay] Feedback missing or empty, triggering generation...");
          triggerFeedbackGeneration(simulationId); // Call the generation function
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("[FeedbackDisplay] Failed to fetch initial simulation data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred fetching data");
      })
      .finally(() => {
         if (isMounted) setIsLoading(false);
      });
     return () => { isMounted = false; };
  }, [simulationId]);

  // Function to call the feedback generation API
  const triggerFeedbackGeneration = async (id: string) => {
    setIsGeneratingFeedback(true);
    setFeedbackError(null);
    try {
      console.log(`[FeedbackDisplay] Posting to generate feedback for ID: ${id}`);
      const response = await fetch(`/api/simulations/${id}/generate-feedback`, {
        method: 'POST',
      });
      
      const result = await response.json();

      if (!response.ok) {
        console.error("[FeedbackDisplay] Feedback generation failed:", result);
        throw new Error(result.message || `Feedback generation failed (${response.status})`);
      }

      console.log("[FeedbackDisplay] Feedback generated successfully:", result);
      // Update the simulation data state with the new feedback
      setSimulationData(prevData => prevData ? { ...prevData, feedback: result.feedback } : null);

    } catch (err) {
        console.error("[FeedbackDisplay] Error triggering feedback generation:", err);
       setFeedbackError(err instanceof Error ? err.message : "Could not generate feedback.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    // Skeleton for the feedback content area (header is handled by page)
    return <Skeleton className="h-64 w-full animate-pulse" />;
  }

  // Display general fetch error first
  if (error) {
    return (
      <Alert variant="destructive" className="w-full">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Simulation Data</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  // Then display feedback generation error if it occurred
  if (feedbackError) {
       return (
      <Alert variant="destructive" className="w-full">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Feedback Generation Error</AlertTitle>
        <AlertDescription>{feedbackError}</AlertDescription>
      </Alert>
    );
  }

  // If still generating feedback after initial load
  if (isGeneratingFeedback) {
       return (
          <div className="flex flex-col items-center justify-center text-center p-10 border rounded-lg bg-muted/50">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-lg font-semibold text-muted-foreground">Generating Feedback...</p>
              <p className="text-sm text-muted-foreground">Please wait while the AI analyzes your call.</p>
          </div>
      );
  }

  // Data loaded, feedback generated (or was already present), no errors
  if (!simulationData) {
    // This case should ideally not be reached if isLoading/error handle things
    return (
      <p className="text-center text-muted-foreground">Simulation data could not be loaded.</p>
    );
  }

  // Render the actual feedback component with fetched data (which now includes feedback)
  return <SimulationFeedback data={simulationData} />;
} 