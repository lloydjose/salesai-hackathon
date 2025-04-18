'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Define a type for the subset of Prospect data needed by the card
// Adjust based on the select clause in the API route
type ProspectCardData = {
  id: string;
  name: string;
  linkedinProfileUrl?: string | null;
  linkedinData?: any | null; // Keep as any for flexibility or define stricter type
  customData?: any | null;
  source?: string | null;
  createdAt?: Date | string;
};

interface ProspectCardProps {
  prospect: ProspectCardData;
}

// Helper to safely extract profile picture URL (e.g., 100x100)
const getProfilePicUrl = (linkedinData: any): string | undefined => {
  if (!linkedinData || typeof linkedinData !== 'object') return undefined;
  const pics = linkedinData?.profilePicAllDimensions;
  if (Array.isArray(pics)) {
      const smallPic = pics.find(p => p.width === 100 && p.height === 100);
      return smallPic?.url;
  }
  // Fallback to potentially simpler structure if needed
  return linkedinData?.profilePic;
};

// Helper to safely extract the first/current job title
const getCurrentJobTitle = (linkedinData: any): string | undefined => {
   if (!linkedinData || typeof linkedinData !== 'object') return undefined;
   const experiences = linkedinData?.experiences;
   if (Array.isArray(experiences) && experiences.length > 0) {
       // Simple approach: take the first experience's title
       return experiences[0]?.title;
       // More robust: Find the experience without an end date, or the one with the latest start date
   }
   return linkedinData?.headline; // Fallback to headline
};

export function ProspectCard({ prospect }: ProspectCardProps) {
  const { id, name, linkedinData, customData, source } = prospect;

  // Extract details safely
  const profilePic = getProfilePicUrl(linkedinData);
  const jobTitle = getCurrentJobTitle(linkedinData) || (customData as any)?.jobTitle || 'No title available'; // Add fallback for custom data if structured
  const fallbackName = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <Link
      href={`/dashboard/prospect-research/${id}`}
      className="block transition-transform hover:scale-[1.02]" // Apply link styles directly
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
           <Avatar className="h-12 w-12 border">
              <AvatarImage src={profilePic} alt={name} />
              <AvatarFallback>{fallbackName}</AvatarFallback>
           </Avatar>
           {/* Added min-w-0 here to allow truncation within flex item */}
           <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{name}</CardTitle>
              <CardDescription className="text-sm truncate">{jobTitle}</CardDescription>
           </div>
        </CardHeader>
        <CardContent className="pt-2">
          <Badge variant="outline" className="text-xs">
              {source || 'Unknown Source'}
          </Badge>
          {/* Add more details like date added if needed */}
           {/* <p className="text-xs text-muted-foreground mt-2\">Added: {new Date(prospect.createdAt).toLocaleDateString()}</p> */}
        </CardContent>
      </Card>
    </Link>
  );
} 