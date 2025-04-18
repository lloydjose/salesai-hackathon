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

// New Schema for Conversation Intelligence Insights
export const salesCallConversationInsightsSchema = z.object({
  callSummary: z.string().describe("A concise 1-paragraph overview summarizing the key topics, participants, and outcomes of the call."),

  totalScore: z.number().min(0).max(100).describe("An overall performance score for the salesperson based on various metrics."),
  scoreBreakdown: z.object({
    rapportBuilding: z.number().min(0).max(10).describe("Score (0-10) for effectiveness in building rapport and connection."),
    discoveryQuality: z.number().min(0).max(10).describe("Score (0-10) for the depth and quality of questions asked to understand needs."),
    objectionHandling: z.number().min(0).max(10).describe("Score (0-10) for addressing prospect objections effectively."),
    pitchEffectiveness: z.number().min(0).max(10).describe("Score (0-10) for clarity, relevance, and impact of the value proposition/pitch."),
    closeAttempt: z.number().min(0).max(10).describe("Score (0-10) evaluating the attempt (or lack thereof) to gain commitment or define next steps."),
    clarityAndConfidence: z.number().min(0).max(10).describe("Score (0-10) assessing the salesperson's vocal clarity and confidence."),
    engagementLevel: z.number().min(0).max(10).describe("Score (0-10) estimating the prospect's engagement throughout the call."),
    listeningRatio: z.number().min(0).max(10).describe("Score (0-10) reflecting the balance between salesperson talking and listening."),
    personalization: z.number().min(0).max(10).describe("Score (0-10) for tailoring the conversation to the specific prospect."),
    callControl: z.number().min(0).max(10).describe("Score (0-10) for guiding the conversation effectively towards the objective."),
  }).describe("Breakdown of the total score across key sales competencies."),

  sentimentTimeline: z.array(z.object({
    timestamp: z.string().regex(/^\d{2}:\d{2}$/, { message: "Timestamp must be in MM:SS format" }).describe("Timestamp marker (e.g., \"01:23\") for the sentiment event."),
    speaker: z.enum(['salesperson', 'prospect', 'both', 'unknown']).describe("Who exhibited the sentiment (or overall if 'both'/'unknown')."),
    sentiment: z.enum(['positive', 'neutral', 'negative']).describe("The dominant sentiment detected around this timestamp."),
  })).describe("Timeline mapping detected sentiment shifts during the call."),

  talkRatio: z.object({
    salespersonTalkTime: z.number().min(0).max(100).describe("Percentage of the call duration the salesperson was speaking."),
    prospectTalkTime: z.number().min(0).max(100).describe("Percentage of the call duration the prospect was speaking."),
  }).describe("Analysis of the talk-to-listen ratio between participants."),

  objections: z.array(z.object({
    timestamp: z.string().regex(/^\d{2}:\d{2}$/, { message: "Timestamp must be in MM:SS format" }).describe("Approximate timestamp (MM:SS) when the objection was raised."),
    type: z.enum([
      'price', 'timing', 'authority', 'need', 'trust', 'competition', 'budget', 'feature_gap', 'implementation', 'not_interested', 'other'
    ]).describe("The category of the objection raised by the prospect."),
    handledEffectively: z.boolean().describe("AI assessment of whether the salesperson's response effectively addressed the objection."),
    repResponseSnippet: z.string().describe("A brief snippet of the salesperson's response to the objection."),
  })).describe("Detected objections raised by the prospect and how they were handled."),

  bestLine: z.string().describe("The most impactful or well-delivered line by the salesperson during the call."),
  missedOpportunities: z.array(z.string()).describe("Key moments or cues where the salesperson could have asked a better question, pivoted, or capitalized on an opportunity but didn't."),
  closingAttempted: z.boolean().describe("Whether the salesperson made a clear attempt to close or secure the next step."),
  nextStepConfirmed: z.boolean().describe("Whether a concrete next step was agreed upon and confirmed by the prospect."),

  strengths: z.array(z.string()).describe("Specific positive aspects or skills demonstrated by the salesperson."),
  areasToImprove: z.array(z.string()).describe("Specific areas where the salesperson could improve their technique or approach."),
  specificCoachingTips: z.array(z.string()).describe("Actionable coaching tips tailored to the salesperson based on this call."),

  tags: z.array(z.string()).describe("Relevant tags summarizing the call content or characteristics (e.g., [\"product demo\", \"price objection handled\", \"high prospect engagement\"])."),
}).describe("Comprehensive AI analysis of a sales call recording, providing scores, insights, and coaching.");

export type SalesCallConversationInsights = z.infer<typeof salesCallConversationInsightsSchema>;

// --- New Schema for Cold Email Generator Response --- 
export const coldEmailGeneratorSchema = z.object({
    subjectLine: z.string().describe("A compelling, personalized subject line (max ~60 chars)."),
    greeting: z.string().describe("Appropriate greeting (e.g., 'Hi [Name],' or 'Dear [Mr./Ms. LastName],')."),
    openingHook: z.string().describe("A personalized sentence referencing the prospect, their company, or a relevant trigger event to grab attention."),
    valueProposition: z.string().describe("A concise explanation of the core benefit offered, tailored to the prospect's likely needs or context."),
    bodyConnector: z.string().optional().describe("Optional sentence(s) bridging the hook/value prop to the CTA, providing context or social proof briefly."),
    callToAction: z.string().describe("A clear, low-friction call-to-action (e.g., asking a question, suggesting a quick call time, offering a resource)."),
    closing: z.string().describe("Professional closing (e.g., 'Best regards,', 'Sincerely,')."),
    
    emailScore: z.object({
        clarity: z.number().min(1).max(10).describe("Score (1-10) for how clear and easy to understand the email is."),
        personalization: z.number().min(1).max(10).describe("Score (1-10) for how well the email is tailored to the specific recipient."),
        ctaStrength: z.number().min(1).max(10).describe("Score (1-10) for the effectiveness and clarity of the call-to-action."),
        toneAlignment: z.number().min(1).max(10).describe("Score (1-10) assessing how well the tone matches the requested style."),
        overall: z.number().min(1).max(10).describe("Overall estimated effectiveness score (1-10) of the generated email.")
    }).describe("Scoring of the generated email's key components."),
    
    reasoning: z.string().describe("A brief explanation (1-2 sentences) of the key choices made in crafting the email (personalization angle, CTA choice, etc.).")
}).describe("AI-generated structured cold email content with scoring.");

export type ColdEmailGeneratorResult = z.infer<typeof coldEmailGeneratorSchema>; 