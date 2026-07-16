import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { users, participant_profiles, roles } from "../../../db/schema";
import { CreateParticipantRequestDto, UpdateParticipantRequestDto } from "../dto/participant-request.dto";

export class ParticipantWriteRepository {
  static async create(data: CreateParticipantRequestDto) {
    return await db.transaction(async (tx) => {
      // Find role 'participant'
      const roleResult = await tx.select().from(roles).where(eq(roles.code, 'participant'));
      if (roleResult.length === 0) {
        throw new Error("Role 'participant' not found in database");
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
        company_id: data.company_id || null,
        is_active: true,
      }).$returningId();
      
      const userId = userInsert[0].id;

      // Handle dates
      let birthDate = null;
      if (data.birth_date) {
        birthDate = new Date(data.birth_date);
      }

      // Create profile
      const profileInsert = await tx.insert(participant_profiles).values({
        user_id: userId,
        nik: data.nik,
        birth_place: data.birth_place,
        birth_date: birthDate,
        job_title: data.job_title,
        department: data.department,
        phone_number: data.phone_number,
      }).$returningId();

      return profileInsert[0].id;
    });
  }

  static async update(id: number, userId: number, data: UpdateParticipantRequestDto) {
    return await db.transaction(async (tx) => {
      if (data.name || data.email || data.company_id !== undefined || data.is_active !== undefined) {
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.company_id !== undefined) updateData.company_id = data.company_id;
        if (data.is_active !== undefined) updateData.is_active = data.is_active;
        updateData.updated_at = new Date();
        
        await tx.update(users).set(updateData).where(eq(users.id, userId));
      }

      const profileData: any = {};
      if (data.nik !== undefined) profileData.nik = data.nik;
      if (data.birth_place !== undefined) profileData.birth_place = data.birth_place;
      if (data.birth_date !== undefined) {
          profileData.birth_date = data.birth_date ? new Date(data.birth_date) : null;
      }
      if (data.job_title !== undefined) profileData.job_title = data.job_title;
      if (data.department !== undefined) profileData.department = data.department;
      if (data.phone_number !== undefined) profileData.phone_number = data.phone_number;
      
      if (Object.keys(profileData).length > 0) {
        profileData.updated_at = new Date();
        await tx.update(participant_profiles).set(profileData).where(eq(participant_profiles.id, id));
      }

      return id;
    });
  }

  static async delete(id: number, userId: number) {
    return await db.transaction(async (tx) => {
      await tx.delete(participant_profiles).where(eq(participant_profiles.id, id));
      await tx.delete(users).where(eq(users.id, userId));
      return true;
    });
  }
}
