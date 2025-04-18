'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // For displaying relative time

// Type matching the GET /api/pre-call-planner response
type BriefListItem = {
  id: string;
  createdAt: string; // Date comes as string from JSON
  callType: string;
  prospect: {
    id: string;
    name: string;
  };
};

// Simple card to display a brief in the list
function BriefCard({ brief }: { brief: BriefListItem }) {
  return (
    <Link 
      href={`/dashboard/pre-call-planner/${brief.id}`} 
      className="block transition-transform hover:scale-[1.02]"
    >
      <Card className="hover:shadow-md h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span>{brief.prospect.name}</span>
          </CardTitle>
          <CardDescription>
            {brief.callType} - Created {formatDistanceToNow(new Date(brief.createdAt), { addSuffix: true })}
          </CardDescription>
        </CardHeader>
        {/* Optional: Add CardContent for more details if needed */}
      </Card>
    </Link>
  );
}

export function BriefList() {
  const [briefs, setBriefs] = useState<BriefListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch('/api/pre-call-planner') // Fetch from the GET endpoint
      .then(async (response) => {
        if (!isMounted) return;
        if (!response.ok) {
           let errorMessage = `Error: ${response.statusText}`;
           try { const errorBody = await response.json(); errorMessage = errorBody.message || errorMessage; } catch (e) { 
            console.error("[BriefList] Error fetching data:", e);
           }
           throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data: BriefListItem[]) => {
        if (!isMounted) return;
        setBriefs(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch briefs:", err);
        setError(err instanceof Error ? err.message : "Could not load pre-call plans.");
      })
      .finally(() => {
         if (isMounted) setIsLoading(false);
      });

      return () => { isMounted = false; };
  }, []);

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
        <AlertTitle>Error Loading Plans</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (briefs.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-10">
        No pre-call plans created yet. Click &ldquo;Create New Plan&ldquo; to get started.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {briefs.map((brief) => (
        <BriefCard key={brief.id} brief={brief} />
      ))}
    </div>
  );
} 