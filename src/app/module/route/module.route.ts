import { Hono } from "hono";
import { ModuleController } from "../controller/module.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const moduleRoutes = new Hono();

moduleRoutes.use("*", jwtMiddleware);

moduleRoutes.get(
  "/my-learning",
  (c) => ModuleController.getAll(c)
);

moduleRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => ModuleController.getAll(c)
);

moduleRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => ModuleController.getById(c)
);

moduleRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => ModuleController.create(c)
);

moduleRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => ModuleController.update(c)
);

moduleRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => ModuleController.delete(c)
);
