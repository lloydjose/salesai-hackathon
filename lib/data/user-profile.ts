import { z } from 'zod';

export const userProfile = z.object({
  fullName: z.string(),
  roleTitle: z.string(),
  currentCompany: z.string(),
  yearsOfExperience: z.number().int().nonnegative(),
  salesMethodology: z.enum(['SPIN', 'MEDDIC', 'Challenger', 'Other']),
  sellingStyle: z.enum(['Consultative', 'Transactional', 'Solution-led', 'Other']),
  targetICP: z.string(),
  verticals: z.string(),
  averageDealSize: z.number().nonnegative(),
  toolsUsed: z.string().optional(),
}); 