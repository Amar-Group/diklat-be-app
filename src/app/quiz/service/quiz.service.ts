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

  static async getMyLearningQuiz(quizId: number, userId: number) {
    const { db } = await import("../../../db");
    const { quizzes, questions, quiz_attempts } = await import("../../../db/schema");
    const { eq, and, desc } = await import("drizzle-orm");

    const quizRes = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    if (quizRes.length === 0) throw new Error("Quiz not found");
    const quiz = quizRes[0];

    // Fetch questions without correct_answer
    const questionsRes = await db.select({
      id: questions.id,
      quiz_id: questions.quiz_id,
      question_text: questions.question_text,
      options: questions.options
    }).from(questions).where(eq(questions.quiz_id, quizId));

    // Fetch previous attempt
    const attemptRes = await db.select().from(quiz_attempts).where(
      and(
        eq(quiz_attempts.quiz_id, quizId),
        eq(quiz_attempts.participant_id, userId)
      )
    ).orderBy(desc(quiz_attempts.id)).limit(1);

    return {
      quiz,
      questions: questionsRes,
      last_attempt: attemptRes.length > 0 ? attemptRes[0] : null
    };
  }

  static async submitMyLearningQuiz(quizId: number, userId: number, answers: { question_id: number, answer: string }[]) {
    const { db } = await import("../../../db");
    const { quizzes, questions, quiz_attempts } = await import("../../../db/schema");
    const { eq } = await import("drizzle-orm");

    const quizRes = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    if (quizRes.length === 0) throw new Error("Quiz not found");
    const quiz = quizRes[0];

    const questionsRes = await db.select().from(questions).where(eq(questions.quiz_id, quizId));

    let correctCount = 0;
    for (const ans of answers) {
      const q = questionsRes.find(q => q.id === ans.question_id);
      if (q && q.correct_answer === ans.answer) {
        correctCount++;
      }
    }

    const totalQuestions = questionsRes.length;
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const isPassed = score >= quiz.passing_grade;

    const [insertResult] = await db.insert(quiz_attempts).values({
      participant_id: userId,
      quiz_id: quizId,
      score: score.toString(),
      is_passed: isPassed
    });

    return {
      score,
      is_passed: isPassed,
      correct_count: correctCount,
      total_questions: totalQuestions,
      attempt_id: insertResult.insertId
    };
  }
}
