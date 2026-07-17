import { z } from "zod";

export const createInvoiceSchema = z.object({
  invoice_number: z.string().min(1),
  company_id: z.number().optional().nullable(),
  user_id: z.number().optional().nullable(),
  class_id: z.number(),
  total_amount: z.number(),
  status: z.enum(['unpaid', 'pending_validation', 'paid']).optional(),
  payment_proof_url: z.string().optional().nullable(),
  due_date: z.any().optional().nullable(),
});

export const updateInvoiceSchema = z.object({
  invoice_number: z.string().min(1).optional(),
  company_id: z.number().optional().nullable(),
  user_id: z.number().optional().nullable(),
  class_id: z.number().optional(),
  total_amount: z.number().optional(),
  status: z.enum(['unpaid', 'pending_validation', 'paid']).optional(),
  payment_proof_url: z.string().optional().nullable(),
  due_date: z.any().optional().nullable(),
});

export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceDto = z.infer<typeof updateInvoiceSchema>;
