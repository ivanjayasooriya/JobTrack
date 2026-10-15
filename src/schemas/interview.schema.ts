import { z } from 'zod';

export const interviewRounds = ['HR', 'Technical', 'Behavioral', 'Managerial', 'Final'] as const;
export const interviewResults = ['Pending', 'Passed', 'Failed', 'Cancelled'] as const;

export const interviewSchema = z.object({
  applicationId: z.number().int().positive('Application ID required'),
  round: z.enum(interviewRounds),
  title: z.string().min(1, 'Title is required').max(120),
  scheduledAt: z.string().min(1, 'Scheduled date and time is required'),
  durationMinutes: z.number().int().min(5).max(480).default(45),
  interviewers: z.string().max(200).optional().nullable(),
  meetingUrl: z.string().url('Invalid meeting URL').or(z.literal('')).optional().nullable(),
  location: z.string().max(150).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  feedback: z.string().max(5000).optional().nullable(),
  result: z.enum(interviewResults).default('Pending'),
});

export const updateInterviewSchema = interviewSchema.partial().omit({ applicationId: true });

export type InterviewInput = z.infer<typeof interviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
