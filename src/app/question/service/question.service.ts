import { QuestionRepository } from "../repository/question.repository";
import type { CreateQuestionDto, UpdateQuestionDto } from "../dto/question.dto";
import { createQuestionSchema, updateQuestionSchema } from "../dto/question.dto";

export class QuestionService {
  static async getAllQuestions() {
    return await QuestionRepository.findAll();
  }

  static async getQuestionById(id: number) {
    const data = await QuestionRepository.findById(id);
    if (!data) throw new Error("Question not found");
    return data;
  }

  static async createQuestion(data: CreateQuestionDto) {
    const validatedData = createQuestionSchema.parse(data);
    return await QuestionRepository.create(validatedData);
  }

  static async updateQuestion(id: number, data: UpdateQuestionDto) {
    const validatedData = updateQuestionSchema.parse(data);
    return await QuestionRepository.update(id, validatedData);
  }

  static async deleteQuestion(id: number) {
    return await QuestionRepository.delete(id);
  }
}
