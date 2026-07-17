import { MaterialRepository } from "../repository/material.repository";
import type { CreateMaterialDto, UpdateMaterialDto } from "../dto/material.dto";
import { createMaterialSchema, updateMaterialSchema } from "../dto/material.dto";

export class MaterialService {
  static async getAllMaterials() {
    return await MaterialRepository.findAll();
  }

  static async getMaterialById(id: number) {
    const data = await MaterialRepository.findById(id);
    if (!data) throw new Error("Material not found");
    return data;
  }

  static async createMaterial(data: CreateMaterialDto) {
    const validatedData = createMaterialSchema.parse(data);
    return await MaterialRepository.create(validatedData);
  }

  static async updateMaterial(id: number, data: UpdateMaterialDto) {
    const validatedData = updateMaterialSchema.parse(data);
    return await MaterialRepository.update(id, validatedData);
  }

  static async deleteMaterial(id: number) {
    return await MaterialRepository.delete(id);
  }

  static async markCompleted(materialId: number, participantId: number) {
    const { db } = await import("../../../db");
    const { participant_progress } = await import("../../../db/schema");
    const { eq, and } = await import("drizzle-orm");

    // Check if already exists
    const existing = await db
      .select()
      .from(participant_progress)
      .where(
        and(
          eq(participant_progress.participant_id, participantId),
          eq(participant_progress.material_id, materialId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(participant_progress)
        .set({ is_completed: true })
        .where(eq(participant_progress.id, existing[0].id));
    } else {
      await db.insert(participant_progress).values({
        participant_id: participantId,
        material_id: materialId,
        is_completed: true,
      });
    }
  }
}
