import { z } from "zod";

export const createQuestionSchema = z.object({
  quiz_id: z.number(),
  question_text: z.string().min(1),
  options: z.any().optional(),
  correct_answer: z.string().min(1),
});

export const updateQuestionSchema = z.object({
  quiz_id: z.number().optional(),
  question_text: z.string().min(1).optional(),
  options: z.any().optional(),
  correct_answer: z.string().min(1).optional(),
});

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>;
