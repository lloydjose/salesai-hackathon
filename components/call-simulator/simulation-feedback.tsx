'use client';

import { SimulationData } from '@/lib/ai/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTime } from '@/lib/ai/utils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  Clock, 
  User2, 
  Phone, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  BarChart3,
  Target,
  AlertTriangle,
  Building2,
  Briefcase,
  Heart,
  Timer,
  MessageCircle,
  Scale,
  Lightbulb,
  Shield
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SimulationFeedbackProps {
  data: SimulationData | null;
}

interface PersonaDetails {
  industry: string;
  jobTitle: string;
  painPoints: string[];
  trustLevel: string;
  prospectName: string;
  urgencyLevel: string;
  emotionalTone: string;
  talkativeness: string;
  arroganceLevel: string;
  objectionLevel: string;
  confidenceLevel: string;
  currentSolution: string;
  problemAwareness: string;
  budgetConstraints: string;
  decisionMakingStyle: string;
}

interface SalespersonPerformance {
  clarity?: string;
  rapportBuilt?: boolean;
  speakingPace?: string;
  confidenceScore?: number;
  personalization?: string;
  fillerWordsUsage?: string;
  followUpProposed?: boolean;
  valuePropositionClarity?: string;
}

interface ObjectionHandling {
  objectionCount?: number;
  objectionTypes?: string[];
  responseQuality?: string;
  objectionsHandledSuccessfully?: number;
}

interface EngagementMetrics {
  sentimentTrend?: string;
  tensionMoments?: string[];
  prospectEngagementScore?: number;
}

interface KeyMoments {
  bestLine?: string;
  turningPoints?: string[];
  missedOpportunities?: string[];
}

interface FeedbackSummary {
  strengths?: string[];
  finalScore?: number;
  weaknesses?: string[];
  coachCommentary?: string;
  improvementSuggestions?: string[];
}

interface CallAnalysis {
  keyMoments?: KeyMoments;
  leadStatus?: string;
  callSummary?: string;
  feedbackSummary?: FeedbackSummary;
  nextStepSecured?: boolean;
  engagementMetrics?: EngagementMetrics;
  objectionHandling?: ObjectionHandling;
  callDurationMinutes?: number;
  conversionAttempted?: boolean;
  salespersonPerformance?: SalespersonPerformance;
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

// New components for better visualization
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  description?: string;
  trend?: { value: number; isPositive: boolean } 
}) => (
  <Card className="transition-all duration-200 hover:shadow-md">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          {trend && (
            <p className={cn("text-sm font-medium flex items-center gap-1",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </p>
          )}
        </div>
        <Icon className="h-8 w-8 text-muted-foreground/50" />
      </div>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <Skeleton className="h-8 w-[250px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  </div>
);

// New components for better visualization
const PersonaDetailCard = ({ 
  title, 
  value, 
  icon: Icon 
}: { 
  title: string; 
  value: string | number; 
  icon: any;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
    <Icon className="h-5 w-5 text-muted-foreground" />
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="font-medium capitalize">{String(value)}</p>
    </div>
  </div>
);

const MetricBadge = ({ 
  level, 
  type 
}: { 
  level: string; 
  type: 'positive' | 'negative' | 'neutral' | 'warning' 
}) => {
  const colors = {
    positive: "bg-green-50 text-green-700 border-green-200",
    negative: "bg-red-50 text-red-700 border-red-200",
    neutral: "bg-blue-50 text-blue-700 border-blue-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200"
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium border",
      colors[type]
    )}>
      {level}
    </span>
  );
};

const RadialProgress = ({ 
  value, 
  label,
  size = 120
}: { 
  value: number; 
  label: string;
  size?: number;
}) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-muted"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size/2}
          cy={size/2}
        />
        <circle
          className="text-primary"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size/2}
          cy={size/2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold">{value}%</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};

const PerformanceMetric = ({
  label,
  value,
  icon: Icon,
  type = "neutral"
}: {
  label: string;
  value: string;
  icon: any;
  type?: "positive" | "negative" | "neutral" | "warning";
}) => {
  const colors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-blue-600",
    warning: "text-yellow-600"
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <Icon className={cn("h-4 w-4", colors[type])} />
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium capitalize">{value}</p>
      </div>
    </div>
  );
};
// eslint-disable-next-line
const TimelineEvent = ({
  time,
  event,
  type = "neutral"
}: {
  time: string;
  event: string;
  type?: "positive" | "negative" | "neutral" | "warning";
}) => {
  const colors = {
    positive: "bg-green-50 border-green-200 text-green-700",
    negative: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    neutral: "bg-blue-50 border-blue-200 text-blue-700"
  };

  return (
    <div className="flex items-start gap-4">
      <div className="min-w-[60px] text-sm text-muted-foreground">{time}</div>
      <div className={cn(
        "flex-1 p-2 rounded-lg border text-sm",
        colors[type]
      )}>
        {event}
      </div>
    </div>
  );
};

export function SimulationFeedback({ data }: SimulationFeedbackProps) {
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(true);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showTimelineEvents, setShowTimelineEvents] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-lg font-medium">No feedback data available</p>
        </div>
      </div>
    );
  }

  const {
    duration = 0,
    transcript = [],
    personaDetails: rawPersonaDetails,
    user,
    createdAt,
    feedback: rawFeedback,
    callStatus
  } = data;

  let personaDetails: PersonaDetails | null = null;
  try {
    if (rawPersonaDetails && typeof rawPersonaDetails === 'string') {
      personaDetails = JSON.parse(rawPersonaDetails) as PersonaDetails;
    }
  } catch (error) {
    console.error('Error parsing persona details:', error);
  }

  const analysis = rawFeedback && typeof rawFeedback === 'object' ? rawFeedback as CallAnalysis : null;

  // Add performance metrics calculation
  const performanceMetrics = analysis?.salespersonPerformance || {};
  const confidenceScore = performanceMetrics.confidenceScore || 0;
  const objectionHandling = analysis?.objectionHandling || {};
  const objectionSuccess = objectionHandling.objectionsHandledSuccessfully && objectionHandling.objectionCount
    ? (objectionHandling.objectionsHandledSuccessfully / objectionHandling.objectionCount) * 100
    : 0;

  const formattedTranscript = (transcript || [])
    .filter((item): item is (typeof item & { type: string; role: string; transcript: string }) => 
      Boolean(item && item.type === 'transcript' && item.role && item.transcript))
    .map((item, index) => {
      const isUser = item.role === 'user';
      const speaker = isUser ? (user?.name || 'You') : (personaDetails?.prospectName || 'Prospect');
      return (
        <div 
          key={index} 
          className={cn(
            "mb-4 p-3 rounded-lg transition-colors duration-200",
            isUser 
              ? "bg-blue-50/80 text-blue-900 hover:bg-blue-50" 
              : "bg-gray-50/80 text-gray-900 hover:bg-gray-50"
          )}
        >
          <strong className={cn("text-sm font-medium", isUser ? "text-blue-700" : "text-gray-700")}>
            {isUser ? <User2 className="h-4 w-4 inline mr-1" /> : <Phone className="h-4 w-4 inline mr-1" />}
            {speaker}:
          </strong>
          <p className="mt-1 text-sm leading-relaxed">{item.transcript}</p>
        </div>
      );
    });

  const callScore = analysis?.feedbackSummary?.finalScore || 0;
  const engagementScore = analysis?.engagementMetrics?.prospectEngagementScore || 0;
  const objectionCount = analysis?.objectionHandling?.objectionCount || 0;

  // Calculate timeline events from transcript with stable timestamps
  const timelineEvents = (transcript || [])
    .filter(item => item && item.type === 'transcript' && item.transcript)
    .reduce((acc: Array<{time: string; event: string; type: "positive" | "negative" | "neutral" | "warning"}>, item, index, array) => {
      const totalDurationMs = Number(duration || 0);
      const timePerEvent = totalDurationMs / array.length;
      const timeInSeconds = Math.floor((timePerEvent * index) / 1000);
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Only add significant events
      if (
        item.transcript?.includes('objection') ||
        item.transcript?.includes('interested') ||
        item.transcript?.includes('concern') ||
        item.transcript?.includes('price') ||
        item.transcript?.includes('budget') ||
        index === 0 ||
        index === array.length - 1
      ) {
        acc.push({
          time: timeStr,
          event: item.transcript,
          type: index === 0 ? 'positive' : 
                index === array.length - 1 ? 'neutral' :
                item.transcript?.includes('objection') || item.transcript?.includes('concern') ? 'warning' :
                item.transcript?.includes('interested') ? 'positive' : 'neutral'
        });
      }
      return acc;
    }, []);

  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';

  const formattedTime = createdAt ? new Date(createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }) : '';

  // Sample data for ListDisplay demonstration
  const keyPoints = analysis?.feedbackSummary?.strengths || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={cn(
              "capitalize",
              callStatus === "COMPLETED" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
            )}>
              {callStatus?.toLowerCase() || 'Unknown'}
            </Badge>
            {mounted && (
              <p className="text-muted-foreground">
                {formattedDate} at {formattedTime}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                View Transcript
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Call Transcript</DialogTitle>
                <DialogDescription>
                  Full conversation log between {user?.name || 'you'} and {personaDetails?.prospectName || 'the prospect'}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] w-full rounded-md border p-6 bg-muted/10">
                {formattedTranscript.length > 0 ? (
                  <div className="space-y-4">{formattedTranscript}</div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center text-muted-foreground py-4">
                      No transcript available for this simulation.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowTimelineEvents(!showTimelineEvents)}
          >
            <Clock className="h-4 w-4" />
            {showTimelineEvents ? "Hide Timeline" : "Show Timeline"}
          </Button>
        </div>
      </div>

      {/* Call Stats Summary Card - Using the defined variables */}
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Call Performance At-a-Glance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={callScore} className="h-2 flex-1" />
                <span className="font-semibold text-lg">{callScore}/100</span>
              </div>
              <div className={cn(
                "text-xs mt-2 rounded px-1.5 py-0.5 inline-block",
                callScore >= 75 ? "bg-green-100 text-green-800" : 
                callScore >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
              )}>
                {callScore >= 75 ? "Excellent" : 
                 callScore >= 50 ? "Good" : "Needs Improvement"}
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Engagement</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={engagementScore} className="h-2 flex-1" />
                <span className="font-semibold text-lg">{engagementScore}%</span>
              </div>
              <div className={cn(
                "text-xs mt-2 rounded px-1.5 py-0.5 inline-block",
                engagementScore >= 70 ? "bg-green-100 text-green-800" : 
                engagementScore >= 40 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
              )}>
                {engagementScore >= 70 ? "High Interest" : 
                 engagementScore >= 40 ? "Moderate" : "Low Interest"}
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Objections Handled</p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-lg">{objectionHandling.objectionsHandledSuccessfully || 0}</span>
                  <span className="text-sm text-muted-foreground">of {objectionCount}</span>
                </div>
                <div className={cn(
                  "text-xs rounded px-1.5 py-0.5",
                  objectionCount > 0 ? 
                    (objectionHandling.objectionsHandledSuccessfully || 0) / objectionCount >= 0.7 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
                )}>
                  {objectionCount === 0 ? "No Objections" : 
                   (objectionHandling.objectionsHandledSuccessfully || 0) / objectionCount >= 0.7 
                    ? "Well Handled" : "Improvement Needed"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {objectionCount === 0 
                  ? "No objections were raised during this call."
                  : `${objectionHandling.objectionsHandledSuccessfully || 0} out of ${objectionCount} objections successfully addressed.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Events Section - Using timelineEvents */}
      {showTimelineEvents && timelineEvents.length > 0 && (
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Call Timeline</CardTitle>
            </div>
            <CardDescription>Key moments from the conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineEvents.map((event, index) => (
                <TimelineEvent
                  key={index}
                  time={event.time}
                  event={event.event}
                  type={event.type}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Using ListDisplay for key points */}
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Key Strengths</CardTitle>
          </div>
          <CardDescription>Areas where you performed well</CardDescription>
        </CardHeader>
        <CardContent>
          <ListDisplay items={keyPoints} />
        </CardContent>
      </Card>

      {personaDetails && (
        <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
            <div className="flex items-center gap-2">
              <User2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Prospect Profile</CardTitle>
          <CardDescription>
                  {personaDetails.prospectName} - {personaDetails.jobTitle} at {personaDetails.industry}
          </CardDescription>
              </div>
            </div>
        </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Background</h3>
                <div className="space-y-3">
                  <PersonaDetailCard
                    title="Industry"
                    value={personaDetails.industry}
                    icon={Building2}
                  />
                  <PersonaDetailCard
                    title="Job Title"
                    value={personaDetails.jobTitle}
                    icon={Briefcase}
                  />
                  <PersonaDetailCard
                    title="Current Solution"
                    value={personaDetails.currentSolution}
                    icon={Shield}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Personality Traits</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Trust Level</p>
                      <MetricBadge 
                        level={personaDetails.trustLevel} 
                        type={personaDetails.trustLevel === "High" ? "positive" : personaDetails.trustLevel === "Low" ? "negative" : "neutral"} 
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <MetricBadge 
                        level={personaDetails.confidenceLevel} 
                        type={personaDetails.confidenceLevel === "Confident" ? "positive" : "neutral"} 
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Emotional Tone</p>
                      <MetricBadge 
                        level={personaDetails.emotionalTone} 
                        type="neutral" 
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Talkativeness</p>
                      <MetricBadge 
                        level={personaDetails.talkativeness} 
                        type="neutral" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Business Context</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Pain Points</p>
                      <div className="flex flex-wrap gap-2">
                        {personaDetails.painPoints.map((point: string, index: number) => (
                          <Badge key={index} variant="secondary">{point}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Decision Making</p>
                      <MetricBadge 
                        level={personaDetails.decisionMakingStyle} 
                        type="neutral" 
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <MetricBadge 
                        level={personaDetails.budgetConstraints} 
                        type={personaDetails.budgetConstraints === "Flexible" ? "positive" : "warning"} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Call Duration"
          value={formatTime(Number(duration))}
          icon={Clock}
          description={`${Math.round(Number(duration) / 60)} minutes`}
        />
        <StatCard
          title="Engagement Score"
          value={`${analysis?.engagementMetrics?.prospectEngagementScore || 0}%`}
          icon={Heart}
          trend={
            analysis?.engagementMetrics?.prospectEngagementScore 
              ? { 
                  value: analysis.engagementMetrics.prospectEngagementScore - 50,
                  isPositive: analysis.engagementMetrics.prospectEngagementScore > 50 
                }
              : undefined
          }
        />
        <StatCard
          title="Overall Score"
          value={`${analysis?.feedbackSummary?.finalScore || 0}/100`}
          icon={BarChart3}
          trend={
            analysis?.feedbackSummary?.finalScore 
              ? {
                  value: Math.abs(analysis.feedbackSummary.finalScore - 70),
                  isPositive: analysis.feedbackSummary.finalScore > 70
                }
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Call Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Objections Handled</span>
                    <span className="font-medium">
                      {analysis?.objectionHandling?.objectionsHandledSuccessfully || 0} / {analysis?.objectionHandling?.objectionCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Next Step Secured</span>
                    <BooleanDisplay value={analysis?.nextStepSecured} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lead Status</span>
                    <Badge variant="outline" className="capitalize">
                      {analysis?.leadStatus || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Performance Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <RadialProgress 
                  value={confidenceScore} 
                  label="Confidence"
                  size={150}
                />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Overall Confidence Score</p>
                </div>
              </div>
              <div className="space-y-3">
                <PerformanceMetric
                  label="Speaking Pace"
                  value={performanceMetrics.speakingPace || 'N/A'}
                  icon={Timer}
                  type={performanceMetrics.speakingPace === 'balanced' ? 'positive' : 'neutral'}
                />
                <PerformanceMetric
                  label="Clarity"
                  value={performanceMetrics.clarity || 'N/A'}
                  icon={MessageCircle}
                  type={performanceMetrics.clarity === 'high' ? 'positive' : 'neutral'}
                />
                <PerformanceMetric
                  label="Personalization"
                  value={performanceMetrics.personalization || 'N/A'}
                  icon={Target}
                  type={performanceMetrics.personalization === 'high' ? 'positive' : 'neutral'}
                />
                <PerformanceMetric
                  label="Value Proposition"
                  value={performanceMetrics.valuePropositionClarity || 'N/A'}
                  icon={Lightbulb}
                  type={performanceMetrics.valuePropositionClarity === 'high' ? 'positive' : 'neutral'}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Objection Handling</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <RadialProgress 
                  value={objectionSuccess} 
                  label="Success Rate"
                  size={150}
                />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {objectionHandling.objectionsHandledSuccessfully || 0} of {objectionHandling.objectionCount || 0} objections handled
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Objection Types</h4>
                  <div className="space-y-2">
                    {objectionHandling.objectionTypes?.map((type: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Response Quality</h4>
                  <MetricBadge 
                    level={objectionHandling.responseQuality || 'N/A'} 
                    type={
                      objectionHandling.responseQuality === 'excellent' ? 'positive' :
                      objectionHandling.responseQuality === 'poor' ? 'negative' : 'neutral'
                    } 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {analysis && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Engagement Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Prospect Engagement</h4>
                      <span className="text-sm text-muted-foreground">
                        {analysis.engagementMetrics?.prospectEngagementScore || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={analysis.engagementMetrics?.prospectEngagementScore} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Sentiment Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">Trend</p>
                        <p className="font-medium capitalize mt-1">
                          {analysis.engagementMetrics?.sentimentTrend || 'N/A'}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">Lead Status</p>
                        <p className="font-medium capitalize mt-1">
                          {analysis.leadStatus || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {analysis.engagementMetrics?.tensionMoments && analysis.engagementMetrics.tensionMoments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Tension Points</h4>
                      <div className="space-y-2">
                        {analysis.engagementMetrics.tensionMoments.map((moment, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-yellow-50/50">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <p className="text-sm">{moment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
        </CardContent>
      </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Key Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analysis.keyMoments?.bestLine && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Best Moment</h4>
                      <div className="p-3 rounded-lg bg-green-50/50 border border-green-100">
                        <p className="text-sm italic text-green-800">&ldquo;{analysis.keyMoments.bestLine}&ldquo;</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {analysis.keyMoments?.missedOpportunities && analysis.keyMoments.missedOpportunities.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Missed Opportunities</h4>
                        <div className="space-y-2">
                          {analysis.keyMoments.missedOpportunities.map((opportunity, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-red-50/50">
                              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                              <p className="text-sm">{opportunity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.keyMoments?.turningPoints && analysis.keyMoments.turningPoints.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Turning Points</h4>
                        <div className="space-y-2">
                          {analysis.keyMoments.turningPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-blue-50/50">
                              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                              <p className="text-sm">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="transition-shadow duration-200 hover:shadow-md">
                 <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>AI Feedback Summary</CardTitle>
              </div>
                    <CardDescription>Overall assessment by the AI sales coach.</CardDescription>
                 </CardHeader>
            <CardContent className="space-y-6">
                     <p className="text-sm">{analysis.feedbackSummary?.coachCommentary || "No commentary provided."}</p>
                     {analysis.feedbackSummary?.finalScore !== undefined && (
                         <div>
                             <p className="text-sm font-medium mb-1">Overall Score: {analysis.feedbackSummary.finalScore}/100</p>
                             <Progress value={analysis.feedbackSummary.finalScore} className="w-full h-2" />
                         </div>
                     )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Strengths</h4>
                  <div className="space-y-2">
                    {analysis.feedbackSummary?.strengths?.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Weaknesses</h4>
                  <div className="space-y-2">
                    {analysis.feedbackSummary?.weaknesses?.map((weakness, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        {weakness}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Improvement Suggestions</h4>
                  <div className="space-y-2">
                    {analysis.feedbackSummary?.improvementSuggestions?.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
                 </CardContent>
            </Card>
            
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User2 className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Salesperson Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p><strong>Clarity:</strong> <span className="capitalize">{analysis.salespersonPerformance?.clarity ?? 'N/A'}</span></p>
                    <p><strong>Speaking Pace:</strong> <span className="capitalize">{analysis.salespersonPerformance?.speakingPace ?? 'N/A'}</span></p>
                    <p><strong>Filler Words:</strong> <span className="capitalize">{analysis.salespersonPerformance?.fillerWordsUsage ?? 'N/A'}</span></p>
                    <p><strong>Personalization:</strong> <span className="capitalize">{analysis.salespersonPerformance?.personalization ?? 'N/A'}</span></p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Confidence Score</p>
                    <Progress value={analysis.salespersonPerformance?.confidenceScore} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {analysis.salespersonPerformance?.confidenceScore ?? 'N/A'}/100
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Value Proposition Clarity</span>
                      <span className="capitalize">{analysis.salespersonPerformance?.valuePropositionClarity ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rapport Built</span>
                      <BooleanDisplay value={analysis.salespersonPerformance?.rapportBuilt} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Follow-up Proposed</span>
                      <BooleanDisplay value={analysis.salespersonPerformance?.followUpProposed} />
                    </div>
                  </div>
                </div>
              </div>
                </CardContent>
            </Card>

          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Engagement Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Prospect Engagement Score</p>
                <Progress value={analysis.engagementMetrics?.prospectEngagementScore} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {analysis.engagementMetrics?.prospectEngagementScore ?? 'N/A'}/100
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Sentiment Trend</p>
                <p className="text-sm capitalize">{analysis.engagementMetrics?.sentimentTrend ?? 'N/A'}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Tension Moments</h4>
                <div className="space-y-1">
                  {analysis.engagementMetrics?.tensionMoments?.map((moment, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      {moment}
                    </div>
                  )) || <p className="text-sm text-muted-foreground">No tension moments recorded</p>}
                </div>
            </div>
                </CardContent>
            </Card>

          <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Key Moments</CardTitle>
              </div>
        </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Best Line</h4>
                <p className="text-sm italic bg-muted/30 p-3 rounded-md">
                  {analysis.keyMoments?.bestLine || 'N/A'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Missed Opportunities</h4>
                  <div className="space-y-2">
                    {analysis.keyMoments?.missedOpportunities?.map((opportunity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        {opportunity}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Turning Points</h4>
                  <div className="space-y-2">
                    {analysis.keyMoments?.turningPoints?.map((point, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
} 