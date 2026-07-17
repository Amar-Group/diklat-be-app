import { db } from "../../../db";
import { class_participants, class_instructors, users } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

export class ClassMemberRepository {
  // Participants
  static async getParticipants(classId: number) {
    const result = await db
      .select({
        participant_id: class_participants.participant_id,
        name: users.name,
        email: users.email,
        status: class_participants.status,
      })
      .from(class_participants)
      .innerJoin(users, eq(class_participants.participant_id, users.id))
      .where(eq(class_participants.class_id, classId));
    return result;
  }

  static async addParticipant(classId: number, participantId: number) {
    await db.insert(class_participants).values({
      class_id: classId,
      participant_id: participantId,
      status: 'registered',
    });
    return { classId, participantId };
  }

  static async removeParticipant(classId: number, participantId: number) {
    await db
      .delete(class_participants)
      .where(
        and(
          eq(class_participants.class_id, classId),
          eq(class_participants.participant_id, participantId)
        )
      );
    return true;
  }

  static async getClassesForParticipant(participantId: number) {
    const result = await db
      .select({ class_id: class_participants.class_id })
      .from(class_participants)
      .where(eq(class_participants.participant_id, participantId));
    return result.map(r => r.class_id);
  }

  // Instructors
  static async getInstructors(classId: number) {
    const result = await db
      .select({
        instructor_id: class_instructors.instructor_id,
        name: users.name,
        email: users.email,
      })
      .from(class_instructors)
      .innerJoin(users, eq(class_instructors.instructor_id, users.id))
      .where(eq(class_instructors.class_id, classId));
    return result;
  }

  static async addInstructor(classId: number, instructorId: number) {
    await db.insert(class_instructors).values({
      class_id: classId,
      instructor_id: instructorId,
    });
    return { classId, instructorId };
  }

  static async removeInstructor(classId: number, instructorId: number) {
    await db
      .delete(class_instructors)
      .where(
        and(
          eq(class_instructors.class_id, classId),
          eq(class_instructors.instructor_id, instructorId)
        )
      );
    return true;
  }

  static async getClassesForInstructor(instructorId: number) {
    const result = await db
      .select({ class_id: class_instructors.class_id })
      .from(class_instructors)
      .where(eq(class_instructors.instructor_id, instructorId));
    return result.map(r => r.class_id);
  }
}
