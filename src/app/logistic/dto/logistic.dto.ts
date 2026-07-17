import { z } from "zod";

export const createLogisticSchema = z.object({
  class_id: z.number(),
  hotel_name: z.string().optional().nullable(),
  hotel_address: z.string().optional().nullable(),
  map_url: z.string().url().optional().nullable(),
  food_schedule: z.any().optional().nullable(),
  field_trip_destination: z.string().optional().nullable(),
  itinerary: z.any().optional().nullable(),
});

export const updateLogisticSchema = z.object({
  class_id: z.number().optional(),
  hotel_name: z.string().optional().nullable(),
  hotel_address: z.string().optional().nullable(),
  map_url: z.string().url().optional().nullable(),
  food_schedule: z.any().optional().nullable(),
  field_trip_destination: z.string().optional().nullable(),
  itinerary: z.any().optional().nullable(),
});

export type CreateLogisticDto = z.infer<typeof createLogisticSchema>;
export type UpdateLogisticDto = z.infer<typeof updateLogisticSchema>;
