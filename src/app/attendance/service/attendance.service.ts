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
}
