import { db } from "../../../db";
import { certificates } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateCertificateDto, UpdateCertificateDto } from "../dto/certificate.dto";

export class CertificateRepository {
  static async findAll() {
    return await db.select().from(certificates);
  }

  static async findById(id: number) {
    const result = await db.select().from(certificates).where(eq(certificates.id, id));
    return result[0];
  }

  static async create(data: CreateCertificateDto) {
    const [result] = await db.insert(certificates).values(data as any).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateCertificateDto) {
    await db.update(certificates).set(data as any).where(eq(certificates.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(certificates).where(eq(certificates.id, id));
    return { success: true };
  }
}
