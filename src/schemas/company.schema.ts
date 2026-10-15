import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(120),
  website: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
  industry: z.string().max(80).optional().nullable(),
  location: z.string().max(120).optional().nullable(),
  size: z.string().max(50).optional().nullable(),
  description: z.string().max(3000).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

export const updateCompanySchema = companySchema.partial();

export type CompanyInput = z.infer<typeof companySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
