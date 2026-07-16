import {
  CreateCompanyRequestDto,
  UpdateCompanyRequestDto,
} from "../dto/company-request.dto";
import { CompanyResponseDto } from "../dto/company-response.dto";
import { CompanyReadRepository } from "../repository/company-read.repository";
import { CompanyWriteRepository } from "../repository/company-write.repository";

export class CompanyService {
  static async getAllCompanies(): Promise<CompanyResponseDto[]> {
    return CompanyReadRepository.getAllCompanies();
  }

  static async getCompanyById(id: number): Promise<CompanyResponseDto | null> {
    return CompanyReadRepository.getCompanyById(id);
  }

  static async createCompany(payload: CreateCompanyRequestDto) {
    const result = await CompanyWriteRepository.createCompany(payload);
    return { conflict: false as const, result };
  }

  static async updateCompany(id: number, payload: UpdateCompanyRequestDto) {
    const company = await CompanyReadRepository.getCompanyById(id);
    if (!company) return null;
    const result = await CompanyWriteRepository.updateCompany(id, payload);
    return { company, result };
  }

  static async deleteCompany(id: number) {
    const company = await CompanyReadRepository.getCompanyById(id);
    if (!company) return null;
    const result = await CompanyWriteRepository.deleteCompany(id);
    return { company, result };
  }
}