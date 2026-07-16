import { CreateClassRequestDto, UpdateClassRequestDto } from "../dto/class-request.dto";
import { ClassResponseDto } from "../dto/class-response.dto";

export interface ClassEntity {
  id: number;
  course_id: number;
  batch_name: string;
  method: "lms" | "online" | "offline" | "hybrid";
  start_date: Date | null;
  end_date: Date | null;
  price: number | null;
  created_at: Date;
  updated_at: Date;
  course_title?: string; // Optional relation data
}

export interface IClassService {
  create(data: CreateClassRequestDto): Promise<ClassResponseDto>;
  update(id: number, data: UpdateClassRequestDto): Promise<ClassResponseDto>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<ClassResponseDto | null>;
  findAll(): Promise<ClassResponseDto[]>;
}
