import { EvaluationRepository } from "../repository/evaluation.repository";
import type { CreateEvaluationDto, UpdateEvaluationDto } from "../dto/evaluation.dto";
import { createEvaluationSchema, updateEvaluationSchema } from "../dto/evaluation.dto";

export class EvaluationService {
  static async getAllEvaluations() {
    return await EvaluationRepository.findAll();
  }

  static async getEvaluationById(id: number) {
    const data = await EvaluationRepository.findById(id);
    if (!data) throw new Error("Evaluation not found");
    return data;
  }

  static async createEvaluation(data: CreateEvaluationDto) {
    const validatedData = createEvaluationSchema.parse(data);
    return await EvaluationRepository.create(validatedData);
  }

  static async updateEvaluation(id: number, data: UpdateEvaluationDto) {
    const validatedData = updateEvaluationSchema.parse(data);
    return await EvaluationRepository.update(id, validatedData);
  }

  static async deleteEvaluation(id: number) {
    return await EvaluationRepository.delete(id);
  }
}
