import { createRoute, z } from "@hono/zod-openapi";
import { CreateInstructorRequest, UpdateInstructorRequest } from "../dto/instructor-request.dto";

const InstructorSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  email: z.string(),
  bio: z.string().nullable(),
  expertise: z.string().nullable(),
  cv_url: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const getInstructorsRoute = createRoute({
  method: "get",
  path: "/api/instructors",
  tags: ["Instructors"],
  responses: {
    200: {
      description: "List of instructors",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.array(InstructorSchema),
          }),
        },
      },
    },
  },
});

export const getInstructorByIdRoute = createRoute({
  method: "get",
  path: "/api/instructors/{id}",
  tags: ["Instructors"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Instructor details",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: InstructorSchema,
          }),
        },
      },
    },
  },
});

export const createInstructorRoute = createRoute({
  method: "post",
  path: "/api/instructors",
  tags: ["Instructors"],
  request: {
    body: {
      content: { "application/json": { schema: CreateInstructorRequest } },
    },
  },
  responses: {
    201: {
      description: "Instructor created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: InstructorSchema,
          }),
        },
      },
    },
  },
});

export const updateInstructorRoute = createRoute({
  method: "put",
  path: "/api/instructors/{id}",
  tags: ["Instructors"],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { "application/json": { schema: UpdateInstructorRequest } },
    },
  },
  responses: {
    200: {
      description: "Instructor updated",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: InstructorSchema,
          }),
        },
      },
    },
  },
});

export const deleteInstructorRoute = createRoute({
  method: "delete",
  path: "/api/instructors/{id}",
  tags: ["Instructors"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Instructor deleted",
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
