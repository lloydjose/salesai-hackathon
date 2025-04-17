'use client';

import { useState, useEffect } from 'react';
import { ProspectCard } from '@/components/prospects/prospect-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';

// Define type matching the API response (or import from shared location)
type ProspectListData = {
  id: string;
  name: string;
  linkedinProfileUrl?: string | null;
  linkedinData?: any | null;
  customData?: any | null;
  source?: string | null;
  createdAt?: Date | string;
};

export function ProspectList() {
  const [prospects, setProspects] = useState<ProspectListData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch('/api/prospects')
      .then(async (response) => {
        if (!isMounted) return;
        if (!response.ok) {
           let errorMessage = `Error: ${response.statusText}`;
           try { const errorBody = await response.json(); errorMessage = errorBody.message || errorMessage; } catch (e) { /* Ignore */ }
           throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data: ProspectListData[]) => {
        if (!isMounted) return;
        setProspects(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch prospects:", err);
        setError(err instanceof Error ? err.message : "Could not load prospects.");
      })
      .finally(() => {
         if (isMounted) setIsLoading(false);
      });

      return () => { isMounted = false; };
  }, []); // Empty dependency array to run once on mount

  // Render Logic moved from page.tsx
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Prospects</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (prospects.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-10">
        No prospects added yet. Click "Add New Prospect" to get started.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prospects.map((prospect) => (
        <ProspectCard key={prospect.id} prospect={prospect} />
      ))}
    </div>
  );
} 