import { db } from "../../../db";
import { questions } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateQuestionDto, UpdateQuestionDto } from "../dto/question.dto";

export class QuestionRepository {
  static async findAll() {
    return await db.select().from(questions);
  }

  static async findById(id: number) {
    const result = await db.select().from(questions).where(eq(questions.id, id));
    return result[0];
  }

  static async create(data: CreateQuestionDto) {
    const [result] = await db.insert(questions).values(data as any).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateQuestionDto) {
    await db.update(questions).set(data as any).where(eq(questions.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(questions).where(eq(questions.id, id));
    return { success: true };
  }
}
