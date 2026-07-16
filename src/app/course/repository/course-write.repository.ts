import { db } from "../../../db";
import { courses } from "../../../db/schema";
import { eq } from "drizzle-orm";
import {
  CreateCourseRequestDto,
  UpdateCourseRequestDto,
} from "../dto/course-request.dto";

export class CourseWriteRepository {
  static async createCourse(payload: CreateCourseRequestDto) {
    const result = await db.insert(courses).values(payload).$returningId();
    return { insertId: result[0].id, affectedRows: 1 };
  }

  static async updateCourse(id: number, payload: UpdateCourseRequestDto) {
    const [result] = await db
      .update(courses)
      .set({ ...payload, updated_at: new Date() })
      .where(eq(courses.id, id));
    return { insertId: 0, affectedRows: result.affectedRows };
  }

  static async deleteCourse(id: number) {
    const [result] = await db.delete(courses).where(eq(courses.id, id));
    return { insertId: 0, affectedRows: result.affectedRows };
  }
}