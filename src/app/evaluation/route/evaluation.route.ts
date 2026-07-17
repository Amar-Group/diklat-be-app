import { Hono } from "hono";
import { EvaluationController } from "../controller/evaluation.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const evaluationRoutes = new Hono();

evaluationRoutes.use("*", jwtMiddleware);

evaluationRoutes.get(
  "/my-learning/:classId",
  (c) => EvaluationController.getMyLearningEvaluation(c)
);

evaluationRoutes.post(
  "/my-learning/:classId",
  (c) => EvaluationController.submitMyLearningEvaluation(c)
);

evaluationRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => EvaluationController.getAll(c)
);

evaluationRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => EvaluationController.getById(c)
);

evaluationRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => EvaluationController.create(c)
);

evaluationRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => EvaluationController.update(c)
);

evaluationRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => EvaluationController.delete(c)
);
