import { z } from "zod";

export const createEvaluationSchema = z.object({
  participant_id: z.number(),
  class_id: z.number(),
  instructor_rating: z.number().min(1).max(5).optional().nullable(),
  material_rating: z.number().min(1).max(5).optional().nullable(),
  review_text: z.string().optional().nullable(),
  is_approved_for_landing_page: z.boolean().optional(),
});

export const updateEvaluationSchema = z.object({
  participant_id: z.number().optional(),
  class_id: z.number().optional(),
  instructor_rating: z.number().min(1).max(5).optional().nullable(),
  material_rating: z.number().min(1).max(5).optional().nullable(),
  review_text: z.string().optional().nullable(),
  is_approved_for_landing_page: z.boolean().optional(),
});

export type CreateEvaluationDto = z.infer<typeof createEvaluationSchema>;
export type UpdateEvaluationDto = z.infer<typeof updateEvaluationSchema>;
