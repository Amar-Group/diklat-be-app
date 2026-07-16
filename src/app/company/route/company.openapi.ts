import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../docs/openapi-common";
import {
  createCompanyRequestSchema,
  updateCompanyRequestSchema,
} from "../dto/company-request.dto";
import {
  companyListResponseSchema,
  companyDetailResponseSchema,
  companyMutationResponseSchema,
} from "../dto/company-response.dto";

const tags = ["Companys"];
const companyIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllCompanysRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all companies",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(companyListResponseSchema, "Companys fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getCompanyByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get company by id",
  security: protectedSecurity,
  request: {
    params: companyIdParamsSchema,
  },
  responses: {
    200: jsonResponse(companyDetailResponseSchema, "Company fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid company id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Company not found"),
    500: errorResponses[500],
  },
});

export const createCompanyRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create company",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createCompanyRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(companyMutationResponseSchema, "Company created successfully"),
    ...errorResponses,
  },
});

export const updateCompanyRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update company",
  security: protectedSecurity,
  request: {
    params: companyIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateCompanyRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(companyMutationResponseSchema, "Company updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Company not found"),
  },
});

export const deleteCompanyRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete company",
  security: protectedSecurity,
  request: {
    params: companyIdParamsSchema,
  },
  responses: {
    200: jsonResponse(companyMutationResponseSchema, "Company deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid company id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Company not found"),
    500: errorResponses[500],
  },
});
