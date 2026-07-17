import { Hono } from "hono";
import { QuestionController } from "../controller/question.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const questionRoutes = new Hono();

questionRoutes.use("*", jwtMiddleware);

questionRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => QuestionController.getAll(c)
);

questionRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => QuestionController.getById(c)
);

questionRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => QuestionController.create(c)
);

questionRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => QuestionController.update(c)
);

questionRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => QuestionController.delete(c)
);
