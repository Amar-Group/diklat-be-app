import { MaterialService } from "../service/material.service";
import type { Context } from "hono";
import { ZodError } from "zod";

export class MaterialController {
  static async getAll(c: Context) {
    try {
      const data = await MaterialService.getAllMaterials();
      return c.json({ success: true, data, message: "Data fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async getById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const data = await MaterialService.getMaterialById(id);
      return c.json({ success: true, data, message: "Data fetched successfully" });
    } catch (error: any) {
      if (error.message === "Material not found") {
        return c.json({ success: false, message: error.message }, 404);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async create(c: Context) {
    try {
      const body = await c.req.json();
      const data = await MaterialService.createMaterial(body);
      return c.json({ success: true, data, message: "Created successfully" }, 201);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return c.json({ success: false, message: "Validation Error", errors: ((error as unknown) as ZodError).errors }, 400);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const data = await MaterialService.updateMaterial(id, body);
      return c.json({ success: true, data, message: "Updated successfully" });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return c.json({ success: false, message: "Validation Error", errors: ((error as unknown) as ZodError).errors }, 400);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async delete(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await MaterialService.deleteMaterial(id);
      return c.json({ success: true, data: null, message: "Deleted successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async markCompleted(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const user = c.get("user");
      await MaterialService.markCompleted(id, user.id);
      return c.json({ success: true, message: "Progress saved" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }
}
