import { z } from "@hono/zod-openapi";
import { CompanyEntity } from "../contract/company.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../docs/openapi-common";
import { companySchema } from "../../../docs/openapi-schemas";

export type CompanyResponseDto = CompanyEntity;

export const companyListResponseSchema = createSuccessEnvelopeSchema(
  "CompanyListResponse",
  z.array(companySchema),
  "Companys fetched successfully",
);

export const companyDetailResponseSchema = createSuccessEnvelopeSchema(
  "CompanyDetailResponse",
  companySchema,
  "Company fetched successfully",
);

export const companyMutationResponseSchema = createSuccessEnvelopeSchema(
  "CompanyMutationResponse",
  writeResultSchema,
  "Company created successfully",
);
