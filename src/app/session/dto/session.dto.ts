import { z } from "zod";

export const createSessionSchema = z.object({
  class_id: z.number(),
  title: z.string().min(1),
  type: z.enum(['online', 'offline', 'field_trip']),
  start_time: z.string().or(z.date()).transform(val => new Date(val)),
  end_time: z.string().or(z.date()).transform(val => new Date(val)),
  meeting_url: z.string().url().optional().nullable(),
  qr_token: z.string().optional().nullable(),
});

export const updateSessionSchema = z.object({
  class_id: z.number().optional(),
  title: z.string().min(1).optional(),
  type: z.enum(['online', 'offline', 'field_trip']).optional(),
  start_time: z.string().or(z.date()).transform(val => new Date(val)).optional(),
  end_time: z.string().or(z.date()).transform(val => new Date(val)).optional(),
  meeting_url: z.string().url().optional().nullable(),
  qr_token: z.string().optional().nullable(),
});

export type CreateSessionDto = z.infer<typeof createSessionSchema>;
export type UpdateSessionDto = z.infer<typeof updateSessionSchema>;
