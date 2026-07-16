import { CreateParticipantRequestDto, UpdateParticipantRequestDto } from "../dto/participant-request.dto";
import { ParticipantResponseDto } from "../dto/participant-response.dto";

export interface ParticipantEntity {
  id: number;
  user_id: number;
  company_id: number | null;
  name: string;
  email: string;
  nik: string | null;
  birth_place: string | null;
  birth_date: Date | null;
  job_title: string | null;
  department: string | null;
  phone_number: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IParticipantService {
  create(data: CreateParticipantRequestDto): Promise<ParticipantResponseDto>;
  update(id: number, data: UpdateParticipantRequestDto): Promise<ParticipantResponseDto>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<ParticipantResponseDto | null>;
  findAll(): Promise<ParticipantResponseDto[]>;
}
