import { z } from 'zod';

export const PAIN_POINTS = [
  'Time',
  'Money',
  'Efficiency',
  'Growth',
  'Retention',
  'Quality',
  'Competition',
  'Innovation',
  'Compliance',
  'Security',
] as const;

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'eCommerce',
  'SaaS',
  'Financial Services',
  'Manufacturing',
  'Education',
  'Real Estate',
  'Retail',
  'Professional Services',
] as const;

export const callSimulatorSchema = z.object({
  // Personality & Disposition
  arroganceLevel: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  objectionLevel: z.enum(['Passive', 'Moderate', 'Aggressive']).default('Moderate'),
  talkativeness: z.enum(['Quiet', 'Balanced', 'Very Talkative']).default('Balanced'),
  confidenceLevel: z.enum(['Unsure', 'Confident', 'Overconfident']).default('Confident'),
  trustLevel: z.enum(['Skeptical', 'Neutral', 'Trusting']).default('Neutral'),
  emotionalTone: z.enum(['Friendly', 'Neutral', 'Cold', 'Hostile']).default('Neutral'),
  decisionMakingStyle: z.enum(['Emotional', 'Logical', 'Indecisive', 'Fast-Action Taker']).default('Logical'),

  // Needs & Pain Points
  problemAwareness: z.enum(['Unaware', 'Somewhat aware', 'Very aware']).default('Somewhat aware'),
  currentSolution: z.enum(['Using a competitor', 'DIY', 'Nothing in place']).default('Using a competitor'),
  urgencyLevel: z.enum(['Not urgent', 'Some urgency', 'Urgent now']).default('Some urgency'),
  budgetConstraints: z.enum(['Tight', 'Flexible', 'No budget limit']).default('Flexible'),
  painPoints: z.array(z.enum(PAIN_POINTS)).min(1).max(3).default(['Efficiency']),

  // Prospect Role & Industry
  prospectName: z.string().min(2).max(100).default('Jane Doe'),
  jobTitle: z.string().min(2).max(100).default('Marketing Manager'),
  industry: z.enum(INDUSTRIES).default('Technology'),
});

export type CallSimulatorForm = z.infer<typeof callSimulatorSchema>; 