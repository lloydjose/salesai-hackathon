import { SalesCallAnalysis } from './schemas'; // Assuming schemas.ts is in the same directory

export interface PersonaDetails {
    arroganceLevel: string;
    objectionLevel: string;
    talkativeness: string;
    confidenceLevel: string;
    trustLevel: string;
    emotionalTone: string;
    decisionMakingStyle: string;
    problemAwareness: string;
    currentSolution: string;
    urgencyLevel: string;
    budgetConstraints: string;
    painPoints: string[];
    prospectName: string;
    jobTitle: string;
    industry: string;
}

export interface SimulationData {
  id: string;
  user: { name: string | null; image: string | null } | null;
  personaDetails: PersonaDetails | null;
  callStatus: string;
  duration?: number | null;
  transcript?: Array<{ type: string; role: string; transcript: string; timestamp?: number }> | null;
  createdAt?: Date | string | null;
  feedback?: SalesCallAnalysis | null;
}

// Add other shared types if needed 

// --- Cold Email Form Input Type ---
export const coldEmailStyles = [
    "Formal", 
    "Casual", 
    "Direct", 
    "Value-driven", 
    "Humorous", 
    "Storytelling", 
    "Concise"
] as const;

export const psychologyAngles = [
    "Curiosity", 
    "Social Proof", 
    "Authority", 
    "Scarcity", 
    "Reciprocity", 
    "Likability", 
    "Urgency"
] as const;

export type ColdEmailStyle = typeof coldEmailStyles[number];
export type PsychologyAngle = typeof psychologyAngles[number];

export interface ColdEmailFormInput {
    recipientName?: string | null;
    recipientTitle?: string | null;
    recipientCompany?: string | null;
    prospectId?: string | null; // CUID if selecting existing prospect
    emailSubjectContext: string;
    emailStyle: ColdEmailStyle;
    psychologyAngle: PsychologyAngle;
    customInstructions?: string | null;
} 