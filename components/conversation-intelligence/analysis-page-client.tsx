'use client';

import { useEffect, useState, useCallback } from 'react';
// Removed useParams as ID comes from props
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { AnalysisDetailView, AnalysisData } from '@/components/conversation-intelligence/analysis-detail-view';

// Define the expected structure of the data from the API
type ConversationAnalysisResponse = AnalysisData;

const POLLING_INTERVAL_MS = 5000; // Poll every 5 seconds

interface AnalysisPageClientProps {
    analysisId: string;
}

export function AnalysisPageClient({ analysisId }: AnalysisPageClientProps) {
    const id = analysisId; // Use ID from props

    const [analysisData, setAnalysisData] = useState<ConversationAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);

    const fetchData = useCallback(async (isInitialLoad = false) => {
        if (!id) return;
        if (isInitialLoad) {
            setIsLoading(true);
            setError(null);
        }

        try {
            // Use the id prop in the fetch URL
            const response = await fetch(`/api/conversation-intelligence/${id}/transcript`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch analysis data (status: ${response.status})`);
            }
            const data: ConversationAnalysisResponse = await response.json();
            setAnalysisData(data);

            const shouldPoll = data.status === 'PENDING' || data.status === 'PROCESSING';
            setIsPolling(shouldPoll);
            if (!shouldPoll) {
                 console.log(`[AnalysisPageClient] Polling stopped. Final status: ${data.status}`);
            }

            if (data.status === 'FAILED') {
                setError(data.errorMessage || 'Analysis failed.');
            }

        } catch (err) {
            console.error("Error fetching analysis data:", err);
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(message);
            setIsPolling(false);
        } finally {
            if (isInitialLoad) {
                setIsLoading(false);
            }
        }
    }, [id]);

    // Initial fetch
    useEffect(() => {
        fetchData(true);
    }, [fetchData]);

    // Polling logic
    useEffect(() => {
        if (!isPolling || !id) return;

        console.log(`[AnalysisPageClient] Starting polling interval for ${id}`);
        const intervalId = setInterval(() => {
            console.log(`[AnalysisPageClient] Polling...`);
            fetchData(false);
        }, POLLING_INTERVAL_MS);

        return () => {
            console.log(`[AnalysisPageClient] Clearing polling interval for ${id}`);
            clearInterval(intervalId);
        };
    }, [isPolling, id, fetchData]);

    // Render only the content part, without the PageHeader
    return (
        // Removed the outer container div, assuming page provides it
        <>
            {isLoading && (
                <div className="space-y-4 mt-6">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            )}

            {!isLoading && error && !analysisData && (
                <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Analysis</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {!isLoading && analysisData && (
                <div className="mt-6">
                    <AnalysisDetailView data={analysisData} />
                    {analysisData.status === 'FAILED' && analysisData.errorMessage && (
                        <Alert variant="destructive" className="mt-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Analysis Failed</AlertTitle>
                            <AlertDescription>{String(analysisData.errorMessage || 'An unknown error occurred during analysis or transcription.')}</AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
        </>
    );
} 