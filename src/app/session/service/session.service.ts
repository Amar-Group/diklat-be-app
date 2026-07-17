import { SessionRepository } from "../repository/session.repository";
import type { CreateSessionDto, UpdateSessionDto } from "../dto/session.dto";
import { createSessionSchema, updateSessionSchema } from "../dto/session.dto";

export class SessionService {
  static async getAllSessions() {
    return await SessionRepository.findAll();
  }

  static async getSessionById(id: number) {
    const data = await SessionRepository.findById(id);
    if (!data) throw new Error("Session not found");
    return data;
  }

  static async createSession(data: CreateSessionDto) {
    const validatedData = createSessionSchema.parse(data);
    return await SessionRepository.create(validatedData);
  }

  static async updateSession(id: number, data: UpdateSessionDto) {
    const validatedData = updateSessionSchema.parse(data);
    return await SessionRepository.update(id, validatedData);
  }

  static async deleteSession(id: number) {
    return await SessionRepository.delete(id);
  }
}
