import {
  CreateCourseRequestDto,
  UpdateCourseRequestDto,
} from "../dto/course-request.dto";
import { CourseResponseDto } from "../dto/course-response.dto";
import { CourseReadRepository } from "../repository/course-read.repository";
import { CourseWriteRepository } from "../repository/course-write.repository";

export class CourseService {
  static async getAllCourses(): Promise<CourseResponseDto[]> {
    return CourseReadRepository.getAllCourses();
  }

  static async getCourseById(id: number): Promise<CourseResponseDto | null> {
    return CourseReadRepository.getCourseById(id);
  }

  static async createCourse(payload: CreateCourseRequestDto) {
    const result = await CourseWriteRepository.createCourse(payload);
    return { conflict: false as const, result };
  }

  static async updateCourse(id: number, payload: UpdateCourseRequestDto) {
    const course = await CourseReadRepository.getCourseById(id);
    if (!course) return null;
    const result = await CourseWriteRepository.updateCourse(id, payload);
    return { course, result };
  }

  static async deleteCourse(id: number) {
    const course = await CourseReadRepository.getCourseById(id);
    if (!course) return null;
    const result = await CourseWriteRepository.deleteCourse(id);
    return { course, result };
  }
}