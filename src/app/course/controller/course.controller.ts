import { Context } from "hono";
import {
  CreateCourseRequestDto,
  UpdateCourseRequestDto,
} from "../dto/course-request.dto";
import { CourseService } from "../service/course.service";

export class CourseController {
  static async getAll(c: Context) {
    const courses = await CourseService.getAllCourses();

    return c.json({
      success: true,
      data: courses,
      message: "Courses fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const course = await CourseService.getCourseById(id);

    if (!course) {
      return c.json({ success: false, message: "Course not found" }, 404);
    }

    return c.json({
      success: true,
      data: course,
      message: "Course fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateCourseRequestDto = await c.req.json();
    const createResult = await CourseService.createCourse(body);

    return c.json(
      {
        success: true,
        data: createResult.result,
        message: "Course created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateCourseRequestDto = await c.req.json();
    const updateResult = await CourseService.updateCourse(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Course not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Course updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await CourseService.deleteCourse(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Course not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Course deleted successfully",
    });
  }
}
