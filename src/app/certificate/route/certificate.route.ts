import { Hono } from "hono";
import { CertificateController } from "../controller/certificate.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const certificateRoutes = new Hono();

certificateRoutes.use("*", jwtMiddleware);

certificateRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => CertificateController.getAll(c)
);

certificateRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => CertificateController.getById(c)
);

certificateRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => CertificateController.create(c)
);

certificateRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => CertificateController.update(c)
);

certificateRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => CertificateController.delete(c)
);
