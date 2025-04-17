'use client';

import { SimulationData } from '@/lib/ai/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTime } from '@/lib/ai/utils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { SalesCallAnalysis } from '@/lib/ai/schemas';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

interface SimulationFeedbackProps {
  data: SimulationData | null;
}

const BooleanDisplay = ({ value }: { value: boolean | undefined }) => {
  if (value === true) {
    return <CheckCircle className="h-4 w-4 inline text-green-600" />;
  } else if (value === false) {
    return <XCircle className="h-4 w-4 inline text-red-600" />;
  }
  return <MinusCircle className="h-4 w-4 inline text-gray-400" />;
};

const ListDisplay = ({ items }: { items: string[] | undefined }) => {
  if (!items || items.length === 0) {
    return <p className="text-sm text-muted-foreground italic">N/A</p>;
  }
  return (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, index) => <li key={index} className="text-sm">{item}</li>)}
    </ul>
  );
};

export function SimulationFeedback({ data }: SimulationFeedbackProps) {
  if (!data) {
    return <p>Loading feedback data...</p>;
  }

  const {
    duration = 0,
    transcript = [],
    personaDetails,
    user,
    createdAt,
    feedback
  } = data;

  let analysis: SalesCallAnalysis | null = null;
  if (feedback && typeof feedback === 'object') {
      analysis = feedback as SalesCallAnalysis; 
  }

  const formattedTranscript = transcript
    .filter(item => item && item.type === 'transcript' && item.role && item.transcript)
    .map((item, index) => {
      const isUser = item.role === 'user';
      const speaker = isUser ? (user?.name || 'You') : (personaDetails?.prospectName || 'Prospect');
      return (
        <div key={index} className={cn("mb-2 p-2 rounded-md", isUser ? "bg-blue-50 text-blue-900" : "bg-gray-50 text-gray-900")}>
          <strong className={cn(isUser ? "text-blue-700" : "text-gray-700")}>{speaker}:</strong>
          <p className="ml-1 inline">{item.transcript}</p>
        </div>
      );
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Call Summary</CardTitle>
          <CardDescription>
            Overview of your simulation with {personaDetails?.prospectName || 'the prospect'}
            {createdAt ? ` on ${new Date(createdAt).toLocaleDateString()}` : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Status:</strong> <span className="capitalize">{data.callStatus?.toLowerCase() ?? 'Unknown'}</span></p>
          <p><strong>Duration:</strong> {formatTime(duration)}</p>
          {analysis?.leadStatus && (
             <div><strong>Lead Status:</strong> <Badge variant="outline" className="capitalize">{analysis.leadStatus}</Badge></div>
           )}
           {analysis?.nextStepSecured !== undefined && (
             <div><strong>Next Step Secured:</strong> <BooleanDisplay value={analysis.nextStepSecured} /></div>
           )}
        </CardContent>
      </Card>

      {analysis ? (
           <> 
            <Card>
                 <CardHeader>
                    <CardTitle>AI Feedback Summary</CardTitle>
                    <CardDescription>Overall assessment by the AI sales coach.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                     <p className="text-sm">{analysis.feedbackSummary?.coachCommentary || "No commentary provided."}</p>
                     {analysis.feedbackSummary?.finalScore !== undefined && (
                         <div>
                             <p className="text-sm font-medium mb-1">Overall Score: {analysis.feedbackSummary.finalScore}/100</p>
                             <Progress value={analysis.feedbackSummary.finalScore} className="w-full h-2" />
                         </div>
                     )}
                     <div><h4 className="font-semibold text-sm mb-1">Strengths:</h4><ListDisplay items={analysis.feedbackSummary?.strengths} /></div>
                     <div><h4 className="font-semibold text-sm mb-1">Weaknesses:</h4><ListDisplay items={analysis.feedbackSummary?.weaknesses} /></div>
                     <div><h4 className="font-semibold text-sm mb-1">Improvement Suggestions:</h4><ListDisplay items={analysis.feedbackSummary?.improvementSuggestions} /></div>
                 </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Salesperson Performance</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p><strong>Clarity:</strong> <span className="capitalize">{analysis.salespersonPerformance?.clarity ?? 'N/A'}</span></p>
                    <p><strong>Speaking Pace:</strong> <span className="capitalize">{analysis.salespersonPerformance?.speakingPace ?? 'N/A'}</span></p>
                    <p><strong>Filler Words Usage:</strong> <span className="capitalize">{analysis.salespersonPerformance?.fillerWordsUsage ?? 'N/A'}</span></p>
                    <p><strong>Personalization:</strong> <span className="capitalize">{analysis.salespersonPerformance?.personalization ?? 'N/A'}</span></p>
                    <p><strong>Confidence Score:</strong> {analysis.salespersonPerformance?.confidenceScore ?? 'N/A'}/100</p>
                     <p><strong>Value Proposition Clarity:</strong> <span className="capitalize">{analysis.salespersonPerformance?.valuePropositionClarity ?? 'N/A'}</span></p>
                    <p><strong>Rapport Built:</strong> <BooleanDisplay value={analysis.salespersonPerformance?.rapportBuilt} /></p>
                    <p><strong>Follow-up Proposed:</strong> <BooleanDisplay value={analysis.salespersonPerformance?.followUpProposed} /></p>
                </CardContent>
            </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Objection Handling</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Objections Raised:</strong> {analysis.objectionHandling?.objectionCount ?? 'N/A'}</p>
                        <p><strong>Handled Successfully:</strong> {analysis.objectionHandling?.objectionsHandledSuccessfully ?? 'N/A'}</p>
                        <p><strong>Response Quality:</strong> <span className="capitalize">{analysis.objectionHandling?.responseQuality ?? 'N/A'}</span></p>
                        <div><h4 className="font-semibold text-sm mb-1">Types Encountered:</h4><ListDisplay items={analysis.objectionHandling?.objectionTypes} /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Engagement Metrics</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Prospect Engagement Score:</strong> {analysis.engagementMetrics?.prospectEngagementScore ?? 'N/A'}/100</p>
                        <p><strong>Sentiment Trend:</strong> <span className="capitalize">{analysis.engagementMetrics?.sentimentTrend ?? 'N/A'}</span></p>
                        <div><h4 className="font-semibold text-sm mb-1">Tension Moments:</h4><ListDisplay items={analysis.engagementMetrics?.tensionMoments} /></div>
                    </CardContent>
                </Card>
            </div>
            
             <Card>
                <CardHeader><CardTitle>Key Moments</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                     <div><h4 className="font-semibold text-sm mb-1">Best Line:</h4><p className="text-sm italic">{analysis.keyMoments?.bestLine || 'N/A'}</p></div>
                     <div><h4 className="font-semibold text-sm mb-1">Missed Opportunities:</h4><ListDisplay items={analysis.keyMoments?.missedOpportunities} /></div>
                    <div><h4 className="font-semibold text-sm mb-1">Turning Points:</h4><ListDisplay items={analysis.keyMoments?.turningPoints} /></div>
                </CardContent>
            </Card>

           </>
       ) : (
            <Card>
                <CardHeader><CardTitle>AI Feedback</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">AI feedback has not been generated for this simulation yet.</p>
                </CardContent>
            </Card>
       )} 

      <Card>
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
          <CardDescription>Full conversation log.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border p-4 bg-muted/30">
            {formattedTranscript.length > 0 ? (
              <div className="space-y-3">
                {formattedTranscript}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No transcript available for this simulation.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

    </div>
  );
} 