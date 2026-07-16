import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../docs/openapi-common";
import {
  createCourseRequestSchema,
  updateCourseRequestSchema,
} from "../dto/course-request.dto";
import {
  courseListResponseSchema,
  courseDetailResponseSchema,
  courseMutationResponseSchema,
} from "../dto/course-response.dto";

const tags = ["Courses"];
const courseIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllCoursesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all courses",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(courseListResponseSchema, "Courses fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getCourseByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get course by id",
  security: protectedSecurity,
  request: {
    params: courseIdParamsSchema,
  },
  responses: {
    200: jsonResponse(courseDetailResponseSchema, "Course fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid course id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Course not found"),
    500: errorResponses[500],
  },
});

export const createCourseRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create course",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createCourseRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(courseMutationResponseSchema, "Course created successfully"),
    ...errorResponses,
  },
});

export const updateCourseRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update course",
  security: protectedSecurity,
  request: {
    params: courseIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateCourseRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(courseMutationResponseSchema, "Course updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Course not found"),
  },
});

export const deleteCourseRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete course",
  security: protectedSecurity,
  request: {
    params: courseIdParamsSchema,
  },
  responses: {
    200: jsonResponse(courseMutationResponseSchema, "Course deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid course id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Course not found"),
    500: errorResponses[500],
  },
});
