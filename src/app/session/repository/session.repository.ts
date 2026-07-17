import { db } from "../../../db";
import { sessions } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateSessionDto, UpdateSessionDto } from "../dto/session.dto";

export class SessionRepository {
  static async findAll() {
    return await db.select().from(sessions);
  }

  static async findById(id: number) {
    const result = await db.select().from(sessions).where(eq(sessions.id, id));
    return result[0];
  }

  static async create(data: CreateSessionDto) {
    const [result] = await db.insert(sessions).values(data as any).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateSessionDto) {
    await db.update(sessions).set(data as any).where(eq(sessions.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return { success: true };
  }
}
