import { z } from "zod";

export const createMaterialSchema = z.object({
  module_id: z.number(),
  type: z.enum(['video', 'document']),
  title: z.string().min(1),
  file_url: z.string().url(),
  duration_seconds: z.number().optional(),
  is_skippable: z.boolean().optional(),
});

export const updateMaterialSchema = z.object({
  module_id: z.number().optional(),
  type: z.enum(['video', 'document']).optional(),
  title: z.string().min(1).optional(),
  file_url: z.string().url().optional(),
  duration_seconds: z.number().optional(),
  is_skippable: z.boolean().optional(),
});

export type CreateMaterialDto = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialDto = z.infer<typeof updateMaterialSchema>;
