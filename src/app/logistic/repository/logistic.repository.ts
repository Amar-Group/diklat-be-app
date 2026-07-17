import { db } from "../../../db";
import { class_logistics } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateLogisticDto, UpdateLogisticDto } from "../dto/logistic.dto";

export class LogisticRepository {
  static async findAll() {
    return await db.select().from(class_logistics);
  }

  static async findById(id: number) {
    const result = await db.select().from(class_logistics).where(eq(class_logistics.id, id));
    return result[0];
  }

  static async create(data: CreateLogisticDto) {
    const [result] = await db.insert(class_logistics).values(data as any).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateLogisticDto) {
    await db.update(class_logistics).set(data as any).where(eq(class_logistics.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(class_logistics).where(eq(class_logistics.id, id));
    return { success: true };
  }
}
