import { z } from "zod";

export const CreateParticipantRequest = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  company_id: z.number().nullable().optional(),
  nik: z.string().optional(),
  birth_place: z.string().optional(),
  birth_date: z.string().optional(),
  job_title: z.string().optional(),
  department: z.string().optional(),
  phone_number: z.string().optional(),
});

export const UpdateParticipantRequest = z.object({
  name: z.string().min(1, "Nama wajib diisi").optional(),
  email: z.string().email("Email tidak valid").optional(),
  company_id: z.number().nullable().optional(),
  nik: z.string().optional(),
  birth_place: z.string().optional(),
  birth_date: z.string().optional(),
  job_title: z.string().optional(),
  department: z.string().optional(),
  phone_number: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type CreateParticipantRequestDto = z.infer<typeof CreateParticipantRequest>;
export type UpdateParticipantRequestDto = z.infer<typeof UpdateParticipantRequest>;
