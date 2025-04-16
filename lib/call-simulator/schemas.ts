import { z } from 'zod';

export const salesCallAnalysisSchema = z.object({
  callSummary: z.string().describe("A concise summary of the call's main points and outcome."),
  leadStatus: z.enum(['cold', 'warm', 'hot', 'converted', 'lost']).describe("The prospect's temperature after the call."),
  callDurationMinutes: z.number().min(0).describe("Duration of the call in minutes."),
  nextStepSecured: z.boolean().describe("Did the salesperson successfully establish a concrete next step?"),
  conversionAttempted: z.boolean().describe("Did the salesperson attempt to close or move to the next stage?"),

  salespersonPerformance: z.object({
    clarity: z.enum(['poor', 'average', 'excellent']).describe("Clarity of the salesperson's communication."),
    speakingPace: z.enum(['slow', 'balanced', 'fast']).describe("Pacing of the salesperson's speech."),
    fillerWordsUsage: z.enum(['low', 'medium', 'high']).describe("Frequency of filler words (um, uh, like)." ),
    confidenceScore: z.number().min(0).max(100).describe("Assessed confidence level (0-100)."),
    personalization: z.enum(['none', 'some', 'high']).describe("Level of personalization shown towards the prospect."),
    rapportBuilt: z.boolean().describe("Did the salesperson build rapport effectively?"),
    valuePropositionClarity: z.enum(['poor', 'average', 'strong']).describe("Clarity and impact of the value proposition statement."),
    followUpProposed: z.boolean().describe("Was a follow-up suggested or scheduled?"),
  }).describe("Evaluation of the salesperson's delivery and technique."),

  objectionHandling: z.object({
    objectionCount: z.number().min(0).describe("Total number of objections raised by the prospect."),
    objectionsHandledSuccessfully: z.number().min(0).describe("Number of objections addressed effectively."),
    objectionTypes: z.array(z.enum([
      'price', 'timing', 'authority', 'competitor', 'budget', 'need clarity', 'not interested'
    ])).describe("Types of objections encountered."),
    responseQuality: z.enum(['poor', 'average', 'strong']).describe("Overall quality of objection responses."),
  }).describe("Analysis of how objections were managed."),

  engagementMetrics: z.object({
    prospectEngagementScore: z.number().min(0).max(100).describe("Estimated prospect engagement level (0-100)."),
    sentimentTrend: z.enum(['negative', 'neutral', 'positive', 'mixed']).describe("Overall sentiment trend during the call."),
    tensionMoments: z.array(z.string()).describe("Specific timestamps or descriptions of tense moments."), // e.g., "03:15 - Prospect interrupted pitch"
  }).describe("Metrics related to call dynamics and engagement."),

  keyMoments: z.object({
    bestLine: z.string().describe("The most impactful line delivered by the salesperson."),
    missedOpportunities: z.array(z.string()).describe("Key opportunities missed by the salesperson."),
    turningPoints: z.array(z.string()).describe("Moments where the call direction significantly changed."),
  }).describe("Identification of crucial moments in the call."),

  feedbackSummary: z.object({
    strengths: z.array(z.string()).describe("Key strengths demonstrated by the salesperson."),
    weaknesses: z.array(z.string()).describe("Areas where the salesperson struggled."),
    improvementSuggestions: z.array(z.string()).describe("Actionable suggestions for improvement."),
    finalScore: z.number().min(0).max(100).describe("Overall performance score (0-100)."),
    coachCommentary: z.string().describe("A final overarching comment from the AI coach."),
  }).describe("Overall feedback summary and score.")
});

export type SalesCallAnalysis = z.infer<typeof salesCallAnalysisSchema>; 