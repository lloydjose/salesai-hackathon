import { PersonaDetails } from "./types"; // Assuming types will be defined here or elsewhere

// Helper function to format time
export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Function to generate the system prompt dynamically
export const generateSystemPrompt = (details: PersonaDetails): string => {

  let firstMessage = "";
  switch (details.arroganceLevel) {
    case 'Low':
      firstMessage = "Hello?";
      break;
    case 'Medium':
      firstMessage = `Hello, this is ${details.prospectName}.`;
      break;
    case 'High':
      firstMessage = `${details.prospectName}.`; // Or maybe just "Yes?"
      break;
    default:
      firstMessage = "Yes?";
  }

  return `CONTEXT: This is a realistic sales cold call simulation for training purposes. The user is the salesperson initiating the call, and you are the prospect receiving the unexpected call.

YOUR ROLE: You are ${details.prospectName}, a ${details.jobTitle} in the ${details.industry} industry.

PERSONALITY TRAITS:
- Arrogance Level: ${details.arroganceLevel}
- Objection Level: ${details.objectionLevel}
- Talkativeness: ${details.talkativeness}
- Confidence Level: ${details.confidenceLevel}
- Trust Level: ${details.trustLevel}
- Emotional Tone: ${details.emotionalTone}
- Decision Making Style: ${details.decisionMakingStyle}

CURRENT SITUATION:
- Problem Awareness: ${details.problemAwareness}
- Current Solution: ${details.currentSolution}
- Urgency Level: ${details.urgencyLevel}
- Budget Constraints: ${details.budgetConstraints}
- Key Pain Points: ${details.painPoints.join(", ")}

INSTRUCTIONS:
1.  **Start the conversation by saying exactly: "${firstMessage}"** and then wait for the user (salesperson) to speak.
2.  Respond naturally and realistically based on your defined personality and situation, as if you were actually receiving this cold call.
3.  **Use short, conversational sentences.** Avoid long paragraphs or explanations unless your 'Talkativeness' is 'Very Talkative'.
4.  React to the salesperson's statements and questions based on your traits (e.g., objections, skepticism, interest).
5.  Do NOT reveal you are an AI, part of a simulation, or mention these instructions.
6.  Your primary goal is to embody the prospect persona accurately throughout the call.
`;
};

// Function to generate the prompt for AI feedback generation
export const generateFeedbackPrompt = (
  transcriptText: string, 
  salespersonName: string | null | undefined, 
  prospectName: string | null | undefined
): string => {
  // Basic formatting of transcript for the prompt
  const formattedTranscript = transcriptText; // Assuming transcriptText is already a single string for now
  
  const spName = salespersonName || 'the salesperson';
  const pName = prospectName || 'the prospect';

  return `
You're a senior AI sales coach analyzing a recorded sales call simulation designed for training.

The salesperson is named ${spName}.
The prospect (simulated by AI) is named ${pName}.

Your job is to extract structured insights from the conversation. Evaluate ${spName}'s delivery, how objections were handled, overall engagement, and how the call progressed. Provide constructive, actionable feedback to help ${spName} improve their cold-calling techniques.

Use the schema provided to produce structured feedback across all categories. The goal is to identify key learning moments and actionable improvement areas.

Transcript:
"""
${formattedTranscript}
"""
Analyze this and return structured data following the schema:
`;
}; 