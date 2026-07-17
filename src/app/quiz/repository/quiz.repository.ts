import { db } from "../../../db";
import { quizzes } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateQuizDto, UpdateQuizDto } from "../dto/quiz.dto";

export class QuizRepository {
  static async findAll() {
    return await db.select().from(quizzes);
  }

  static async findById(id: number) {
    const result = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return result[0];
  }

  static async create(data: CreateQuizDto) {
    const [result] = await db.insert(quizzes).values(data as any).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateQuizDto) {
    await db.update(quizzes).set(data as any).where(eq(quizzes.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(quizzes).where(eq(quizzes.id, id));
    return { success: true };
  }
}
