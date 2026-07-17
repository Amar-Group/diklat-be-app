import { db } from "../../../db";
import { evaluations } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateEvaluationDto, UpdateEvaluationDto } from "../dto/evaluation.dto";

export class EvaluationRepository {
  static async findAll() {
    return await db.select().from(evaluations);
  }

  static async findById(id: number) {
    const result = await db.select().from(evaluations).where(eq(evaluations.id, id));
    return result[0];
  }

  static async create(data: CreateEvaluationDto) {
    const [result] = await db.insert(evaluations).values(data as any).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateEvaluationDto) {
    await db.update(evaluations).set(data as any).where(eq(evaluations.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(evaluations).where(eq(evaluations.id, id));
    return { success: true };
  }
}
