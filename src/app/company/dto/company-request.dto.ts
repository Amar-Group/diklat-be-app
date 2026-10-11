import { z } from "@hono/zod-openapi";

export const createCompanyRequestSchema = z
  .object({
    name: z.string().min(1).openapi({ example: "PT Harapan Bangsa" }),
    address: z.string().optional().openapi({ example: "Jl. Sudirman No. 1" }),
    phone: z.string().optional().openapi({ example: "081234567890" }),
    email: z.string().email().optional().openapi({ example: "hrd@harapanbangsa.co.id" }),
    status: z.enum(['active', 'inactive']).default('active').openapi({ example: "active" }),
  })
  .openapi("CreateCompanyRequest");

export const updateCompanyRequestSchema = z
  .object({
    name: z.string().min(1).optional().openapi({ example: "PT Harapan Bangsa" }),
    address: z.string().optional().openapi({ example: "Jl. Sudirman No. 1" }),
    phone: z.string().optional().openapi({ example: "081234567890" }),
    email: z.string().email().optional().openapi({ example: "hrd@harapanbangsa.co.id" }),
    status: z.enum(['active', 'inactive']).optional().openapi({ example: "active" }),
  })
  .openapi("UpdateCompanyRequest");

export type CreateCompanyRequestDto = z.infer<typeof createCompanyRequestSchema>;
export type UpdateCompanyRequestDto = z.infer<typeof updateCompanyRequestSchema>;
