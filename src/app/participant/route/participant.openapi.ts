import { createRoute, z } from "@hono/zod-openapi";
import { CreateParticipantRequest, UpdateParticipantRequest } from "../dto/participant-request.dto";

const ParticipantSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  company_id: z.number().nullable(),
  name: z.string(),
  email: z.string(),
  nik: z.string().nullable(),
  birth_place: z.string().nullable(),
  birth_date: z.string().nullable(),
  job_title: z.string().nullable(),
  department: z.string().nullable(),
  phone_number: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const getParticipantsRoute = createRoute({
  method: "get",
  path: "/api/participants",
  tags: ["Participants"],
  responses: {
    200: {
      description: "List of participants",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.array(ParticipantSchema),
          }),
        },
      },
    },
  },
});

export const getParticipantByIdRoute = createRoute({
  method: "get",
  path: "/api/participants/{id}",
  tags: ["Participants"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Participant details",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ParticipantSchema,
          }),
        },
      },
    },
  },
});

export const createParticipantRoute = createRoute({
  method: "post",
  path: "/api/participants",
  tags: ["Participants"],
  request: {
    body: {
      content: { "application/json": { schema: CreateParticipantRequest } },
    },
  },
  responses: {
    201: {
      description: "Participant created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ParticipantSchema,
          }),
        },
      },
    },
  },
});

export const updateParticipantRoute = createRoute({
  method: "put",
  path: "/api/participants/{id}",
  tags: ["Participants"],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { "application/json": { schema: UpdateParticipantRequest } },
    },
  },
  responses: {
    200: {
      description: "Participant updated",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ParticipantSchema,
          }),
        },
      },
    },
  },
});

export const deleteParticipantRoute = createRoute({
  method: "delete",
  path: "/api/participants/{id}",
  tags: ["Participants"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Participant deleted",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.null(),
          }),
        },
      },
    },
  },
});
