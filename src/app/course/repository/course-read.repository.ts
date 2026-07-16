import { db } from "../../../db";
import { courses } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { CourseEntity } from "../contract/course.contract";

export class CourseReadRepository {
  static async getAllCourses(): Promise<CourseEntity[]> {
    return db.select().from(courses);
  }

  static async getCourseById(id: number): Promise<CourseEntity | null> {
    const result = await db.select().from(courses).where(eq(courses.id, id));
    return result[0] || null;
  }
}