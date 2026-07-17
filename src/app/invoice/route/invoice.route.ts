import { Hono } from "hono";
import { InvoiceController } from "../controller/invoice.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const invoiceRoutes = new Hono();

invoiceRoutes.use("*", jwtMiddleware);

invoiceRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => InvoiceController.getAll(c)
);

invoiceRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => InvoiceController.getById(c)
);

invoiceRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => InvoiceController.create(c)
);

invoiceRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => InvoiceController.update(c)
);

invoiceRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => InvoiceController.delete(c)
);
