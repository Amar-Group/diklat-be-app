import { CompanyController } from "../controller/company.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../docs/openapi-common";
import {
  createCompanyRoute,
  deleteCompanyRoute,
  getAllCompanysRoute,
  getCompanyByIdRoute,
  updateCompanyRoute,
} from "./company.openapi";
import { appTokenMiddleware } from "../../../middleware/appToken";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllCompanysRoute, CompanyController.getAll);
registerOpenApiRoute(router, getCompanyByIdRoute, CompanyController.getById);
registerOpenApiRoute(router, createCompanyRoute, CompanyController.create);
registerOpenApiRoute(router, updateCompanyRoute, CompanyController.update);
registerOpenApiRoute(router, deleteCompanyRoute, CompanyController.delete);

export function getCompanyOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Company API");
}

export default router;
