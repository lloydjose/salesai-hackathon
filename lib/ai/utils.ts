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

// New function to generate prompt for prospect analysis
export const generateProfileInsightsprompt = (profileData: any): string => {
  // Basic check to ensure we have some data
  if (!profileData || typeof profileData !== 'object' || Object.keys(profileData).length === 0) {
    return "Error: Invalid or empty profile data provided.";
  }

  // Attempt to stringify, handling potential errors
  let profileDataString;
  try {
    profileDataString = JSON.stringify(profileData, null, 2); // Pretty print for readability if needed
  } catch (error) {
    console.error("Error stringifying profile data:", error);
    return "Error: Could not process profile data.";
  }

  return `
You're a senior AI sales analyst tasked with analyzing a prospect's LinkedIn profile data.

Your goal is to infer the person's communication preferences, potential psychographic traits, decision-making style, and key priorities based *solely* on the provided LinkedIn data. You must then generate a highly personalized cold email template tailored to this individual and provide strategic tips for engaging them effectively.

**Analysis Requirements:**
- **Communication:** Infer their likely preferred message length, tone (e.g., formal, conversational, technical, visionary), ideal CTA style (e.g., soft ask, direct, curious), and assess their public thought leadership status.
- **Psychographics:** Determine a likely personality archetype (e.g., visionary strategist, analytical problem solver, risk-conscious operator), list potential motivation drivers (e.g., "industry impact", "scaling innovation"), identify likely current priorities (e.g., "growing secure OT access", "AI product adoption"), estimate risk sensitivity, and infer their decision-making style (e.g., data-driven, intuition-driven).
- **Cold Email:** Craft a subject line, body text, and closing CTA designed to resonate with the inferred persona and priorities. The body should be concise and immediately relevant.
- **Strategic Tips:** Provide actionable advice for engaging this prospect (e.g., "Avoid feature lists; focus on strategic outcomes", "Reference their recent post on X to build rapport").

**Input Data:**
Below is the raw JSON data extracted from the prospect's LinkedIn profile:
\`\`\`json
${profileDataString}
\`\`\`

**Instructions:**
Based *only* on the provided LinkedIn data, perform the analysis and generate the structured output according to the required schema. Ensure the email template is directly informed by your analysis of the prospect's profile.
Return structured data using the schema:
`;
};

// --- New Function for Pre-Call Planning Brief ---

// Interface for the user input part of the planning
interface CallPlanningInput {
  callType: 'Discovery' | 'Demo' | 'Follow-up' | 'Cold Outreach' | 'Upsell' | 'Renewal';
  productPitchContext?: string | null;
  callObjective: string;
  customNotes?: string | null;
  knownPainPoints?: string[] | null;
  competitorMentioned?: string[] | null;
  priorityLevel?: 'Low' | 'Medium' | 'High' | null;
}

export const generateCallPrepBriefPrompt = (
  userInput: CallPlanningInput,
  profileData: any // Assuming this is the linkedinData JSON object
): string => {
  // Basic checks
  if (!profileData || typeof profileData !== 'object' || Object.keys(profileData).length === 0) {
    return "Error: Invalid or empty LinkedIn profile data provided.";
  }
  if (!userInput || !userInput.callType || !userInput.callObjective) {
      return "Error: Missing required call planning input (callType, callObjective).";
  }

  // Safely stringify profile data
  let profileDataString;
  try {
    profileDataString = JSON.stringify(profileData, null, 2);
  } catch (error) {
    console.error("Error stringifying profile data for call prep:", error);
    return "Error: Could not process profile data.";
  }

  // Construct the prompt using both user input and profile data
  return `
You are an AI Sales Assistant tasked with creating a Pre-Call Planning Brief.

**Objective:** Synthesize the provided LinkedIn profile data with the user's specific call context to generate actionable insights and recommendations for an upcoming sales call.

**1. User-Provided Call Context:**
   - **Call Type:** ${userInput.callType}
   - **Call Objective:** ${userInput.callObjective}
   ${userInput.productPitchContext ? `- **Product/Service Context:** ${userInput.productPitchContext}` : ''}
   ${userInput.customNotes ? `- **Custom Notes:** ${userInput.customNotes}` : ''}
   ${userInput.knownPainPoints && userInput.knownPainPoints.length > 0 ? `- **Known Pain Points:** ${userInput.knownPainPoints.join(', ')}` : ''}
   ${userInput.competitorMentioned && userInput.competitorMentioned.length > 0 ? `- **Competitors Mentioned:** ${userInput.competitorMentioned.join(', ')}` : ''}
   ${userInput.priorityLevel ? `- **Sales Rep Priority:** ${userInput.priorityLevel}` : ''}

**2. Prospect's LinkedIn Profile Data:**
\`\`\`json
${profileDataString}
\`\`\`

**Instructions:**
Based *only* on the LinkedIn data and the user's call context, generate a structured Pre-Call Planning Brief using the provided schema. Focus on creating practical, actionable advice.

- Infer the prospect's decision-making power, current focus areas, likely pain points (beyond those explicitly known, if applicable), and preferred communication tone.
- Identify potential communication pitfalls.
- Suggest strategic conversation hooks based on their profile.
- Craft a tailored opening line and product angle relevant to the call objective.
- Forecast likely objections.
- Recommend a clear Call To Action.

Return the structured data using the schema:
`;
};

// --- New Function for Conversation Intelligence Analysis ---

export const generateConversationInsightsPrompt = (
    transcriptText: string,
    description?: string | null // Optional user-provided context
): string => {
    // Basic checks
    if (!transcriptText || transcriptText.trim().length === 0) {
        return "Error: Transcript text is empty or invalid.";
    }

    // Construct the prompt
    return `
You are an expert AI Sales Coach specializing in conversation intelligence.

**Objective:** Analyze the provided sales call transcript to generate a comprehensive performance report, including scoring, sentiment analysis, key moment identification, and actionable coaching feedback.

**1. Call Context (Optional):**
${description ? `- User Description: ${description}` : `- No additional context provided.`}

**2. Call Transcript:**
\`\`\`
${transcriptText}
\`\`\`

**Instructions:**
Based on the transcript and optional context, generate a structured Conversation Intelligence report using the provided schema. Ensure your analysis covers:
- A concise summary.
- An overall score (0-100) with a breakdown across key sales competencies.
- A timeline of significant sentiment shifts.
- The talk-to-listen ratio.
- Detection and evaluation of objections.
- Identification of the best line, missed opportunities, and closing effectiveness.
- Concrete strengths, areas for improvement, and specific coaching tips.
- Relevant tags summarizing the call.

Provide objective, data-driven insights where possible, focusing on actionable feedback for the salesperson.
Return the structured data using the schema:
`;
};

// --- New Function for Cold Email Generation Prompt ---
import { ColdEmailFormInput } from './types'; // Import the form input type

// Helper to safely extract relevant prospect info
const getProspectContext = (prospectData: any): string => {
    if (!prospectData || typeof prospectData !== 'object') return "No prospect details provided.";
    
    let context = "Prospect Details:\n";
    if (prospectData.name) context += `- Name: ${prospectData.name}\n`;
    
    // Attempt to get title/company from linkedinData if present
    const profile = prospectData.linkedinData?.profile || prospectData.linkedinData;
    if (profile?.headline) context += `- Headline: ${profile.headline}\n`;
    if (profile?.location) context += `- Location: ${profile.location}\n`;
    if (profile?.companyName) context += `- Company: ${profile.companyName}\n`;
    // Add more relevant fields from your linkedinData structure if needed
    // e.g., recent posts, shared connections (be careful with complexity)

    if (context === "Prospect Details:\n") return "Prospect details available but no specific fields found.";
    return context;
}

export const generateColdEmailPrompt = (
    userInput: ColdEmailFormInput,
    prospectData?: any | null, // Optional prospect data fetched from DB
    senderName?: string | null, // Add sender name
    senderTitle?: string | null // Add sender title
): string => {
    let recipientInfo = "";
    if (userInput.prospectId && prospectData) {
        recipientInfo = getProspectContext(prospectData);
    } else {
        recipientInfo = "Recipient Details (Manual Input):\n";
        if (userInput.recipientName) recipientInfo += `- Name: ${userInput.recipientName}\n`;
        if (userInput.recipientTitle) recipientInfo += `- Title: ${userInput.recipientTitle}\n`;
        if (userInput.recipientCompany) recipientInfo += `- Company: ${userInput.recipientCompany}\n`;
        if (recipientInfo === "Recipient Details (Manual Input):\n") recipientInfo = "No specific recipient details provided manually.";
    }

    let senderInfo = "Sender Information:\n";
    senderInfo += `- Name: ${senderName || 'Unknown Sender'}\n`;
    if (senderTitle) senderInfo += `- Title: ${senderTitle}\n`;

    return `
You are an expert cold email copywriter specializing in B2B sales outreach. Your goal is to generate a highly personalized, concise, and effective cold email based on the provided context.

**Task:** Generate a structured cold email draft.

**Sender Information:**
${senderInfo}

**Recipient Information:**
${recipientInfo}

**Email Context & Goal:**
- **Subject Matter/Goal:** ${userInput.emailSubjectContext}
- **Desired Style:** ${userInput.emailStyle}
- **Psychological Angle:** ${userInput.psychologyAngle}
${userInput.customInstructions ? `- **Additional Instructions:** ${userInput.customInstructions}\n` : ''}
**Instructions:**
1.  Craft the email components (subject, greeting, hook, value prop, optional connector, CTA, closing) according to the specified style and psychological angle.
2.  **Personalize Heavily:** Use the recipient information (either from the prospect data or manual input) to make the opening hook and value proposition highly relevant.
3.  **Be Concise:** Keep the email short and easy to scan.
4.  **Strong CTA:** Ensure the Call To Action is clear, specific, and low-friction.
5.  **Scoring:** Provide scores (1-10) for clarity, personalization, CTA strength, tone alignment, and overall effectiveness.
6.  **Reasoning:** Briefly explain the rationale behind your key choices (e.g., why this opening hook, why this CTA).

**Output Format:** Return ONLY the structured JSON object adhering strictly to the following schema:
`;
}; 