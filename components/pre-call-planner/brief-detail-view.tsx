'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, User, Building, Target, Mic, StickyNote, Tags, Flame, Sparkles, BrainCircuit, Lightbulb, MessageSquareQuote, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SalesCallPrepBrief } from '@/lib/ai/schemas'; // Import AI output type

// Type for the user input stored in formInput JSON
type FormInputData = {
  callType?: string;
  productPitchContext?: string | null;
  callObjective?: string;
  customNotes?: string | null;
  knownPainPoints?: string[] | null;
  competitorMentioned?: string[] | null;
  priorityLevel?: string | null;
};

// Type for the full brief data fetched from the API
type BriefDetailData = {
  id: string;
  createdAt: string;
  updatedAt: string;
  formInput: FormInputData | null;
  aiCallPrep: SalesCallPrepBrief | null;
  prospect: {
    id: string;
    name: string;
    linkedinProfileUrl?: string | null;
  };
};

interface BriefDetailViewProps {
  briefId: string;
}

// Helper to render list items or N/A
const renderList = (items: string[] | null | undefined, emptyText = "N/A") => {
  if (!items || items.length === 0) return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  return (
    <ul className="list-disc list-inside space-y-1 text-sm">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );
};

// Helper to display simple key-value pairs from formInput
const DetailItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
  value ? <div><strong className="font-medium">{label}:</strong> <span className="text-muted-foreground">{value}</span></div> : null
);

export function BriefDetailView({ briefId }: BriefDetailViewProps) {
  const [briefData, setBriefData] = useState<BriefDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!briefId) {
      setError("Brief ID not provided.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setBriefData(null);

    fetch(`/api/pre-call-planner/${briefId}`)
      .then(async (response) => {
        if (!isMounted) return;
        if (!response.ok) {
          let errorMessage = `Error fetching brief: ${response.statusText}`;
          try { const errorBody = await response.json(); errorMessage = errorBody.message || errorMessage; } catch (e) { /* Ignore */ }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data: BriefDetailData) => {
        if (!isMounted) return;
        // Basic validation/parsing of JSON fields
        setBriefData({
            ...data,
            formInput: typeof data.formInput === 'string' ? JSON.parse(data.formInput) : data.formInput,
            aiCallPrep: typeof data.aiCallPrep === 'string' ? JSON.parse(data.aiCallPrep) : data.aiCallPrep,
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("[BriefDetailView] Failed to fetch brief data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      })
      .finally(() => {
         if (isMounted) setIsLoading(false);
      });

      return () => { isMounted = false; };

  }, [briefId]);

  // --- Loading Skeleton --- (Similar to Prospect Detail)
  if (isLoading) {
    return (
      <>
        <PageHeader title="Loading Pre-Call Plan..."> <Skeleton className="h-9 w-32" /> </PageHeader>
        <div className="p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Skeleton for User Input Card */}
                 <Card>
                     <CardHeader><Skeleton className="h-6 w-3/5" /></CardHeader>
                     <CardContent className="space-y-3">
                         <Skeleton className="h-4 w-4/5" />
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-3/4" />
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-2/3" />
                     </CardContent>
                 </Card>
                 {/* Skeleton for AI Output Card */}
                 <Card>
                     <CardHeader><Skeleton className="h-6 w-3/5" /></CardHeader>
                     <CardContent className="space-y-4">
                         <Skeleton className="h-5 w-32" />
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-5/6" />
                         <Separator className="my-3"/>
                         <Skeleton className="h-5 w-36" />
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-4/6" />
                          <Separator className="my-3"/>
                         <Skeleton className="h-5 w-28" />
                         <Skeleton className="h-4 w-full" />
                     </CardContent>
                 </Card>
            </div>
        </div>
       </>
    );
  }

  // --- Error State --- 
  if (error) {
    return (
       <>
          <PageHeader title="Error" />
          <div className="p-4 md:p-6">
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Loading Pre-Call Plan</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          </div>
       </>
    );
  }

  // --- Data Loaded State --- 
  if (!briefData) {
     return (
        <>
          <PageHeader title="Not Found" />
            <div className="p-4 md:p-6 text-center text-muted-foreground">
                Pre-call plan not found.
            </div>
        </>
     );
  }

  const { prospect, formInput, aiCallPrep } = briefData;
  const pageTitle = `Plan: ${formInput?.callType || 'Call'} with ${prospect.name}`;

  return (
    <>
      <PageHeader title={pageTitle}>
         {/* Button to create another plan for the SAME prospect */}
         <Link href={`/dashboard/pre-call-planner/new?prospectId=${prospect.id}`}>
             <Button variant="outline">Create Another Plan for {prospect.name}</Button>
         </Link>
      </PageHeader>

      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card for User Input Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><StickyNote className="mr-2 h-5 w-5" /> Your Call Configuration</CardTitle>
            <CardDescription>The details you provided for this plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
             <DetailItem label="Prospect" value={prospect.name} />
             <DetailItem label="Call Type" value={formInput?.callType} />
             <DetailItem label="Objective" value={formInput?.callObjective} />
             <DetailItem label="Product Context" value={formInput?.productPitchContext} />
             <DetailItem label="Priority" value={formInput?.priorityLevel} />
             <div>
                 <strong className="font-medium block mb-1">Custom Notes:</strong>
                 {formInput?.customNotes ? <p className="text-muted-foreground whitespace-pre-wrap">{formInput.customNotes}</p> : <p className="text-muted-foreground italic">None provided</p>}
             </div>
             <div>
                 <strong className="font-medium block mb-1">Known Pain Points:</strong>
                 {renderList(formInput?.knownPainPoints, "None specified")}
             </div>
              <div>
                 <strong className="font-medium block mb-1">Competitors Mentioned:</strong>
                 {renderList(formInput?.competitorMentioned, "None specified")}
             </div>
          </CardContent>
        </Card>

        {/* Card for AI Generated Brief */}
        <Card className="border-blue-200 border-2 shadow-md bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-blue-700 dark:text-blue-400">
              <Sparkles className="mr-2 h-5 w-5"/> AI Pre-Call Brief
            </CardTitle>
            <CardDescription>Insights and recommendations based on prospect data and your input.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {!aiCallPrep ? (
                <p className="text-muted-foreground italic">AI analysis data is missing for this brief.</p>
            ) : (
                <>
                    {/* Prospect/Company Summary */}
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" /> Prospect Summary</h4>
                        <p className="text-sm text-muted-foreground">{aiCallPrep.prospectSummary}</p>
                         <h4 className="font-semibold flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground" /> Company Snapshot</h4>
                        <p className="text-sm text-muted-foreground">{aiCallPrep.companySnapshot}</p>
                        <h4 className="font-semibold flex items-center"><Target className="mr-2 h-4 w-4 text-muted-foreground" /> Decision Power</h4>
                        <div className="text-sm text-muted-foreground"><Badge variant="secondary">{aiCallPrep.decisionPower}</Badge></div>
                    </div>
                    <Separator />
                     {/* Focus & Pains */}
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center"><BrainCircuit className="mr-2 h-4 w-4 text-green-500" /> Likely Focus & Pain Points</h4>
                        <strong className="text-sm font-medium block">Current Focus:</strong>
                        {renderList(aiCallPrep.currentFocus)}
                         <strong className="text-sm font-medium block mt-2">Likely Pain Points:</strong>
                        {renderList(aiCallPrep.likelyPainPoints)}
                    </div>
                    <Separator />
                     {/* Communication */}
                     <div className="space-y-2">
                        <h4 className="font-semibold flex items-center"><MessageSquareQuote className="mr-2 h-4 w-4 text-orange-500" /> Communication</h4>
                        <p className="text-sm"><strong className="font-medium">Tone Preference:</strong> <span className="text-muted-foreground">{aiCallPrep.tonePreference}</span></p>
                         <strong className="text-sm font-medium block mt-2">Do NOT:</strong>
                        {renderList(aiCallPrep.communicationDoNotDos)}
                    </div>
                    <Separator />
                    {/* Strategy */}
                    <div className="space-y-2">
                         <h4 className="font-semibold flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-yellow-500" /> Strategy & Hooks</h4>
                         <strong className="text-sm font-medium block">Strategic Hooks:</strong>
                         {renderList(aiCallPrep.strategicHooks)}
                         <p className="text-sm pt-1"><strong className="font-medium">Opening Line Suggestion:</strong> <span className="text-muted-foreground italic">"{aiCallPrep.openingLineSuggestion}"</span></p>
                         <p className="text-sm"><strong className="font-medium">Product Angle:</strong> <span className="text-muted-foreground">{aiCallPrep.productAngle}</span></p>
                    </div>
                     <Separator />
                     {/* Objections & CTA */}
                     <div className="space-y-2">
                         <h4 className="font-semibold flex items-center"><Flame className="mr-2 h-4 w-4 text-red-500" /> Objection Forecast & CTA</h4>
                         <strong className="text-sm font-medium block">Potential Objections:</strong>
                         {renderList(aiCallPrep.objectionForecast)}
                         <p className="text-sm pt-1"><strong className="font-medium">Recommended CTA:</strong> <span className="text-muted-foreground">{aiCallPrep.CTARecommendation}</span></p>
                     </div>
                </>
            )}
          </CardContent>
        </Card>

      </div>
    </>
  );
} 