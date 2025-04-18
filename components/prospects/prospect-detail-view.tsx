'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/shared/page-header";
import { ProspectDetail } from '@/components/prospects/prospect-detail';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import { AdvancedProspectMessaging } from '@/lib/ai/schemas'; // Import specific type

// Define type matching the API response
type ProspectDetailData = {
  id: string;
  name: string;
  linkedinProfileUrl?: string | null;
  linkedinData?: any | null;
  customData?: any | null;
  source?: string | null;
  createdAt?: Date | string;
  aiAnalysis?: AdvancedProspectMessaging | null;
};

interface ProspectDetailViewProps {
  prospectId: string;
}

export function ProspectDetailView({ prospectId }: ProspectDetailViewProps) {
  const [prospectData, setProspectData] = useState<ProspectDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch initial prospect data
  useEffect(() => {
    if (!prospectId) {
      setError("Prospect ID not provided.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setProspectData(null); // Reset data on ID change
    setIsAnalyzing(false); // Reset analysis state

    fetch(`/api/prospects/${prospectId}`)
      .then(async (response) => {
        if (!isMounted) return;
        if (!response.ok) {
          let errorMessage = `Error fetching prospect: ${response.statusText}`;
          try { const errorBody = await response.json(); errorMessage = errorBody.message || errorMessage; } catch (e) { 
            console.error("[ProspectDetailView] Error fetching data:", e);
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data: ProspectDetailData) => {
        if (!isMounted) return;
        setProspectData(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("[ProspectDetailView] Failed to fetch prospect data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      })
      .finally(() => {
         if (isMounted) setIsLoading(false);
      });

      return () => { isMounted = false; };

  }, [prospectId]);

  // Function to handle AI analysis request
  const handleAnalyzeProspect = async () => {
    if (!prospectId || isAnalyzing) return;

    if (prospectData?.aiAnalysis) {
      toast.success('Analysis already available.');
      return;
    }

    setIsAnalyzing(true);
    toast.loading('Generating AI analysis... This may take a moment.', { id: 'analyze-toast' });

    try {
      const response = await fetch(`/api/prospects/${prospectId}/analyze`, {
        method: 'POST',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate analysis');
      }

      setProspectData(prevData => prevData ? { ...prevData, aiAnalysis: result.analysis } : null);
      toast.success('AI analysis generated successfully!', { id: 'analyze-toast' });

    } catch (err) {
      console.error("[ProspectDetailView] Failed to analyze prospect:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
      toast.error(`Analysis failed: ${errorMessage}`, { id: 'analyze-toast' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Determine Page Title Dynamically
  const pageTitle = isLoading ? "Loading Prospect..." : (prospectData?.name || "Prospect Details");

  // Conditionally render the analyze button
  const showAnalyzeButton = !isLoading && prospectData?.source === 'LINKEDIN';

  return (
    <>
      <Toaster position="bottom-right" />
      {/* PageHeader is now part of this component */}
      <PageHeader title={pageTitle}>
        {showAnalyzeButton && (
          <Button onClick={handleAnalyzeProspect} disabled={isAnalyzing || !!prospectData?.aiAnalysis}>
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {prospectData?.aiAnalysis ? 'Analysis Complete' : 'Analyze Prospect with AI'}
          </Button>
        )}
      </PageHeader>

      {/* Main content area */}
      <div className="p-4 md:p-6">
          {isLoading && (
             <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="flex items-center gap-4">
                   <Skeleton className="h-20 w-20 rounded-full" />
                   <div className="space-y-2 flex-1">
                      <Skeleton className="h-7 w-1/3" />
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-5 w-1/4" />
                   </div>
                </div>
                {/* Content Skeleton */}
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-60 w-full" />
             </div>
          )}
          {error && (
             <Alert variant="destructive">
               <Terminal className="h-4 w-4" />
               <AlertTitle>Error Loading Prospect</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}
          {!isLoading && !error && prospectData && (
             <ProspectDetail
                prospect={prospectData}
                isAnalyzing={isAnalyzing}
                aiAnalysis={prospectData.aiAnalysis}
             />
          )}
          {!isLoading && !error && !prospectData && (
             <p className="text-center text-muted-foreground py-10">Prospect not found or you do not have access.</p>
          )}
      </div>
    </>
  );
} 