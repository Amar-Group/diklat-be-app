import { z } from "zod";

export const createCertificateSchema = z.object({
  participant_id: z.number(),
  class_id: z.number(),
  certificate_number: z.string().min(1),
  bnsp_code: z.string().optional().nullable(),
  file_url: z.string().optional().nullable(),
});

export const updateCertificateSchema = z.object({
  participant_id: z.number().optional(),
  class_id: z.number().optional(),
  certificate_number: z.string().min(1).optional(),
  bnsp_code: z.string().optional().nullable(),
  file_url: z.string().optional().nullable(),
});

export type CreateCertificateDto = z.infer<typeof createCertificateSchema>;
export type UpdateCertificateDto = z.infer<typeof updateCertificateSchema>;
