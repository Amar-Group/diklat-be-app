import { ModuleRepository } from "../repository/module.repository";
import type { CreateModuleDto, UpdateModuleDto } from "../dto/module.dto";
import { createModuleSchema, updateModuleSchema } from "../dto/module.dto";

export class ModuleService {
  static async getAllModules() {
    return await ModuleRepository.findAll();
  }

  static async getModuleById(id: number) {
    const data = await ModuleRepository.findById(id);
    if (!data) throw new Error("Module not found");
    return data;
  }

  static async createModule(data: CreateModuleDto) {
    const validatedData = createModuleSchema.parse(data);
    return await ModuleRepository.create(validatedData);
  }

  static async updateModule(id: number, data: UpdateModuleDto) {
    const validatedData = updateModuleSchema.parse(data);
    return await ModuleRepository.update(id, validatedData);
  }

  static async deleteModule(id: number) {
    return await ModuleRepository.delete(id);
  }
}
