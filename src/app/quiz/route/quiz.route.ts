import { Hono } from "hono";
import { QuizController } from "../controller/quiz.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const quizRoutes = new Hono();

quizRoutes.use("*", jwtMiddleware);

quizRoutes.get(
  "/my-learning",
  (c) => QuizController.getAll(c)
);

quizRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => QuizController.getAll(c)
);

quizRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => QuizController.getById(c)
);

quizRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => QuizController.create(c)
);

quizRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => QuizController.update(c)
);

quizRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => QuizController.delete(c)
);
