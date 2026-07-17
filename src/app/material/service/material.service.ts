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
}
