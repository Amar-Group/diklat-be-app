import { Context } from "hono";
import { ClassMemberRepository } from "../repository/class-member.repository";

export class ClassMemberController {
  // Participants
  static async getParticipants(c: Context) {
    const classId = Number(c.req.param("id"));
    try {
      const data = await ClassMemberRepository.getParticipants(classId);
      return c.json({ success: true, data });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async addParticipant(c: Context) {
    const classId = Number(c.req.param("id"));
    const body = await c.req.json();
    try {
      const data = await ClassMemberRepository.addParticipant(classId, body.participant_id);
      return c.json({ success: true, data, message: "Participant added" }, 201);
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async removeParticipant(c: Context) {
    const classId = Number(c.req.param("id"));
    const participantId = Number(c.req.param("participantId"));
    try {
      await ClassMemberRepository.removeParticipant(classId, participantId);
      return c.json({ success: true, message: "Participant removed" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  // Instructors
  static async getInstructors(c: Context) {
    const classId = Number(c.req.param("id"));
    try {
      const data = await ClassMemberRepository.getInstructors(classId);
      return c.json({ success: true, data });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async addInstructor(c: Context) {
    const classId = Number(c.req.param("id"));
    const body = await c.req.json();
    try {
      const data = await ClassMemberRepository.addInstructor(classId, body.instructor_id);
      return c.json({ success: true, data, message: "Instructor added" }, 201);
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async removeInstructor(c: Context) {
    const classId = Number(c.req.param("id"));
    const instructorId = Number(c.req.param("instructorId"));
    try {
      await ClassMemberRepository.removeInstructor(classId, instructorId);
      return c.json({ success: true, message: "Instructor removed" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }
}
