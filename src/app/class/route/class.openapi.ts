import { createRoute, z } from "@hono/zod-openapi";
import { CreateClassRequest, UpdateClassRequest } from "../dto/class-request.dto";

const ClassSchema = z.object({
  id: z.number(),
  course_id: z.number(),
  batch_name: z.string(),
  method: z.string(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  price: z.number().nullable(),
  course_title: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const getClassesRoute = createRoute({
  method: "get",
  path: "/api/classes",
  tags: ["Classes"],
  responses: {
    200: {
      description: "List of classes",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.array(ClassSchema),
          }),
        },
      },
    },
  },
});

export const getClassByIdRoute = createRoute({
  method: "get",
  path: "/api/classes/{id}",
  tags: ["Classes"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Class details",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ClassSchema,
          }),
        },
      },
    },
  },
});

export const createClassRoute = createRoute({
  method: "post",
  path: "/api/classes",
  tags: ["Classes"],
  request: {
    body: {
      content: { "application/json": { schema: CreateClassRequest } },
    },
  },
  responses: {
    201: {
      description: "Class created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ClassSchema,
          }),
        },
      },
    },
  },
});

export const updateClassRoute = createRoute({
  method: "put",
  path: "/api/classes/{id}",
  tags: ["Classes"],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { "application/json": { schema: UpdateClassRequest } },
    },
  },
  responses: {
    200: {
      description: "Class updated",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ClassSchema,
          }),
        },
      },
    },
  },
});

export const deleteClassRoute = createRoute({
  method: "delete",
  path: "/api/classes/{id}",
  tags: ["Classes"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Class deleted",
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
