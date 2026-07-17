import { z } from "zod";

export const createAttendanceSchema = z.object({
  session_id: z.number(),
  participant_id: z.number(),
  check_in_time: z.string().or(z.date()).transform(val => new Date(val)),
  method: z.enum(['auto_zoom', 'qr_scan', 'manual']),
});

export const updateAttendanceSchema = z.object({
  session_id: z.number().optional(),
  participant_id: z.number().optional(),
  check_in_time: z.string().or(z.date()).transform(val => new Date(val)).optional(),
  method: z.enum(['auto_zoom', 'qr_scan', 'manual']).optional(),
});

export type CreateAttendanceDto = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceDto = z.infer<typeof updateAttendanceSchema>;
