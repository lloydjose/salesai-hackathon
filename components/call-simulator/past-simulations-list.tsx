'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, List } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Define the expected shape of simulation data from the API
type SimulationListItem = {
  id: string;
  createdAt: string; 
  callStatus?: string | null;
  duration?: number | null;
  personaDetails?: any | null; // Add personaDetails (using any for flexibility)
};

// Helper function to safely parse personaDetails and extract fields
const getPersonaInfo = (details: any): { title: string; description: string } => {
  let prospectName = 'Unknown Prospect';
  let jobTitle = 'Unknown Role';

  if (details && typeof details === 'object') {
    // Access fields directly if personaDetails is already an object
    prospectName = details.prospectName || prospectName;
    jobTitle = details.jobTitle || jobTitle;
    // Add industry or other fields if desired
  } else if (typeof details === 'string') {
    // Attempt to parse if it's a JSON string (add try-catch for safety)
    try {
      const parsed = JSON.parse(details);
      prospectName = parsed.prospectName || prospectName;
      jobTitle = parsed.jobTitle || jobTitle;
    } catch (e) {
      console.error("Failed to parse personaDetails string:", e);
    }
  }

  return {
    title: `Simulation: ${prospectName}`,
    description: jobTitle,
  };
};

export function PastSimulationsList() {
  const [simulations, setSimulations] = useState<SimulationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch('/api/simulations') // Fetch from the API route we created
      .then(async (response) => {
        if (!isMounted) return;
        if (!response.ok) {
          let errorMessage = `Error fetching simulations: ${response.statusText}`;
          try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || errorMessage;
          } catch (e) { 
            console.error("[PastSimulationsList] Error fetching simulations:", e);
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data: SimulationListItem[]) => {
        if (!isMounted) return;
        console.log("Fetched Past Simulations Data:", data); // Log fetched data
        setSimulations(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch past simulations:", err);
        setError(err instanceof Error ? err.message : "Could not load past simulations.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      });
    } catch (e) {
      console.error("[PastSimulationsList] Error formatting date:", e);
      return "Invalid Date";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 py-2">
        {[...Array(3)].map((_, index) => ( // Show 3 skeleton items
          <div key={index} className="flex items-center justify-between gap-3 p-2">
            <div className="space-y-1 flex-grow">
              <Skeleton className="h-4 w-3/5" /> {/* Adjust width for title */}
              <Skeleton className="h-3 w-2/5" /> {/* Adjust width for description */}
            </div>
            <Skeleton className="h-7 w-[110px]" /> {/* Adjust width for new button text */}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive p-4 bg-destructive/10 rounded-md border border-destructive/30">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span className="break-words">{error}</span> {/* Allow error text to wrap */}
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 px-4 min-h-[150px]">
        <List className="h-10 w-10 text-muted-foreground mb-3 stroke-1" />
        <p className="text-sm text-muted-foreground">
          No past simulations found.
        </p>
         <p className="text-xs text-muted-foreground/80 mt-1">
           Complete a simulation to see it listed here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 -mr-2">
      {simulations.map((sim) => {
        const { title, description } = getPersonaInfo(sim.personaDetails);
        const formattedDate = formatDate(sim.createdAt);

        return (
          <div key={sim.id} className="flex items-center justify-between gap-3 p-2 pr-1 hover:bg-muted/50 rounded-md">
            <div className="overflow-hidden flex-grow">
              <p className="text-sm font-medium truncate" title={title}>{title}</p> {/* Display dynamic title */}
              <p className="text-xs text-muted-foreground truncate" title={description}> 
                {description} {/* Display dynamic description */} 
                 <span className="mx-1">·</span> {/* Separator */} 
                 {formattedDate}
                {sim.duration !== null && sim.duration !== undefined && ` · ${Math.round(sim.duration / 60)} min`}
                {/* Optional: Add status back if needed: {sim.callStatus && ` (${sim.callStatus})`} */}
              </p>
            </div>
            <Link
              href={`/dashboard/realtime-simulator/${sim.id}/feedback`} // Updated link
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs h-7 px-2 flex-shrink-0 whitespace-nowrap")}
            >
              View Feedback <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        );
      })}
    </div>
  );
} 