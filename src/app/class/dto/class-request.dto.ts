import { z } from "zod";

export const CreateClassRequest = z.object({
  course_id: z.number(),
  batch_name: z.string().min(1, "Batch Name wajib diisi"),
  method: z.enum(["lms", "online", "offline", "hybrid"]),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  price: z.number().optional(),
});

export const UpdateClassRequest = z.object({
  course_id: z.number().optional(),
  batch_name: z.string().min(1).optional(),
  method: z.enum(["lms", "online", "offline", "hybrid"]).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  price: z.number().optional(),
});

export type CreateClassRequestDto = z.infer<typeof CreateClassRequest>;
export type UpdateClassRequestDto = z.infer<typeof UpdateClassRequest>;
