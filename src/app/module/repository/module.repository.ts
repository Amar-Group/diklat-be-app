import { db } from "../../../db";
import { course_modules } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateModuleDto, UpdateModuleDto } from "../dto/module.dto";

export class ModuleRepository {
  static async findAll() {
    return await db.select().from(course_modules);
  }

  static async findById(id: number) {
    const result = await db.select().from(course_modules).where(eq(course_modules.id, id));
    return result[0];
  }

  static async create(data: CreateModuleDto) {
    const [result] = await db.insert(course_modules).values(data).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateModuleDto) {
    await db.update(course_modules).set(data).where(eq(course_modules.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(course_modules).where(eq(course_modules.id, id));
    return { success: true };
  }
}
