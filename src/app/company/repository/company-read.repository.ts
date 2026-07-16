import { db } from "../../../db";
import { companies } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { CompanyEntity } from "../contract/company.contract";

export class CompanyReadRepository {
  static async getAllCompanies(): Promise<CompanyEntity[]> {
    return db.select().from(companies);
  }

  static async getCompanyById(id: number): Promise<CompanyEntity | null> {
    const result = await db.select().from(companies).where(eq(companies.id, id));
    return result[0] || null;
  }
}