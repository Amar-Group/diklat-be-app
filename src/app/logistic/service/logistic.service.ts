import { LogisticRepository } from "../repository/logistic.repository";
import type { CreateLogisticDto, UpdateLogisticDto } from "../dto/logistic.dto";
import { createLogisticSchema, updateLogisticSchema } from "../dto/logistic.dto";

export class LogisticService {
  static async getAllLogistics() {
    return await LogisticRepository.findAll();
  }

  static async getLogisticById(id: number) {
    const data = await LogisticRepository.findById(id);
    if (!data) throw new Error("Logistic not found");
    return data;
  }

  static async createLogistic(data: CreateLogisticDto) {
    const validatedData = createLogisticSchema.parse(data);
    return await LogisticRepository.create(validatedData);
  }

  static async updateLogistic(id: number, data: UpdateLogisticDto) {
    const validatedData = updateLogisticSchema.parse(data);
    return await LogisticRepository.update(id, validatedData);
  }

  static async deleteLogistic(id: number) {
    return await LogisticRepository.delete(id);
  }
}
