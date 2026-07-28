import { db } from "../../../db";
import { courses, course_modules } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { CourseEntity } from "../contract/course.contract";

export interface CourseModulePublic {
  id: number;
  title: string;
  order_sequence: number;
}

export interface CoursePublicCatalog extends CourseEntity {
  modules: CourseModulePublic[];
}

export class CourseReadRepository {
  static async getAllCourses(): Promise<CourseEntity[]> {
    return db.select().from(courses);
  }

  static async getCourseById(id: number): Promise<CourseEntity | null> {
    const result = await db.select().from(courses).where(eq(courses.id, id));
    return result[0] || null;
  }

  static async getPublicCatalog(): Promise<CoursePublicCatalog[]> {
    // Fetch all active courses
    const allCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.is_active, true));

    if (allCourses.length === 0) return [];

    const activeCourseIds = new Set(allCourses.map((c) => c.id));

    // Fetch all modules, then filter in-memory by active course IDs
    const allModules = await db
      .select({
        id: course_modules.id,
        course_id: course_modules.course_id,
        title: course_modules.title,
        order_sequence: course_modules.order_sequence,
      })
      .from(course_modules);

    // Build a map of course_id -> modules[]
    const modulesByCourse = new Map<number, CourseModulePublic[]>();
    for (const mod of allModules) {
      if (!activeCourseIds.has(mod.course_id)) continue;
      if (!modulesByCourse.has(mod.course_id)) {
        modulesByCourse.set(mod.course_id, []);
      }
      modulesByCourse.get(mod.course_id)!.push({
        id: mod.id,
        title: mod.title,
        order_sequence: mod.order_sequence,
      });
    }

    // Sort modules by order_sequence
    modulesByCourse.forEach((mods) =>
      mods.sort((a, b) => a.order_sequence - b.order_sequence)
    );

    // Combine courses with their modules
    return allCourses.map((course) => ({
      ...course,
      modules: modulesByCourse.get(course.id) ?? [],
    }));
  }
}