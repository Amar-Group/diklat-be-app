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

  static async getMyLearningSessions(classId: number, userId: number) {
    const { db } = await import("../../../db");
    const { sessions, attendances } = await import("../../../db/schema");
    const { eq, and, asc } = await import("drizzle-orm");

    // Dapatkan semua sesi untuk kelas ini
    const classSessions = await db.select().from(sessions)
      .where(eq(sessions.class_id, classId))
      .orderBy(asc(sessions.start_time));

    // Dapatkan semua attendance (check-in) user ini untuk sesi-sesi tersebut
    const userAttendances = await db.select().from(attendances)
      .where(eq(attendances.participant_id, userId));

    // Gabungkan
    const mappedSessions = classSessions.map(session => {
      const attendance = userAttendances.find(a => a.session_id === session.id);
      return {
        ...session,
        attendance: attendance || null
      };
    });

    return mappedSessions;
  }
}
