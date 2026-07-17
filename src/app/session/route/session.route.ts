import { Hono } from "hono";
import { SessionController } from "../controller/session.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const sessionRoutes = new Hono();

sessionRoutes.use("*", jwtMiddleware);

sessionRoutes.get(
  "/my-learning/:classId",
  (c) => SessionController.getMyLearningSessions(c)
);

sessionRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => SessionController.getAll(c)
);

sessionRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => SessionController.getById(c)
);

sessionRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => SessionController.create(c)
);

sessionRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => SessionController.update(c)
);

sessionRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => SessionController.delete(c)
);
