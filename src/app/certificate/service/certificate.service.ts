import { CertificateRepository } from "../repository/certificate.repository";
import type { CreateCertificateDto, UpdateCertificateDto } from "../dto/certificate.dto";
import { createCertificateSchema, updateCertificateSchema } from "../dto/certificate.dto";

export class CertificateService {
  static async getAllCertificates() {
    return await CertificateRepository.findAll();
  }

  static async getCertificateById(id: number) {
    const data = await CertificateRepository.findById(id);
    if (!data) throw new Error("Certificate not found");
    return data;
  }

  static async createCertificate(data: CreateCertificateDto) {
    const validatedData = createCertificateSchema.parse(data);
    return await CertificateRepository.create(validatedData);
  }

  static async updateCertificate(id: number, data: UpdateCertificateDto) {
    const validatedData = updateCertificateSchema.parse(data);
    return await CertificateRepository.update(id, validatedData);
  }

  static async deleteCertificate(id: number) {
    return await CertificateRepository.delete(id);
  }

  static async getMyLearningCertificate(classId: number, userId: number) {
    const { db } = await import("../../../db");
    const { certificates, classes, courses } = await import("../../../db/schema");
    const { eq, and } = await import("drizzle-orm");

    const result = await db.select({
      id: certificates.id,
      certificate_number: certificates.certificate_number,
      bnsp_code: certificates.bnsp_code,
      file_url: certificates.file_url,
      issued_date: certificates.issued_date,
      class_name: classes.batch_name,
      course_title: courses.title
    }).from(certificates)
      .leftJoin(classes, eq(certificates.class_id, classes.id))
      .leftJoin(courses, eq(classes.course_id, courses.id))
      .where(
        and(
          eq(certificates.class_id, classId),
          eq(certificates.participant_id, userId)
        )
      );

    return result[0] || null;
  }
}
