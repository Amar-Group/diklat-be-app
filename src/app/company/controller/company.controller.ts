import { Context } from "hono";
import {
  CreateCompanyRequestDto,
  UpdateCompanyRequestDto,
} from "../dto/company-request.dto";
import { CompanyService } from "../service/company.service";

export class CompanyController {
  static async getAll(c: Context) {
    const companies = await CompanyService.getAllCompanies();

    return c.json({
      success: true,
      data: companies,
      message: "Companies fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const company = await CompanyService.getCompanyById(id);

    if (!company) {
      return c.json({ success: false, message: "Company not found" }, 404);
    }

    return c.json({
      success: true,
      data: company,
      message: "Company fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateCompanyRequestDto = await c.req.json();
    const createResult = await CompanyService.createCompany(body);

    return c.json(
      {
        success: true,
        data: createResult.result,
        message: "Company created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateCompanyRequestDto = await c.req.json();
    const updateResult = await CompanyService.updateCompany(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Company not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Company updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await CompanyService.deleteCompany(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Company not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Company deleted successfully",
    });
  }
}
