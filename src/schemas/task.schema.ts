import { z } from 'zod';

export const taskSchema = z.object({
  applicationId: z.number().int().optional().nullable(),
  title: z.string().min(1, 'Task title is required').max(180),
  description: z.string().max(2000).optional().nullable(),
  dueDate: z.string().optional().nullable(),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  isCompleted: z.boolean().default(false),
});

export const updateTaskSchema = taskSchema.partial();

export const prepNoteSchema = z.object({
  companyResearch: z.string().max(10000).optional().nullable(),
  technicalTopics: z.string().max(10000).optional().nullable(),
  starStories: z.string().max(10000).optional().nullable(),
  questionsToAsk: z.string().max(5000).optional().nullable(),
  areasToImprove: z.string().max(5000).optional().nullable(),
});

export const documentSchema = z.object({
  type: z.enum(['RESUME', 'COVER_LETTER']),
  title: z.string().min(1, 'Title is required').max(120),
  version: z.string().min(1, 'Version is required').max(30).default('v1'),
  filePath: z.string().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type PrepNoteInput = z.infer<typeof prepNoteSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
