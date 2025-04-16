// lib/call-simulator/types.ts

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
  user: { name: string | null; image: string | null };
  prospect: { name: string }; 
  personaDetails: PersonaDetails;
  callStatus: string;
}

// Add other shared types if needed 