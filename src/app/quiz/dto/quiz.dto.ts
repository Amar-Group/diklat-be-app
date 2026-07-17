import { z } from "zod";

export const createQuizSchema = z.object({
  module_id: z.number(),
  title: z.string().min(1),
  passing_grade: z.number().min(0).max(100),
});

export const updateQuizSchema = z.object({
  module_id: z.number().optional(),
  title: z.string().min(1).optional(),
  passing_grade: z.number().min(0).max(100).optional(),
});

export type CreateQuizDto = z.infer<typeof createQuizSchema>;
export type UpdateQuizDto = z.infer<typeof updateQuizSchema>;
