import { db } from "../../../db";
import { attendances } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateAttendanceDto, UpdateAttendanceDto } from "../dto/attendance.dto";

export class AttendanceRepository {
  static async findAll() {
    return await db.select().from(attendances);
  }

  static async findById(id: number) {
    const result = await db.select().from(attendances).where(eq(attendances.id, id));
    return result[0];
  }

  static async create(data: CreateAttendanceDto) {
    const [result] = await db.insert(attendances).values(data as any).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateAttendanceDto) {
    await db.update(attendances).set(data as any).where(eq(attendances.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(attendances).where(eq(attendances.id, id));
    return { success: true };
  }
}
