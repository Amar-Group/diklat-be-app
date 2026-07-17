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

  static async getMyLearningEvaluation(classId: number, userId: number) {
    const { db } = await import("../../../db");
    const { evaluations } = await import("../../../db/schema");
    const { eq, and } = await import("drizzle-orm");

    const result = await db.select().from(evaluations).where(
      and(
        eq(evaluations.class_id, classId),
        eq(evaluations.participant_id, userId)
      )
    );

    return result[0] || null;
  }

  static async submitMyLearningEvaluation(classId: number, userId: number, data: { instructor_rating: number, material_rating: number, review_text: string }) {
    const { db } = await import("../../../db");
    const { evaluations, classes } = await import("../../../db/schema");
    const { eq, and } = await import("drizzle-orm");

    // Validasi kelas ada
    const classRes = await db.select().from(classes).where(eq(classes.id, classId));
    if (classRes.length === 0) throw new Error("Kelas tidak ditemukan");

    // Validasi apakah sudah pernah memberi ulasan
    const existing = await this.getMyLearningEvaluation(classId, userId);
    if (existing) {
      throw new Error("Anda sudah pernah memberikan ulasan untuk kelas ini");
    }

    const [result] = await db.insert(evaluations).values({
      participant_id: userId,
      class_id: classId,
      instructor_rating: data.instructor_rating,
      material_rating: data.material_rating,
      review_text: data.review_text,
      is_approved_for_landing_page: false
    });

    return { id: result.insertId, ...data };
  }
}
