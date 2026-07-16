import { Hono } from "hono";
import { ParticipantController } from "../controller/participant.controller";
import { zValidator } from "@hono/zod-validator";
import { CreateParticipantRequest, UpdateParticipantRequest } from "../dto/participant-request.dto";
import { requirePermission } from "../../../middleware/permission";
import { jwtMiddleware } from "../../../middleware/auth";
import { appTokenMiddleware } from "../../../middleware/appToken";

const participantRouter = new Hono();

participantRouter.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

participantRouter.post(
  "/",
  zValidator("json", CreateParticipantRequest),
  (c) => ParticipantController.create(c)
);
participantRouter.put(
  "/:id",
  zValidator("json", UpdateParticipantRequest),
  (c) => ParticipantController.update(c)
);
participantRouter.delete("/:id", (c) => ParticipantController.delete(c));
participantRouter.get("/", (c) => ParticipantController.findAll(c));
participantRouter.get("/:id", (c) => ParticipantController.findById(c));

export { participantRouter };
