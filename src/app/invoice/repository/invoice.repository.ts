import { db } from "../../../db";
import { invoices } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateInvoiceDto, UpdateInvoiceDto } from "../dto/invoice.dto";

export class InvoiceRepository {
  static async findAll() {
    return await db.select().from(invoices);
  }

  static async findById(id: number) {
    const result = await db.select().from(invoices).where(eq(invoices.id, id));
    return result[0];
  }

  static async create(data: CreateInvoiceDto) {
    const [result] = await db.insert(invoices).values(data as any).$returningId();
    return result;
  }

  static async update(id: number, data: UpdateInvoiceDto) {
    await db.update(invoices).set(data as any).where(eq(invoices.id, id));
    return this.findById(id);
  }

  static async delete(id: number) {
    await db.delete(invoices).where(eq(invoices.id, id));
    return { success: true };
  }
}
