import { Hono } from "hono";
import { InstructorController } from "../controller/instructor.controller";
import { zValidator } from "@hono/zod-validator";
import { CreateInstructorRequest, UpdateInstructorRequest } from "../dto/instructor-request.dto";
import { requirePermission } from "../../../middleware/permission";
import { jwtMiddleware } from "../../../middleware/auth";
import { appTokenMiddleware } from "../../../middleware/appToken";

const instructorRouter = new Hono();

instructorRouter.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

instructorRouter.post(
  "/",
  zValidator("json", CreateInstructorRequest),
  (c) => InstructorController.create(c)
);
instructorRouter.put(
  "/:id",
  zValidator("json", UpdateInstructorRequest),
  (c) => InstructorController.update(c)
);
instructorRouter.delete("/:id", (c) => InstructorController.delete(c));
instructorRouter.get("/", (c) => InstructorController.findAll(c));
instructorRouter.get("/:id", (c) => InstructorController.findById(c));

export { instructorRouter };
