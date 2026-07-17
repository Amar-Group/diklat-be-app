import { z } from "zod";

export const createModuleSchema = z.object({
  course_id: z.number(),
  title: z.string().min(1),
  order_sequence: z.number().default(0),
});

export const updateModuleSchema = z.object({
  course_id: z.number().optional(),
  title: z.string().min(1).optional(),
  order_sequence: z.number().optional(),
});

export type CreateModuleDto = z.infer<typeof createModuleSchema>;
export type UpdateModuleDto = z.infer<typeof updateModuleSchema>;
