import { Context } from "hono";
import { InstructorService } from "../service/instructor.service";
import { CreateInstructorRequestDto, UpdateInstructorRequestDto } from "../dto/instructor-request.dto";

export class InstructorController {
  private static service = new InstructorService();

  static async create(c: Context) {
    try {
      const data: CreateInstructorRequestDto = await c.req.json();
      const result = await InstructorController.service.create(data);
      return c.json({ success: true, data: result, message: "Instructor created successfully" }, 201);
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const data: UpdateInstructorRequestDto = await c.req.json();
      const result = await InstructorController.service.update(id, data);
      return c.json({ success: true, data: result, message: "Instructor updated successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async delete(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await InstructorController.service.delete(id);
      return c.json({ success: true, data: null, message: "Instructor deleted successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async findAll(c: Context) {
    try {
      const result = await InstructorController.service.findAll();
      return c.json({ success: true, data: result, message: "Instructors fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async findById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const result = await InstructorController.service.findById(id);
      if (!result) return c.json({ success: false, message: "Instructor not found" }, 404);
      return c.json({ success: true, data: result, message: "Instructor fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }
}
