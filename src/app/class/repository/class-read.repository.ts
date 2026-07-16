import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { classes, courses } from "../../../db/schema";
import { ClassEntity } from "../contract/class.contract";

export class ClassReadRepository {
  static async findAll(): Promise<ClassEntity[]> {
    const results = await db
      .select({
        id: classes.id,
        course_id: classes.course_id,
        batch_name: classes.batch_name,
        method: classes.method,
        start_date: classes.start_date,
        end_date: classes.end_date,
        price: classes.price,
        created_at: classes.created_at,
        updated_at: classes.updated_at,
        course_title: courses.title,
      })
      .from(classes)
      .innerJoin(courses, eq(classes.course_id, courses.id));
      
    return results.map(r => ({
        ...r,
        start_date: r.start_date ? new Date(r.start_date) : null,
        end_date: r.end_date ? new Date(r.end_date) : null,
        price: r.price ? Number(r.price) : null
    }));
  }

  static async findById(id: number): Promise<ClassEntity | null> {
    const results = await db
      .select({
        id: classes.id,
        course_id: classes.course_id,
        batch_name: classes.batch_name,
        method: classes.method,
        start_date: classes.start_date,
        end_date: classes.end_date,
        price: classes.price,
        created_at: classes.created_at,
        updated_at: classes.updated_at,
        course_title: courses.title,
      })
      .from(classes)
      .innerJoin(courses, eq(classes.course_id, courses.id))
      .where(eq(classes.id, id));

    if (results.length === 0) return null;
    return {
        ...results[0],
        start_date: results[0].start_date ? new Date(results[0].start_date) : null,
        end_date: results[0].end_date ? new Date(results[0].end_date) : null,
        price: results[0].price ? Number(results[0].price) : null
    };
  }
}
