import { db } from "../../../db";
import { companies } from "../../../db/schema";
import { eq } from "drizzle-orm";
import {
  CreateCompanyRequestDto,
  UpdateCompanyRequestDto,
} from "../dto/company-request.dto";

export class CompanyWriteRepository {
  static async createCompany(payload: CreateCompanyRequestDto) {
    const result = await db.insert(companies).values(payload).$returningId();
    return { insertId: result[0].id, affectedRows: 1 };
  }

  static async updateCompany(id: number, payload: UpdateCompanyRequestDto) {
    const [result] = await db
      .update(companies)
      .set({ ...payload, updated_at: new Date() })
      .where(eq(companies.id, id));
    return { insertId: 0, affectedRows: result.affectedRows };
  }

  static async deleteCompany(id: number) {
    const [result] = await db.delete(companies).where(eq(companies.id, id));
    return { insertId: 0, affectedRows: result.affectedRows };
  }
}