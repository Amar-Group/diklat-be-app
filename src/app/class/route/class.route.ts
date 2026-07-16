import { Hono } from "hono";
import { ClassController } from "../controller/class.controller";
import { zValidator } from "@hono/zod-validator";
import { CreateClassRequest, UpdateClassRequest } from "../dto/class-request.dto";
import { requirePermission } from "../../../middleware/permission";
import { jwtMiddleware } from "../../../middleware/auth";
import { appTokenMiddleware } from "../../../middleware/appToken";

const classRouter = new Hono();

classRouter.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

classRouter.post(
  "/",
  zValidator("json", CreateClassRequest),
  (c) => ClassController.create(c)
);
classRouter.put(
  "/:id",
  zValidator("json", UpdateClassRequest),
  (c) => ClassController.update(c)
);
classRouter.delete("/:id", (c) => ClassController.delete(c));
classRouter.get("/", (c) => ClassController.findAll(c));
classRouter.get("/:id", (c) => ClassController.findById(c));

export { classRouter };
