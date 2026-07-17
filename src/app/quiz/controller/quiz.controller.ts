import { QuizService } from "../service/quiz.service";
import type { Context } from "hono";
import { ZodError } from "zod";

export class QuizController {
  static async getAll(c: Context) {
    try {
      const data = await QuizService.getAllQuizzes();
      return c.json({ success: true, data, message: "Data fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async getById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const data = await QuizService.getQuizById(id);
      return c.json({ success: true, data, message: "Data fetched successfully" });
    } catch (error: any) {
      if (error.message === "Quiz not found") {
        return c.json({ success: false, message: error.message }, 404);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async getMyLearningQuiz(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const user = c.get("user");
      const data = await QuizService.getMyLearningQuiz(id, user?.id || 0);
      return c.json({ success: true, data, message: "Quiz for learning fetched successfully" });
    } catch (error: any) {
      if (error.message === "Quiz not found") {
        return c.json({ success: false, message: error.message }, 404);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async submitMyLearningQuiz(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const user = c.get("user");
      const body = await c.req.json();
      const data = await QuizService.submitMyLearningQuiz(id, user?.id || 0, body.answers || []);
      return c.json({ success: true, data, message: "Quiz submitted successfully" });
    } catch (error: any) {
      if (error.message === "Quiz not found") {
        return c.json({ success: false, message: error.message }, 404);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async create(c: Context) {
    try {
      const body = await c.req.json();
      const data = await QuizService.createQuiz(body);
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
      const data = await QuizService.updateQuiz(id, body);
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
      await QuizService.deleteQuiz(id);
      return c.json({ success: true, data: null, message: "Deleted successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }
}
