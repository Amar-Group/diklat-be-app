import { Hono } from "hono";
import { MaterialController } from "../controller/material.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const materialRoutes = new Hono();

materialRoutes.use("*", jwtMiddleware);

materialRoutes.get(
  "/my-learning",
  (c) => MaterialController.getAll(c)
);

materialRoutes.post(
  "/my-learning/:id/progress",
  (c) => MaterialController.markCompleted(c)
);

materialRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => MaterialController.getAll(c)
);

materialRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => MaterialController.getById(c)
);

materialRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => MaterialController.create(c)
);

materialRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => MaterialController.update(c)
);

materialRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => MaterialController.delete(c)
);
