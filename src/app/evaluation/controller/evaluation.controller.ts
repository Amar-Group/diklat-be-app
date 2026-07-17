import { EvaluationService } from "../service/evaluation.service";
import type { Context } from "hono";
import { ZodError } from "zod";

export class EvaluationController {
  static async getAll(c: Context) {
    try {
      const data = await EvaluationService.getAllEvaluations();
      return c.json({ success: true, data, message: "Data fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async getById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const data = await EvaluationService.getEvaluationById(id);
      return c.json({ success: true, data, message: "Data fetched successfully" });
    } catch (error: any) {
      if (error.message === "Evaluation not found") {
        return c.json({ success: false, message: error.message }, 404);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async getMyLearningEvaluation(c: Context) {
    try {
      const classId = Number(c.req.param("classId"));
      const user = c.get("user");
      const data = await EvaluationService.getMyLearningEvaluation(classId, user?.id || 0);
      return c.json({ success: true, data, message: "Data fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async submitMyLearningEvaluation(c: Context) {
    try {
      const classId = Number(c.req.param("classId"));
      const user = c.get("user");
      const body = await c.req.json();
      
      const data = await EvaluationService.submitMyLearningEvaluation(classId, user?.id || 0, body);
      return c.json({ success: true, data, message: "Ulasan berhasil dikirim" }, 201);
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async create(c: Context) {
    try {
      const body = await c.req.json();
      const data = await EvaluationService.createEvaluation(body);
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
      const data = await EvaluationService.updateEvaluation(id, body);
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
      await EvaluationService.deleteEvaluation(id);
      return c.json({ success: true, data: null, message: "Deleted successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }
}
