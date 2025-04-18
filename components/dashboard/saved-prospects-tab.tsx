"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";

// Re-use or import ProspectListData type
type ProspectListData = {
  id: string;
  name: string;
  linkedinProfileUrl?: string | null;
  linkedinData?: any | null; // Using any for simplicity, refine if possible
  customData?: any | null;
  source?: string | null;
  createdAt?: Date | string;
};

const MAX_PROSPECTS_TO_SHOW = 4; // Limit the number shown on dashboard

export function SavedProspectsTab() {
  const [prospects, setProspects] = useState<ProspectListData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // Fetch prospects, potentially add query params later for sorting/limiting
    // Note: Assuming the API endpoint exists and returns data in the expected format.
    // The '?limit=X' is hypothetical; adjust based on your actual API capabilities.
    fetch(`/api/prospects?limit=${MAX_PROSPECTS_TO_SHOW}`) 
      .then(async (response) => {
        if (!isMounted) return;
        if (!response.ok) {
           let errorMessage = `Error: ${response.statusText}`;
           try { const errorBody = await response.json(); errorMessage = errorBody.message || errorMessage; } catch (e) { 
            console.error("[SavedProspectsTab] Error fetching data:", e);
           }
           throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data: ProspectListData[]) => {
        if (!isMounted) return;
        // Ensure we only take the desired number, even if API doesn't limit
        setProspects(data.slice(0, MAX_PROSPECTS_TO_SHOW));
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch prospects for tab:", err);
        setError(err instanceof Error ? err.message : "Could not load prospects.");
      })
      .finally(() => {
         if (isMounted) setIsLoading(false);
      });

      return () => { isMounted = false; };
  }, []);

  const getInitials = (name: string) => {
    return name?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase() || '?';
  }

  const getAvatarImage = (prospect: ProspectListData): string | undefined => {
     // Example: Prioritize LinkedIn profile picture if available in linkedinData
     // Adjust the path based on your actual data structure
     if (prospect.linkedinData?.profile_pic_url) {
        return prospect.linkedinData.profile_pic_url;
     }
     return undefined; // Default if no image found
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="space-y-1">
          {[...Array(MAX_PROSPECTS_TO_SHOW)].map((_, index) => (
             <div key={index} className="flex items-center justify-between gap-3 p-2 pr-1">
               <div className="flex items-center gap-3 flex-grow overflow-hidden">
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <div className="space-y-1 flex-grow overflow-hidden">
                     <Skeleton className="h-4 w-3/4" />
                     <Skeleton className="h-3 w-1/2" />
                  </div>
               </div>
               <Skeleton className="h-7 w-[60px] flex-shrink-0" />
             </div>
          ))}
           <Skeleton className="h-9 w-full mt-2" />
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive p-4 bg-destructive/10 rounded-md border border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      {!isLoading && !error && prospects.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-6">
          No saved prospects yet.
        </p>
      )}
      {!isLoading && !error && prospects.length > 0 && (
        <div className="space-y-1">
          {prospects.map((prospect) => (
            <div key={prospect.id} className="flex items-center justify-between gap-3 p-2 pr-1 hover:bg-muted/50 rounded-md">
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-8 w-8 border flex-shrink-0">
                   <AvatarImage src={getAvatarImage(prospect)} alt={prospect.name} />
                   <AvatarFallback>{getInitials(prospect.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow overflow-hidden">
                   <p className="text-sm font-medium truncate">{prospect.name}</p>
                   {prospect.linkedinData?.headline && (
                       <p className="text-xs text-muted-foreground truncate">{prospect.linkedinData.headline}</p>
                   )}
                </div>
              </div>
              <Link 
                href={`/dashboard/prospect-research/${prospect.id}`} 
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs h-7 px-2 flex-shrink-0")}
              >
                Details <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      )}
      {!isLoading && !error && (
         <Link href="/dashboard/prospect-research" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full">
               View All Prospects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
         </Link>
      )}
    </div>
  );
} 