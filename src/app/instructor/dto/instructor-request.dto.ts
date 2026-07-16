import { z } from "zod";

export const CreateInstructorRequest = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  cv_url: z.string().optional(),
});

export const UpdateInstructorRequest = z.object({
  name: z.string().min(1, "Nama wajib diisi").optional(),
  email: z.string().email("Email tidak valid").optional(),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  cv_url: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type CreateInstructorRequestDto = z.infer<typeof CreateInstructorRequest>;
export type UpdateInstructorRequestDto = z.infer<typeof UpdateInstructorRequest>;
