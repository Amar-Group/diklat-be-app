import { Hono } from "hono";
import { AttendanceController } from "../controller/attendance.controller";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";

export const attendanceRoutes = new Hono();

attendanceRoutes.use("*", jwtMiddleware);

attendanceRoutes.get(
  "/",
  requirePermission("can_read"),
  (c) => AttendanceController.getAll(c)
);

attendanceRoutes.get(
  "/:id",
  requirePermission("can_read"),
  (c) => AttendanceController.getById(c)
);

attendanceRoutes.post(
  "/",
  requirePermission("can_create"),
  (c) => AttendanceController.create(c)
);

attendanceRoutes.put(
  "/:id",
  requirePermission("can_update"),
  (c) => AttendanceController.update(c)
);

attendanceRoutes.delete(
  "/:id",
  requirePermission("can_delete"),
  (c) => AttendanceController.delete(c)
);
