import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { classes } from "../../../db/schema";
import { CreateClassRequestDto, UpdateClassRequestDto } from "../dto/class-request.dto";

export class ClassWriteRepository {
  static async create(data: CreateClassRequestDto) {
    const insertData: any = {
      course_id: data.course_id,
      batch_name: data.batch_name,
      method: data.method,
    };
    if (data.start_date) insertData.start_date = new Date(data.start_date);
    if (data.end_date) insertData.end_date = new Date(data.end_date);
    if (data.price !== undefined) insertData.price = data.price?.toString();

    const result = await db.insert(classes).values(insertData).$returningId();
    return result[0].id;
  }

  static async update(id: number, data: UpdateClassRequestDto) {
    const updateData: any = { updated_at: new Date() };
    if (data.course_id !== undefined) updateData.course_id = data.course_id;
    if (data.batch_name !== undefined) updateData.batch_name = data.batch_name;
    if (data.method !== undefined) updateData.method = data.method;
    if (data.start_date !== undefined) updateData.start_date = data.start_date ? new Date(data.start_date) : null;
    if (data.end_date !== undefined) updateData.end_date = data.end_date ? new Date(data.end_date) : null;
    if (data.price !== undefined) updateData.price = data.price?.toString();

    await db.update(classes).set(updateData).where(eq(classes.id, id));
    return id;
  }

  static async delete(id: number) {
    await db.delete(classes).where(eq(classes.id, id));
    return true;
  }
}
