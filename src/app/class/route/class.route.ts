import { ClassMemberController } from "../controller/class-member.controller";
import { Hono } from "hono";
import { ClassController } from "../controller/class.controller";
import { zValidator } from "@hono/zod-validator";
import { CreateClassRequest, UpdateClassRequest } from "../dto/class-request.dto";
import { requirePermission } from "../../../middleware/permission";
import { jwtMiddleware } from "../../../middleware/auth";
import { appTokenMiddleware } from "../../../middleware/appToken";

const classRouter = new Hono();

classRouter.get("/my-learning", jwtMiddleware, appTokenMiddleware, (c) => ClassController.findMyLearning(c));
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


classRouter.get("/:id/participants", (c) => ClassMemberController.getParticipants(c));
classRouter.post("/:id/participants", (c) => ClassMemberController.addParticipant(c));
classRouter.delete("/:id/participants/:participantId", (c) => ClassMemberController.removeParticipant(c));

classRouter.get("/:id/instructors", (c) => ClassMemberController.getInstructors(c));
classRouter.post("/:id/instructors", (c) => ClassMemberController.addInstructor(c));
classRouter.delete("/:id/instructors/:instructorId", (c) => ClassMemberController.removeInstructor(c));

export { classRouter };
