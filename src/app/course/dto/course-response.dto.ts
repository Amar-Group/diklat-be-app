import { z } from "@hono/zod-openapi";
import { CourseEntity } from "../contract/course.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../docs/openapi-common";
import { courseSchema } from "../../../docs/openapi-schemas";

export type CourseResponseDto = CourseEntity;

export const courseListResponseSchema = createSuccessEnvelopeSchema(
  "CourseListResponse",
  z.array(courseSchema),
  "Courses fetched successfully",
);

export const courseDetailResponseSchema = createSuccessEnvelopeSchema(
  "CourseDetailResponse",
  courseSchema,
  "Course fetched successfully",
);

export const courseMutationResponseSchema = createSuccessEnvelopeSchema(
  "CourseMutationResponse",
  writeResultSchema,
  "Course created successfully",
);
