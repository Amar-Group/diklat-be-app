import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { users, instructor_profiles } from "../../../db/schema";
import { InstructorEntity } from "../contract/instructor.contract";

export class InstructorReadRepository {
  static async findAll(): Promise<InstructorEntity[]> {
    const results = await db
      .select({
        id: instructor_profiles.id,
        user_id: instructor_profiles.user_id,
        name: users.name,
        email: users.email,
        bio: instructor_profiles.bio,
        expertise: instructor_profiles.expertise,
        cv_url: instructor_profiles.cv_url,
        is_active: users.is_active,
        created_at: instructor_profiles.created_at,
        updated_at: instructor_profiles.updated_at,
      })
      .from(instructor_profiles)
      .innerJoin(users, eq(instructor_profiles.user_id, users.id));
      
    return results.map(r => ({
        ...r,
        is_active: r.is_active ?? true
    }));
  }

  static async findById(id: number): Promise<InstructorEntity | null> {
    const results = await db
      .select({
        id: instructor_profiles.id,
        user_id: instructor_profiles.user_id,
        name: users.name,
        email: users.email,
        bio: instructor_profiles.bio,
        expertise: instructor_profiles.expertise,
        cv_url: instructor_profiles.cv_url,
        is_active: users.is_active,
        created_at: instructor_profiles.created_at,
        updated_at: instructor_profiles.updated_at,
      })
      .from(instructor_profiles)
      .innerJoin(users, eq(instructor_profiles.user_id, users.id))
      .where(eq(instructor_profiles.id, id));

    if (results.length === 0) return null;
    return {
        ...results[0],
        is_active: results[0].is_active ?? true
    };
  }
}
