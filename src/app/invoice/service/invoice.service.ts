import { InvoiceRepository } from "../repository/invoice.repository";
import type { CreateInvoiceDto, UpdateInvoiceDto } from "../dto/invoice.dto";
import { createInvoiceSchema, updateInvoiceSchema } from "../dto/invoice.dto";

export class InvoiceService {
  static async getAllInvoices() {
    return await InvoiceRepository.findAll();
  }

  static async getInvoiceById(id: number) {
    const data = await InvoiceRepository.findById(id);
    if (!data) throw new Error("Invoice not found");
    return data;
  }

  static async createInvoice(data: CreateInvoiceDto) {
    const validatedData = createInvoiceSchema.parse(data);
    return await InvoiceRepository.create(validatedData);
  }

  static async updateInvoice(id: number, data: UpdateInvoiceDto) {
    const validatedData = updateInvoiceSchema.parse(data);
    return await InvoiceRepository.update(id, validatedData);
  }

  static async deleteInvoice(id: number) {
    return await InvoiceRepository.delete(id);
  }
}
