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

// New Schema for Prospect Messaging Insights
export const advancedProspectMessagingSchema = z.object({
  fullName: z.string().describe("Full name of the prospect."),
  linkedinUrl: z.string().url().describe("LinkedIn profile URL."),
  currentTitle: z.string().describe("Current job title."),
  companyName: z.string().describe("Current company name."),

  communicationInsights: z.object({
    likelihoodToReply: z.enum(['low', 'medium', 'high']).describe("Estimated likelihood the prospect will reply to a cold outreach."),
    preferredMessageLength: z.enum(['short', 'medium', 'long']).describe("Inferred preferred length for initial messages."),
    preferredTone: z.enum(['formal', 'conversational', 'technical', 'visionary', 'data-driven', 'relationship-focused']).describe("Most likely preferred communication tone."),
    idealCTAStyle: z.enum(['soft ask', 'direct', 'curious', 'collaborative', 'value-driven']).describe("Call-to-action style most likely to resonate."),
    thoughtLeadershipStatus: z.enum(['silent operator', 'industry voice', 'influencer', 'public thought leader', 'internal expert']).describe("Prospect's public professional visibility and influence."),
  }).describe("Insights into how the prospect likely communicates and prefers to be communicated with."),

  psychographicProfile: z.object({
    personalityType: z.enum([
      'visionary strategist',
      'analytical problem solver',
      'risk-conscious operator',
      'mentor-leader',
      'opportunistic innovator',
      'pragmatic implementer',
      'relationship builder'
    ]).describe("Dominant professional personality archetype."),
    motivationDrivers: z.array(z.string()).describe("Key factors likely driving their professional decisions (e.g., 'industry impact', 'scaling innovation', 'operational efficiency', 'team development')."),
    likelyPrioritiesRightNow: z.array(z.string()).describe("Current probable top business priorities (e.g., 'reducing OpEx', 'improving security posture', 'adopting AI tools', 'talent retention')."),
    riskSensitivityLevel: z.enum(['low', 'moderate', 'high']).describe("General tolerance for risk in professional decisions."),
    decisionMakingStyle: z.enum(['data-driven', 'intuition-driven', 'collaborative', 'authority-based', 'consensus-seeking']).describe("How the prospect likely approaches making decisions."),
  }).describe("Inferred psychological and motivational characteristics relevant to sales engagement."),

  coldEmailTemplate: z.object({
    subjectLine: z.string().describe("A highly personalized subject line optimized for open rates."),
    bodyText: z.string().describe("A concise, tailored email body incorporating insights from their profile and inferred needs/priorities."),
    closingCTA: z.string().describe("A clear, compelling call-to-action aligned with their likely preferred style."),
  }).describe("A ready-to-use cold email draft based on the analysis."),

  strategicTips: z.array(z.string()).describe("Actionable strategic tips for engaging this specific prospect (e.g., 'Focus on ROI for data-driven style', 'Highlight innovation for visionary type', 'Leverage mutual connections mentioned')."),
}).describe("AI-generated analysis providing deep insights and actionable strategies for engaging a specific prospect based on their LinkedIn profile.");

export type AdvancedProspectMessaging = z.infer<typeof advancedProspectMessagingSchema>;

// New Schema for Pre-Call Planning Brief
export const salesCallPrepBriefSchema = z.object({
  prospectSummary: z.string().describe("A concise 1-2 sentence summary of the prospect based on their LinkedIn profile (title, company, key experience)."),
  companySnapshot: z.string().describe("A brief 1-2 sentence overview of the prospect's current company (industry, size, focus)."),
  decisionPower: z.enum(['decision-maker', 'influencer', 'champion', 'gatekeeper', 'unknown']).describe("Estimated role in the decision-making process for your potential solution."),
  currentFocus: z.array(z.string()).describe("Likely current professional focus areas or initiatives based on their profile (e.g., 'Scaling cloud infrastructure', 'Improving team efficiency', 'Implementing AI tools')."),
  likelyPainPoints: z.array(z.string()).describe("Potential challenges or pain points this prospect might be facing relevant to your product/service."),
  tonePreference: z.enum(['visionary', 'technical', 'data-driven', 'relationship-focused', 'formal', 'conversational']).describe("Inferred preferred communication tone for the call."),
  communicationDoNotDos: z.array(z.string()).describe("Specific communication approaches to avoid with this prospect (e.g., 'Avoid jargon', 'Don't rush the intro', 'Avoid overly casual language')."),
  strategicHooks: z.array(z.string()).describe("Potential conversation starters or angles based on their profile (e.g., 'Mention their recent article on X', 'Reference mutual connection Y', 'Ask about their experience at Z company')."),
  openingLineSuggestion: z.string().describe("A tailored opening line suggestion for the specific call type and objective provided."),
  productAngle: z.string().describe("How to specifically angle the product/service discussion based on the prospect's profile and the call context."),
  objectionForecast: z.array(z.string()).describe("Top 1-3 likely objections the prospect might raise based on their profile and common industry challenges."),
  CTARecommendation: z.string().describe("A recommended Call To Action for the end of the call, aligned with the objective."),
}).describe("AI-generated pre-call planning brief providing actionable insights for engaging a specific prospect.");

export type SalesCallPrepBrief = z.infer<typeof salesCallPrepBriefSchema>; 