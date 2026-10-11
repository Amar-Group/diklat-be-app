import { z } from "@hono/zod-openapi";

export const createCourseRequestSchema = z
  .object({
    title: z.string().min(1).openapi({ example: "Pelatihan Kepemimpinan" }),
    description: z.string().optional().openapi({ example: "Pelatihan untuk calon supervisor" }),
    competencies: z.string().optional().openapi({ example: "Leadership, Communication" }),
    is_active: z.boolean().default(true).openapi({ example: true }),
  })
  .openapi("CreateCourseRequest");

export const updateCourseRequestSchema = z
  .object({
    title: z.string().min(1).optional().openapi({ example: "Pelatihan Kepemimpinan Lanjut" }),
    description: z.string().optional().openapi({ example: "Pelatihan untuk calon manajer" }),
    competencies: z.string().optional().openapi({ example: "Leadership, Strategic Planning" }),
    is_active: z.boolean().optional().openapi({ example: true }),
  })
  .openapi("UpdateCourseRequest");

export type CreateCourseRequestDto = z.infer<typeof createCourseRequestSchema>;
export type UpdateCourseRequestDto = z.infer<typeof updateCourseRequestSchema>;
