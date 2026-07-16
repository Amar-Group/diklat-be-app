import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { users, participant_profiles } from "../../../db/schema";
import { ParticipantEntity } from "../contract/participant.contract";

export class ParticipantReadRepository {
  static async findAll(): Promise<ParticipantEntity[]> {
    const results = await db
      .select({
        id: participant_profiles.id,
        user_id: participant_profiles.user_id,
        company_id: users.company_id,
        name: users.name,
        email: users.email,
        nik: participant_profiles.nik,
        birth_place: participant_profiles.birth_place,
        birth_date: participant_profiles.birth_date,
        job_title: participant_profiles.job_title,
        department: participant_profiles.department,
        phone_number: participant_profiles.phone_number,
        is_active: users.is_active,
        created_at: participant_profiles.created_at,
        updated_at: participant_profiles.updated_at,
      })
      .from(participant_profiles)
      .innerJoin(users, eq(participant_profiles.user_id, users.id));
      
    return results.map(r => ({
        ...r,
        is_active: r.is_active ?? true,
        birth_date: r.birth_date ? new Date(r.birth_date) : null
    }));
  }

  static async findById(id: number): Promise<ParticipantEntity | null> {
    const results = await db
      .select({
        id: participant_profiles.id,
        user_id: participant_profiles.user_id,
        company_id: users.company_id,
        name: users.name,
        email: users.email,
        nik: participant_profiles.nik,
        birth_place: participant_profiles.birth_place,
        birth_date: participant_profiles.birth_date,
        job_title: participant_profiles.job_title,
        department: participant_profiles.department,
        phone_number: participant_profiles.phone_number,
        is_active: users.is_active,
        created_at: participant_profiles.created_at,
        updated_at: participant_profiles.updated_at,
      })
      .from(participant_profiles)
      .innerJoin(users, eq(participant_profiles.user_id, users.id))
      .where(eq(participant_profiles.id, id));

    if (results.length === 0) return null;
    return {
        ...results[0],
        is_active: results[0].is_active ?? true,
        birth_date: results[0].birth_date ? new Date(results[0].birth_date) : null
    };
  }
}
