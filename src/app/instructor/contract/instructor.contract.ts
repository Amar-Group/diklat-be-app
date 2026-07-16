import { CreateInstructorRequestDto, UpdateInstructorRequestDto } from "../dto/instructor-request.dto";
import { InstructorResponseDto } from "../dto/instructor-response.dto";

export interface InstructorEntity {
  id: number;
  user_id: number;
  name: string;
  email: string;
  bio: string | null;
  expertise: string | null;
  cv_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IInstructorService {
  create(data: CreateInstructorRequestDto): Promise<InstructorResponseDto>;
  update(id: number, data: UpdateInstructorRequestDto): Promise<InstructorResponseDto>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<InstructorResponseDto | null>;
  findAll(): Promise<InstructorResponseDto[]>;
}
