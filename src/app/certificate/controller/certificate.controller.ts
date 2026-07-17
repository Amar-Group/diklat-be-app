import { CertificateService } from "../service/certificate.service";
import type { Context } from "hono";
import { ZodError } from "zod";

export class CertificateController {
  static async getAll(c: Context) {
    try {
      const data = await CertificateService.getAllCertificates();
      return c.json({ success: true, data, message: "Data fetched successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async getById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const data = await CertificateService.getCertificateById(id);
      return c.json({ success: true, data, message: "Data fetched successfully" });
    } catch (error: any) {
      if (error.message === "Certificate not found") {
        return c.json({ success: false, message: error.message }, 404);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async create(c: Context) {
    try {
      const body = await c.req.json();
      const data = await CertificateService.createCertificate(body);
      return c.json({ success: true, data, message: "Created successfully" }, 201);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return c.json({ success: false, message: "Validation Error", errors: ((error as unknown) as ZodError).errors }, 400);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const data = await CertificateService.updateCertificate(id, body);
      return c.json({ success: true, data, message: "Updated successfully" });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return c.json({ success: false, message: "Validation Error", errors: ((error as unknown) as ZodError).errors }, 400);
      }
      return c.json({ success: false, message: error.message }, 500);
    }
  }

  static async delete(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await CertificateService.deleteCertificate(id);
      return c.json({ success: true, data: null, message: "Deleted successfully" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  }
}
