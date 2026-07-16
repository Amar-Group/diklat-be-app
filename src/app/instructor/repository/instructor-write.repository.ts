import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { users, instructor_profiles, roles } from "../../../db/schema";
import { CreateInstructorRequestDto, UpdateInstructorRequestDto } from "../dto/instructor-request.dto";

export class InstructorWriteRepository {
  static async create(data: CreateInstructorRequestDto) {
    return await db.transaction(async (tx) => {
      // Find role 'instructor'
      const roleResult = await tx.select().from(roles).where(eq(roles.code, 'instructor'));
      if (roleResult.length === 0) {
        throw new Error("Role 'instructor' not found in database");
      }
      const roleId = roleResult[0].id;

      // Create user
      const defaultPassword = data.password || "password123";
      const username = data.email.split('@')[0];
      
      const userInsert = await tx.insert(users).values({
        username,
        email: data.email,
        password: defaultPassword, // Should be hashed in real app
        name: data.name,
        role_id: roleId,
        is_active: true,
      }).$returningId();
      
      const userId = userInsert[0].id;

      // Create profile
      const profileInsert = await tx.insert(instructor_profiles).values({
        user_id: userId,
        bio: data.bio,
        expertise: data.expertise,
        cv_url: data.cv_url,
      }).$returningId();

      return profileInsert[0].id;
    });
  }

  static async update(id: number, userId: number, data: UpdateInstructorRequestDto) {
    return await db.transaction(async (tx) => {
      if (data.name || data.email || data.is_active !== undefined) {
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.is_active !== undefined) updateData.is_active = data.is_active;
        updateData.updated_at = new Date();
        
        await tx.update(users).set(updateData).where(eq(users.id, userId));
      }

      const profileData: any = {};
      if (data.bio !== undefined) profileData.bio = data.bio;
      if (data.expertise !== undefined) profileData.expertise = data.expertise;
      if (data.cv_url !== undefined) profileData.cv_url = data.cv_url;
      
      if (Object.keys(profileData).length > 0) {
        profileData.updated_at = new Date();
        await tx.update(instructor_profiles).set(profileData).where(eq(instructor_profiles.id, id));
      }

      return id;
    });
  }

  static async delete(id: number, userId: number) {
    return await db.transaction(async (tx) => {
      await tx.delete(instructor_profiles).where(eq(instructor_profiles.id, id));
      await tx.delete(users).where(eq(users.id, userId));
      return true;
    });
  }
}
