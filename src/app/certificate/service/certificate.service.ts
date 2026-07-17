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
}
