import { db } from "../../../db";
import { materials } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateMaterialDto, UpdateMaterialDto } from "../dto/material.dto";

export class MaterialRepository {
  static async findAll() {
    return await db.select().from(materials);
  }

  static async findById(id: number) {
    const result = await db.select().from(materials).where(eq(materials.id, id));
    return result[0];
  }

  static async create(data: CreateMaterialDto) {
    const [result] = await db.insert(materials).values(data).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateMaterialDto) {
    await db.update(materials).set(data).where(eq(materials.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(materials).where(eq(materials.id, id));
    return { success: true };
  }
}
