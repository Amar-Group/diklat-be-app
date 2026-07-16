import { CourseController } from "../controller/course.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../docs/openapi-common";
import {
  createCourseRoute,
  deleteCourseRoute,
  getAllCoursesRoute,
  getCourseByIdRoute,
  updateCourseRoute,
} from "./course.openapi";
import { appTokenMiddleware } from "../../../middleware/appToken";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllCoursesRoute, CourseController.getAll);
registerOpenApiRoute(router, getCourseByIdRoute, CourseController.getById);
registerOpenApiRoute(router, createCourseRoute, CourseController.create);
registerOpenApiRoute(router, updateCourseRoute, CourseController.update);
registerOpenApiRoute(router, deleteCourseRoute, CourseController.delete);

export function getCourseOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Course API");
}

export default router;
