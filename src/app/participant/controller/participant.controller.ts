import { Context } from "hono";
import { ParticipantService } from "../service/participant.service";
import { CreateParticipantRequestDto, UpdateParticipantRequestDto } from "../dto/participant-request.dto";

export class ParticipantController {
  private static service = new ParticipantService();

  static async create(c: Context) {
    try {
      const data: CreateParticipantRequestDto = await c.req.json();
      const result = await ParticipantController.service.create(data);
      return c.json({ success: true, data: result, message: "Participant created successfully" }, 201);
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const data: UpdateParticipantRequestDto = await c.req.json();
      const result = await ParticipantController.service.update(id, data);
      return c.json({ success: true, data: result, message: "Participant updated successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async delete(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await ParticipantController.service.delete(id);
      return c.json({ success: true, data: null, message: "Participant deleted successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async findAll(c: Context) {
    try {
      const result = await ParticipantController.service.findAll();
      return c.json({ success: true, data: result, message: "Participants fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async findById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const result = await ParticipantController.service.findById(id);
      if (!result) return c.json({ success: false, message: "Participant not found" }, 404);
      return c.json({ success: true, data: result, message: "Participant fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }
}
