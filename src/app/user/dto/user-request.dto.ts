import { z } from "@hono/zod-openapi";
import { createOptionalCoercedIntSchema } from "../../../docs/openapi-common";

export const loginRequestSchema = z
  .object({
    email: z.string().email().openapi({ example: "admin@example.com" }),
    password: z.string().min(1).openapi({ example: "admin123" }),
  })
  .openapi("LoginRequest");

export const createUserRequestSchema = z
  .object({
    email: z.string().email().openapi({ example: "staff@example.com" }),
    password: z.string().min(1).openapi({ example: "staff123" }),
    name: z.string().min(1).openapi({ example: "Staff User" }),
    role_id: z.coerce.number().int().openapi({ example: 2 }),
  })
  .openapi("CreateUserRequest");

export const updateUserRequestSchema = z
  .object({
    email: z.string().email().optional().openapi({ example: "staff.updated@example.com" }),
    password: z.string().min(1).optional().openapi({ example: "newpassword123" }),
    name: z.string().min(1).optional().openapi({ example: "Staff User Update" }),
    role_id: createOptionalCoercedIntSchema(3),
  })
  .openapi("UpdateUserRequest");

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
export type CreateUserRequestDto = z.infer<typeof createUserRequestSchema>;
export type UpdateUserRequestDto = z.infer<typeof updateUserRequestSchema>;

export const registerParticipantRequestSchema = z
  .object({
    name: z.string().min(1).openapi({ example: "Budi Santoso" }),
    email: z.string().email().openapi({ example: "budi@example.com" }),
    phone_number: z.string().min(1).openapi({ example: "08123456789" }),
    password: z.string().min(6).openapi({ example: "password123" }),
  })
  .openapi("RegisterParticipantRequest");

export type RegisterParticipantRequestDto = z.infer<typeof registerParticipantRequestSchema>;

export const verifyOtpRequestSchema = z
  .object({
    email: z.string().email().openapi({ example: "budi@example.com" }),
    otp: z.string().length(6).openapi({ example: "123456" }),
  })
  .openapi("VerifyOtpRequest");

export type VerifyOtpRequestDto = z.infer<typeof verifyOtpRequestSchema>;

export const resendOtpRequestSchema = z
  .object({
    email: z.string().email().openapi({ example: "budi@example.com" }),
  })
  .openapi("ResendOtpRequest");

export type ResendOtpRequestDto = z.infer<typeof resendOtpRequestSchema>;
