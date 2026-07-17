import { Hono } from "hono";
import { LogisticController } from "../controller/logistic.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const logisticRoutes = new Hono();

logisticRoutes.use("*", jwtMiddleware);

logisticRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => LogisticController.getAll(c)
);

logisticRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => LogisticController.getById(c)
);

logisticRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => LogisticController.create(c)
);

logisticRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => LogisticController.update(c)
);

logisticRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => LogisticController.delete(c)
);
