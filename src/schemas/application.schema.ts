import { z } from 'zod';

export const jobTypes = [
  'Internship',
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
] as const;

export const workModes = ['Remote', 'Hybrid', 'On-site'] as const;

export const applicationStatuses = [
  'Wishlist',
  'Preparing',
  'Applied',
  'Assessment',
  'Interview',
  'Technical Interview',
  'Final Interview',
  'Offer',
  'Accepted',
  'Rejected',
  'Withdrawn',
] as const;

export const priorities = ['Low', 'Medium', 'High', 'Urgent'] as const;

export const createApplicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(120),
  position: z.string().min(1, 'Position is required').max(120),
  jobType: z.enum(jobTypes).default('Internship'),
  workMode: z.enum(workModes).default('Remote'),
  location: z.string().max(120).optional().nullable(),
  status: z.enum(applicationStatuses).default('Wishlist'),
  priority: z.enum(priorities).default('Medium'),
  salary: z.string().max(80).optional().nullable(),
  jobUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
  portalUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
  applicationDate: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  recruiterName: z.string().max(100).optional().nullable(),
  recruiterEmail: z.string().email('Invalid email').or(z.literal('')).optional().nullable(),
  recruiterPhone: z.string().max(50).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  resumeVersion: z.string().max(80).optional().nullable(),
  coverLetterVersion: z.string().max(80).optional().nullable(),
  companyId: z.number().int().optional().nullable(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(applicationStatuses),
  notes: z.string().max(1000).optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
