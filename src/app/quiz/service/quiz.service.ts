import { QuizRepository } from "../repository/quiz.repository";
import type { CreateQuizDto, UpdateQuizDto } from "../dto/quiz.dto";
import { createQuizSchema, updateQuizSchema } from "../dto/quiz.dto";

export class QuizService {
  static async getAllQuizzes() {
    return await QuizRepository.findAll();
  }

  static async getQuizById(id: number) {
    const data = await QuizRepository.findById(id);
    if (!data) throw new Error("Quiz not found");
    return data;
  }

  static async createQuiz(data: CreateQuizDto) {
    const validatedData = createQuizSchema.parse(data);
    return await QuizRepository.create(validatedData);
  }

  static async updateQuiz(id: number, data: UpdateQuizDto) {
    const validatedData = updateQuizSchema.parse(data);
    return await QuizRepository.update(id, validatedData);
  }

  static async deleteQuiz(id: number) {
    return await QuizRepository.delete(id);
  }
}
