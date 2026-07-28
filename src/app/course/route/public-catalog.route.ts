import { Hono } from "hono";
import { CourseReadRepository } from "../repository/course-read.repository";
import { appTokenMiddleware } from "../../../middleware/appToken";

/**
 * Public catalog router — no JWT needed, only X-App-Token
 * Digunakan oleh landing page untuk menampilkan daftar program diklat
 */
export const publicCatalogRouter = new Hono();

publicCatalogRouter.use("*", appTokenMiddleware);

publicCatalogRouter.get("/catalog", async (c) => {
  try {
    const data = await CourseReadRepository.getPublicCatalog();
    return c.json({
      success: true,
      data,
      message: "Katalog program berhasil diambil",
    });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
