import { AttendanceRepository } from "../repository/attendance.repository";
import type { CreateAttendanceDto, UpdateAttendanceDto } from "../dto/attendance.dto";
import { createAttendanceSchema, updateAttendanceSchema } from "../dto/attendance.dto";

export class AttendanceService {
  static async getAllAttendances() {
    return await AttendanceRepository.findAll();
  }

  static async getAttendanceById(id: number) {
    const data = await AttendanceRepository.findById(id);
    if (!data) throw new Error("Attendance not found");
    return data;
  }

  static async createAttendance(data: CreateAttendanceDto) {
    const validatedData = createAttendanceSchema.parse(data);
    return await AttendanceRepository.create(validatedData);
  }

  static async updateAttendance(id: number, data: UpdateAttendanceDto) {
    const validatedData = updateAttendanceSchema.parse(data);
    return await AttendanceRepository.update(id, validatedData);
  }

  static async deleteAttendance(id: number) {
    return await AttendanceRepository.delete(id);
  }

  static async checkIn(sessionId: number, userId: number, method: 'manual' | 'auto_zoom' | 'qr_scan' = 'manual') {
    const { db } = await import("../../../db");
    const { sessions, attendances } = await import("../../../db/schema");
    const { eq, and } = await import("drizzle-orm");

    // Validasi session ada
    const sessionRes = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (sessionRes.length === 0) throw new Error("Sesi tidak ditemukan");

    // Cek apakah sudah check-in
    const existing = await db.select().from(attendances).where(
      and(
        eq(attendances.session_id, sessionId),
        eq(attendances.participant_id, userId)
      )
    );

    if (existing.length > 0) {
      throw new Error("Anda sudah melakukan absensi untuk sesi ini");
    }

    // Insert attendance
    const [result] = await db.insert(attendances).values({
      session_id: sessionId,
      participant_id: userId,
      check_in_time: new Date(),
      method: method
    });

    return {
      id: result.insertId,
      session_id: sessionId,
      participant_id: userId,
      check_in_time: new Date(),
      method
    };
  }
}
