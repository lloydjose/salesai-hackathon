'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ExternalLink, Briefcase, GraduationCap, Info, Sparkles, MessageSquareQuote, BrainCircuit, Send, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AdvancedProspectMessaging } from '@/lib/ai/schemas';

// Define a type for the full Prospect data
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

// Update props to include analysis state and data
interface ProspectDetailProps {
  prospect: ProspectDetailData | null;
  isAnalyzing?: boolean;
  aiAnalysis?: AdvancedProspectMessaging | null;
}

// Helpers from ProspectCard, potentially move to a shared utils file
const getProfilePicUrl = (linkedinData: any, size = 200): string | undefined => {
  if (!linkedinData || typeof linkedinData !== 'object') return undefined;
  const pics = linkedinData?.profilePicAllDimensions;
  if (Array.isArray(pics)) {
      const targetPic = pics.find(p => p.width === size && p.height === size);
      if (targetPic) return targetPic.url;
      // Fallback to smaller sizes if specific size not found
      const smallPic = pics.find(p => p.width === 100 && p.height === 100);
      return smallPic?.url || linkedinData?.profilePic;
  }
  return linkedinData?.profilePic;
};

const getCurrentJobTitle = (linkedinData: any): string | undefined => {
   // (Same logic as in ProspectCard)
   if (!linkedinData || typeof linkedinData !== 'object') return undefined;
   const experiences = linkedinData?.experiences;
   if (Array.isArray(experiences) && experiences.length > 0) {
       return experiences[0]?.title;
   }
   return linkedinData?.headline;
};

const getCurrentCompany = (linkedinData: any): string | undefined => {
   if (!linkedinData || typeof linkedinData !== 'object') return undefined;
   const experiences = linkedinData?.experiences;
   if (Array.isArray(experiences) && experiences.length > 0) {
       // Extract company name from subtitle or companyLink1 if possible
       const subtitle = experiences[0]?.subtitle; // e.g., "Xage Security · Full-time"
       if (subtitle && typeof subtitle === 'string') {
           return subtitle.split('·')[0]?.trim();
       }
       // Add more robust parsing if needed
   }
   return linkedinData?.companyName; // Fallback to top-level companyName
};

// Helper function to render list items safely
const renderList = (items: string[] | undefined) => {
  if (!items || items.length === 0) return <p className="text-sm text-muted-foreground">N/A</p>;
  return (
    <ul className="list-disc list-inside space-y-1 text-sm">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );
};

// Component to display the AI Analysis Card
function AIAnalysisCard({ analysis, isLoading }: { analysis: AdvancedProspectMessaging | null | undefined, isLoading?: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Sparkles className="mr-2 h-5 w-5 text-purple-500 animate-pulse"/>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skeleton for sections */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
           <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    // Render nothing or a placeholder if analysis hasn't been run and isn't loading
    return null; // Or <p>Click 'Analyze Prospect with AI' to generate insights.</p>
  }

  const { communicationInsights, psychographicProfile, coldEmailTemplate, strategicTips } = analysis;

  return (
    <Card className="border-purple-200 border-2 shadow-md bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-900/20">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-purple-700 dark:text-purple-400">
          <Sparkles className="mr-2 h-5 w-5"/> AI Prospect Analysis
        </CardTitle>
        <CardDescription>Insights generated from LinkedIn profile data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Communication Insights */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center"><MessageSquareQuote className="mr-2 h-5 w-5 text-blue-500"/> Communication Style</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><strong className="font-medium">Likelihood to Reply:</strong> <Badge variant={communicationInsights?.likelihoodToReply === 'high' ? 'default' : communicationInsights?.likelihoodToReply === 'medium' ? 'secondary' : 'outline'}>{communicationInsights?.likelihoodToReply || 'N/A'}</Badge></div>
            <p><strong className="font-medium">Preferred Length:</strong> {communicationInsights?.preferredMessageLength || 'N/A'}</p>
            <p><strong className="font-medium">Preferred Tone:</strong> {communicationInsights?.preferredTone || 'N/A'}</p>
            <p><strong className="font-medium">Ideal CTA Style:</strong> {communicationInsights?.idealCTAStyle || 'N/A'}</p>
            <p><strong className="font-medium">Thought Leadership:</strong> {communicationInsights?.thoughtLeadershipStatus || 'N/A'}</p>
          </div>
        </div>
        <Separator />
        {/* Psychographic Profile */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center"><BrainCircuit className="mr-2 h-5 w-5 text-green-500"/> Psychographic Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div><strong className="font-medium block mb-1">Personality Type:</strong> <Badge variant="secondary">{psychographicProfile?.personalityType || 'N/A'}</Badge></div>
            <div><strong className="font-medium block mb-1">Risk Sensitivity:</strong> {psychographicProfile?.riskSensitivityLevel || 'N/A'}</div>
            <div><strong className="font-medium block mb-1">Decision Style:</strong> {psychographicProfile?.decisionMakingStyle || 'N/A'}</div>
            <div><strong className="font-medium block mb-1">Motivation Drivers:</strong> {renderList(psychographicProfile?.motivationDrivers)}</div>
            <div className="md:col-span-2"><strong className="font-medium block mb-1">Likely Priorities:</strong> {renderList(psychographicProfile?.likelyPrioritiesRightNow)}</div>
          </div>
        </div>
        <Separator />
        {/* Cold Email Template */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center"><Send className="mr-2 h-5 w-5 text-orange-500"/> Cold Email Template</h3>
          <div className="space-y-2 text-sm border p-3 rounded-md bg-background/50">
            <p><strong className="font-medium">Subject:</strong> {coldEmailTemplate?.subjectLine || 'N/A'}</p>
            <Separator className="my-1" />
            <p className="whitespace-pre-wrap"><strong className="font-medium">Body:</strong>\n{coldEmailTemplate?.bodyText || 'N/A'}</p>
            <Separator className="my-1" />
            <p><strong className="font-medium">CTA:</strong> {coldEmailTemplate?.closingCTA || 'N/A'}</p>
          </div>
        </div>
        <Separator />
        {/* Strategic Tips */}
        <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-500"/> Strategic Tips</h3>
            {renderList(strategicTips)}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProspectDetail({ prospect, isAnalyzing, aiAnalysis }: ProspectDetailProps) {
  if (!prospect) {
    return <p>Prospect data not available.</p>;
  }

  // Ensure aiAnalysis from props is used if available, otherwise use from prospect data
  const analysisData = aiAnalysis || prospect.aiAnalysis;

  // eslint-disable-next-line
  const { name, linkedinProfileUrl, linkedinData, customData, source, createdAt } = prospect;
  const profilePic = getProfilePicUrl(linkedinData);
  const jobTitle = getCurrentJobTitle(linkedinData) || (customData as any)?.jobTitle || 'No title available';
  const companyName = getCurrentCompany(linkedinData) || (customData as any)?.companyName;
  const fallbackName = name ? name.charAt(0).toUpperCase() : '?';
  const aboutText = linkedinData?.about || (customData as any)?.about;

  return (
    <div className="space-y-6">
      {/* Header/Summary Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
           <Avatar className="h-20 w-20 border">
              <AvatarImage src={profilePic} alt={name} />
              <AvatarFallback className="text-2xl">{fallbackName}</AvatarFallback>
           </Avatar>
           <div className="flex-1 space-y-1">
              <CardTitle className="text-2xl">{name}</CardTitle>
              <CardDescription className="text-base text-muted-foreground">{jobTitle}{companyName && ` at ${companyName}`}</CardDescription>
              <div className="flex flex-wrap gap-2 pt-1">
                  {source && <Badge variant="secondary">{source}</Badge>}
                  {linkedinProfileUrl && (
                      <Link href={linkedinProfileUrl} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                              LinkedIn <ExternalLink className="ml-1 h-3 w-3" />
                          </Badge>
                      </Link>
                  )}
                  {/* Add other badges if needed */}
              </div>
           </div>
        </CardHeader>
         {aboutText && (
             <>
                 <Separator />
                 <CardContent className="pt-4">
                     <h3 className="mb-2 text-sm font-semibold text-muted-foreground flex items-center"><Info className="mr-2 h-4 w-4"/>About</h3>
                     <p className="text-sm whitespace-pre-wrap">{aboutText}</p>
                 </CardContent>
             </>
         )}
      </Card>

      {/* AI Analysis Card (conditionally rendered) */}
      {(isAnalyzing || analysisData) && (
         <AIAnalysisCard analysis={analysisData} isLoading={isAnalyzing} />
      )}

      {/* Experience Card (if LinkedIn data exists) */}
      {linkedinData?.experiences && Array.isArray(linkedinData.experiences) && linkedinData.experiences.length > 0 && (
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5"/> Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {linkedinData.experiences.map((exp: any, index: number) => (
                    <div key={index} className="text-sm border-b pb-3 last:border-b-0 last:pb-0">
                        <p className="font-semibold">{exp.title}</p>
                        <p className="text-muted-foreground">{exp.subtitle}</p>
                        {exp.caption && <p className="text-xs text-muted-foreground">{exp.caption}</p>}
                        {exp.metadata && <p className="text-xs text-muted-foreground">{exp.metadata}</p>}
                        {exp.subComponents?.map((sub: any, subIndex: number) => (
                            sub.description?.map((desc: any, descIndex: number) =>
                                desc.type === 'textComponent' && desc.text ?
                                <p key={`${index}-${subIndex}-${descIndex}`} className="mt-1 text-xs whitespace-pre-wrap">{desc.text}</p> : null
                            )
                        ))}
                        {/* Handle breakdown components if needed */}
                    </div>
                ))}
            </CardContent>
          </Card>
      )}

      {/* Education Card (if LinkedIn data exists) */}
       {linkedinData?.educations && Array.isArray(linkedinData.educations) && linkedinData.educations.length > 0 && (
           <Card>
             <CardHeader>
                <CardTitle className="flex items-center"><GraduationCap className="mr-2 h-5 w-5"/> Education</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                {linkedinData.educations.map((edu: any, index: number) => (
                    <div key={index} className="text-sm">
                        <p className="font-semibold">{edu.title}</p>
                        <p className="text-muted-foreground">{edu.subtitle}</p>
                        {/* Add descriptions or activities if available */}
                    </div>
                ))}
             </CardContent>
           </Card>
       )}

      {/* Add Cards for Custom Data, Skills, etc. as needed */}
      {/* Example for Custom Data */}
       {customData && typeof customData === 'object' && Object.keys(customData).length > 0 && (
          <Card>
             <CardHeader><CardTitle>Custom Information</CardTitle></CardHeader>
             <CardContent>
                 {/* Render customData fields - requires knowing the structure */}
                 <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                     {JSON.stringify(customData, null, 2)}
                 </pre>
             </CardContent>
          </Card>
       )}

    </div>
  );
} 