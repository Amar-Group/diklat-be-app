import { Context } from "hono";
import { ClassService } from "../service/class.service";
import { CreateClassRequestDto, UpdateClassRequestDto } from "../dto/class-request.dto";

export class ClassController {
  private static service = new ClassService();

  static async create(c: Context) {
    try {
      const data: CreateClassRequestDto = await c.req.json();
      const result = await ClassController.service.create(data);
      return c.json({ success: true, data: result, message: "Class created successfully" }, 201);
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const data: UpdateClassRequestDto = await c.req.json();
      const result = await ClassController.service.update(id, data);
      return c.json({ success: true, data: result, message: "Class updated successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async delete(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await ClassController.service.delete(id);
      return c.json({ success: true, data: null, message: "Class deleted successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async findAll(c: Context) {
    try {
      const result = await ClassController.service.findAll();
      return c.json({ success: true, data: result, message: "Classs fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async findById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const result = await ClassController.service.findById(id);
      if (!result) return c.json({ success: false, message: "Class not found" }, 404);
      return c.json({ success: true, data: result, message: "Class fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }
}
