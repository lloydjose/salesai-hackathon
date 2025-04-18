import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Mic, 
  Clock, 
  Target, 
  MessageSquareQuote,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ListChecks,
  Lightbulb,
  AlertCircle,
  Tags as TagsIcon
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend, ReferenceLine } from 'recharts';
import { salesCallConversationInsightsSchema, type SalesCallConversationInsights } from '@/lib/ai/schemas';
import { z } from 'zod';

export const AnalysisDataSchema = z.object({
    id: z.string(),
    userId: z.string(),
    originalFilename: z.string(),
    storagePath: z.string(),
    description: z.string().nullable(),
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETE', 'FAILED']),
    transcript: z.any().nullable(),
    aiAnalysis: z.any().nullable(),
    errorMessage: z.string().nullable(),
    assemblyAiTranscriptId: z.string().nullable(),
    createdAt: z.union([z.date(), z.string()]),
    updatedAt: z.union([z.date(), z.string()]),
});

export type AnalysisData = z.infer<typeof AnalysisDataSchema>;

interface AnalysisDetailViewProps {
    data: AnalysisData;
}

const formatScoreName = (name: string): string => {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
};

const getStatusColor = (status: AnalysisData['status']) => {
    switch (status) {
        case 'COMPLETE': return 'text-green-600 bg-green-100 border-green-200';
        case 'PROCESSING': return 'text-blue-600 bg-blue-100 border-blue-200';
        case 'PENDING': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
        case 'FAILED': return 'text-red-600 bg-red-100 border-red-200';
        default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
};

const StatusBadge: React.FC<{ status: AnalysisData['status'] }> = ({ status }) => {
    const colorClasses = getStatusColor(status);
    let Icon = Loader2;
    // eslint-disable-next-line
    let text = status;
    let spin = false;

    switch (status) {
        case 'COMPLETE': Icon = CheckCircle; break;
        case 'PROCESSING': Icon = Loader2; spin = true; break;
        case 'PENDING': Icon = Clock; break;
        case 'FAILED': Icon = XCircle; break;
    }

    const displayText = typeof text === 'string' ? text : 'UNKNOWN';

    return (
        <Badge variant="outline" className={`text-sm font-medium ${colorClasses}`}>
            <Icon className={`mr-2 h-4 w-4 ${spin ? 'animate-spin' : ''}`} />
            {displayText}
        </Badge>
    );
};

// Helper function to convert MM:SS to seconds
const timeToSeconds = (time: string): number => {
    if (!time || typeof time !== 'string') return 0;
    const parts = time.split(':');
    if (parts.length !== 2) return 0;
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds)) return 0;
    return minutes * 60 + seconds;
};

// Helper function to convert seconds back to MM:SS
const secondsToTime = (totalSeconds: number): string => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const AnalysisDetailView: React.FC<AnalysisDetailViewProps> = ({ data }) => {
    let parsedAnalysis: SalesCallConversationInsights | null = null;
    let parseError: string | null = null;
    if (data.status === 'COMPLETE' && data.aiAnalysis) {
        try {
            parsedAnalysis = salesCallConversationInsightsSchema.parse(data.aiAnalysis);
        } catch (error) {
            console.error("Failed to parse AI analysis data:", error);
            parseError = "Failed to parse AI analysis data. Structure might be invalid.";
            data = { ...data, status: 'FAILED', errorMessage: parseError };
        }
    }
    const analysis = parsedAnalysis;

    const talkRatioData = analysis?.talkRatio
        ? [
              { name: 'Salesperson', value: analysis.talkRatio.salespersonTalkTime ?? 0 },
              { name: 'Prospect', value: analysis.talkRatio.prospectTalkTime ?? 0 },
          ]
        : [];
    const TALK_COLORS = ['#0ea5e9', '#14b8a6'];

    const scoreBreakdownData = analysis?.scoreBreakdown
        ? Object.entries(analysis.scoreBreakdown).map(([key, value]) => ({
              name: formatScoreName(key),
              score: value ?? 0,
          }))
        : [];

    // Ensure elements in sentimentTimeline are correctly typed before accessing properties
    // Convert timestamp to numerical seconds for plotting
    const sentimentTimelineData = analysis?.sentimentTimeline
        ?.filter(point => point && typeof point === 'object' && typeof point.timestamp === 'string') // Check timestamp is string
        .map((point: NonNullable<typeof analysis.sentimentTimeline>[number]) => ({ 
            timestampLabel: point.timestamp, // Keep original label for tooltip
            timeSeconds: timeToSeconds(point.timestamp), // Convert to seconds for X-axis
            sentimentValue: point.sentiment === 'positive' ? 1 : point.sentiment === 'negative' ? -1 : 0,
            speaker: point.speaker,
            sentimentLabel: point.sentiment
        }))
        .sort((a, b) => a.timeSeconds - b.timeSeconds) // Sort by seconds
        || [];

    const lastUpdatedDate = data.updatedAt ? new Date(data.updatedAt) : null;

    return (
        <div className="space-y-6">
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Analysis Status</CardTitle>
                    <StatusBadge status={data.status} />
                 </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground">
                        File: {data.originalFilename} 
                        {lastUpdatedDate && !isNaN(lastUpdatedDate.getTime()) 
                           ? ` | Last updated: ${lastUpdatedDate.toLocaleString()}`
                           : ''}
                    </p>
                     {data.status === 'PROCESSING' && (
                        <p className="mt-2 text-sm text-blue-600 flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Transcription and AI analysis in progress...</p>
                     )}
                     {data.status === 'PENDING' && (
                        <p className="mt-2 text-sm text-yellow-600 flex items-center"><Clock className="mr-2 h-4 w-4"/>Upload complete, waiting for processing to start.</p>
                     )}
                 </CardContent>
            </Card>

            {data.status === 'PROCESSING' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                           <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-500"/> Processing Audio...
                        </CardTitle>
                        <CardDescription>Transcribing audio and generating AI insights. This may take a few minutes depending on the audio length.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={undefined} className="animate-pulse" />
                    </CardContent>
                </Card>
            )}

            {data.status === 'COMPLETE' && analysis && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     <Card className="lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{analysis.totalScore ?? 'N/A'} / 100</div>
                            <Progress value={analysis.totalScore ?? 0} className="mt-2 h-2" />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Talk Ratio</CardTitle>
                             <Mic className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {talkRatioData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={150}>
                                    <PieChart>
                                        <Pie
                                            data={talkRatioData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={60}
                                            fill="#8884d8"
                                            dataKey="value"
                                            stroke="hsl(var(--card))"
                                            strokeWidth={2}
                                        >
                                            {talkRatioData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={TALK_COLORS[index % TALK_COLORS.length]} />
                                            ))}
                                        </Pie>
                                         <RechartsTooltip formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}/>
                                         <Legend iconSize={10} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <p className="text-sm text-muted-foreground">Talk ratio data not available.</p>}
                        </CardContent>
                    </Card>

                     <Card className="lg:col-span-1">
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Listening Ratio Score</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                            <div className="text-2xl font-bold">{analysis.scoreBreakdown?.listeningRatio ?? 'N/A'} / 10</div> 
                             <p className="text-xs text-muted-foreground">Score based on talk time balance.</p>
                         </CardContent>
                     </Card>

                    <Card className="md:col-span-2 lg:col-span-3">
                         <CardHeader>
                            <CardTitle>Call Summary</CardTitle>
                         </CardHeader>
                         <CardContent>
                            <p className="text-sm text-muted-foreground">{analysis.callSummary || "Summary not available."}</p>
                         </CardContent>
                    </Card>

                     <Card className="md:col-span-2 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Score Breakdown</CardTitle>
                            <CardDescription>Detailed scores across key sales competencies (out of 10).</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {scoreBreakdownData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={scoreBreakdownData} layout="vertical" margin={{ left: 10, right: 30 }}>
                                         <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                                         <XAxis type="number" domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                                         <YAxis dataKey="name" type="category" width={150} stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false}/>
                                         <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}/>
                                         <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                             ) : <p className="text-sm text-muted-foreground">Score breakdown data not available.</p>}
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 lg:col-span-3">
                        <CardHeader>
                             <CardTitle>Sentiment Timeline</CardTitle>
                             <CardDescription>Detected sentiment shifts during the call.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sentimentTimelineData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={sentimentTimelineData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                                        {/* Use timeSeconds for dataKey, format ticks back to MM:SS */}
                                        <XAxis 
                                            dataKey="timeSeconds" 
                                            type="number" 
                                            domain={['dataMin', 'dataMax']} // Ensure domain covers data range
                                            tickFormatter={secondsToTime} 
                                            stroke="hsl(var(--muted-foreground))" 
                                            fontSize={12} 
                                        />
                                        <YAxis 
                                            domain={[-1.2, 1.2]} 
                                            ticks={[-1, 0, 1]} 
                                            tickFormatter={(value) => { 
                                                if (value === 1) return 'Positive';
                                                if (value === 0) return 'Neutral';
                                                if (value === -1) return 'Negative';
                                                return '';
                                            }} 
                                            stroke="hsl(var(--muted-foreground))" 
                                            fontSize={12}
                                            width={70}
                                        />
                                        <RechartsTooltip 
                                            // Format tooltip label (X value) back to MM:SS
                                            labelFormatter={(label) => `Time: ${secondsToTime(label as number)}`} 
                                            // Format tooltip content (Y value)
                                            formatter={(value, name, props) => [
                                                `${props.payload.sentimentLabel} (${props.payload.speaker})`,
                                                `Sentiment` // Simpler name for Y value
                                            ]} 
                                            contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
                                        />
                                        <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                                        {/* Use type="linear" */}
                                        <Line 
                                            type="linear" 
                                            dataKey="sentimentValue" 
                                            name="Sentiment" 
                                            stroke="#0ea5e9" // Use a direct hex color instead of CSS variable
                                            dot={true} // Show dots for clarity with fewer points
                                            strokeWidth={2}
                                            connectNulls // Connect line even if data points are missing
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : <p className="text-sm text-muted-foreground">Sentiment timeline data not available.</p>}
                        </CardContent>
                    </Card>

                     <Card className="md:col-span-2 lg:col-span-3">
                         <CardHeader>
                            <CardTitle>Objection Handling</CardTitle>
                         </CardHeader>
                         <CardContent>
                             {analysis.objections && analysis.objections.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Time</TableHead>
                                            <TableHead className="w-[150px]">Type</TableHead>
                                            <TableHead className="w-[100px]">Handled</TableHead>
                                            <TableHead>Rep Response Snippet</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analysis.objections
                                            .filter(obj => obj && typeof obj === 'object')
                                            .map((obj: NonNullable<typeof analysis.objections>[number], index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-mono text-xs">{obj.timestamp}</TableCell>
                                                    <TableCell><Badge variant="secondary">{obj.type}</Badge></TableCell>
                                                    <TableCell className="text-center">
                                                        {obj.handledEffectively ?
                                                            <CheckCircle className="h-5 w-5 text-green-500 inline-block" /> :
                                                            <XCircle className="h-5 w-5 text-red-500 inline-block" />
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground italic">&ldquo;{obj.repResponseSnippet}&ldquo;</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                             ) : <p className="text-sm text-muted-foreground">No objections detected.</p>}
                         </CardContent>
                     </Card>

                     <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Best Line</CardTitle>
                                <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
                             </CardHeader>
                             <CardContent>
                                <p className="text-sm italic">&ldquo;{analysis.bestLine || 'N/A'}&ldquo;</p>
                             </CardContent>
                         </Card>
                         <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Closing / Next Steps</CardTitle>
                                <ListChecks className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent className="flex flex-col space-y-2">
                                 <div className="flex items-center justify-between">
                                     <span className="text-sm">Closing Attempted:</span>
                                     <Badge variant={analysis.closingAttempted ? 'default' : 'outline'} className={analysis.closingAttempted ? 'border-green-300 bg-green-100 text-green-800' : ''}>
                                         <CheckCircle className="mr-1 h-3 w-3 text-green-600 ${!analysis.closingAttempted && 'hidden'}"/>
                                         <XCircle className="mr-1 h-3 w-3 text-red-600 ${analysis.closingAttempted && 'hidden'}"/>
                                         {analysis.closingAttempted ? 'Yes' : 'No'}
                                     </Badge>
                                 </div>
                                 <div className="flex items-center justify-between">
                                     <span className="text-sm">Next Step Confirmed:</span>
                                      <Badge variant={analysis.nextStepConfirmed ? 'default' : 'outline'} className={analysis.nextStepConfirmed ? 'border-green-300 bg-green-100 text-green-800' : ''}>
                                         <CheckCircle className="mr-1 h-3 w-3 text-green-600 ${!analysis.nextStepConfirmed && 'hidden'}"/>
                                         <XCircle className="mr-1 h-3 w-3 text-red-600 ${analysis.nextStepConfirmed && 'hidden'}"/>
                                         {analysis.nextStepConfirmed ? 'Yes' : 'No'}
                                     </Badge>
                                 </div>
                              </CardContent>
                         </Card>
                         <Card className="md:col-span-2">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Missed Opportunities</CardTitle>
                                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                {analysis.missedOpportunities && analysis.missedOpportunities.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        {analysis.missedOpportunities
                                            .filter(opp => typeof opp === 'string')
                                            .map((opp: string, i: number) => <li key={i}>{opp}</li>)}
                                    </ul>
                                ) : <p className="text-sm text-muted-foreground">None identified.</p>}
                             </CardContent>
                         </Card>
                     </div>

                     <Card className="md:col-span-2 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Coaching Feedback</CardTitle>
                            <CardDescription>Strengths, areas for improvement, and specific tips.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-500"/>Strengths</h4>
                                {analysis.strengths && analysis.strengths.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {analysis.strengths
                                            .filter(s => typeof s === 'string')
                                            .map((s: string, i: number) => <li key={i}>{s}</li>)}
                                    </ul>
                                ) : <p className="text-sm text-muted-foreground">None identified.</p>}
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2 flex items-center"><TrendingDown className="mr-2 h-5 w-5 text-red-500"/>Areas to Improve</h4>
                                {analysis.areasToImprove && analysis.areasToImprove.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {analysis.areasToImprove
                                            .filter(a => typeof a === 'string')
                                            .map((a: string, i: number) => <li key={i}>{a}</li>)}
                                    </ul>
                                ) : <p className="text-sm text-muted-foreground">None identified.</p>}
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2 flex items-center"><Sparkles className="mr-2 h-5 w-5 text-blue-500"/>Specific Coaching Tips</h4>
                                 {analysis.specificCoachingTips && analysis.specificCoachingTips.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {analysis.specificCoachingTips
                                            .filter(tip => typeof tip === 'string')
                                            .map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                                    </ul>
                                ) : <p className="text-sm text-muted-foreground">None provided.</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {analysis.tags && analysis.tags.length > 0 && (
                         <Card className="md:col-span-1 lg:col-span-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Call Tags</CardTitle>
                                <TagsIcon className="h-4 w-4 text-muted-foreground" />
                             </CardHeader>
                             <CardContent className="flex flex-wrap gap-2">
                                {analysis.tags
                                    .filter(tag => typeof tag === 'string')
                                    .map((tag: string, i: number) => <Badge key={i} variant="secondary">{tag}</Badge>)} 
                             </CardContent>
                         </Card>
                    )}

                    {/* Transcript Utterances Section */} 
                    <Card className="md:col-span-2 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Conversation Utterances</CardTitle>
                            <CardDescription>Speaker-separated transcription.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {typeof data.transcript === 'object' && data.transcript !== null && Array.isArray(data.transcript.utterances) && data.transcript.utterances.length > 0 ? (
                                <div className="text-sm space-y-2 max-h-96 overflow-y-auto p-1">
                                    {(data.transcript.utterances as Array<any>).map((utt, index) => (
                                        <div key={index} className="flex items-start gap-2"> 
                                            <Badge variant="secondary" className="w-16 justify-center flex-shrink-0 mt-0.5">Speaker {utt.speaker || 'N/A'}</Badge> 
                                            <span className="flex-1">{utt.text || ''}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Utterance data not available.</p>
                            )}
                        </CardContent>
                    </Card>

                </div>
            )}

             {data.status === 'FAILED' && ( 
                <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{String(data.errorMessage || 'An unknown error occurred during analysis or transcription.')}</AlertDescription>
                </Alert>
             )}

        </div>
    );
};

// Reminder: Ensure recharts is installed: npm install recharts 