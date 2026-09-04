import { z } from 'zod';

export const problemDetailsSchema = z.object({
  type: z.string().url(),
  title: z.string().min(1),
  status: z.number().int().min(400).max(599),
  code: z.string().min(1),
  detail: z.string().optional(),
  instance: z.string().optional(),
  traceId: z.string().optional(),
});

export type ProblemDetails = z.infer<typeof problemDetailsSchema>;
