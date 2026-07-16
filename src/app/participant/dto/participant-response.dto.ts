import { ParticipantEntity } from "../contract/participant.contract";

export class ParticipantResponseDto {
  id: number;
  user_id: number;
  company_id: number | null;
  name: string;
  email: string;
  nik: string | null;
  birth_place: string | null;
  birth_date: string | null;
  job_title: string | null;
  department: string | null;
  phone_number: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(participant: ParticipantEntity) {
    this.id = participant.id;
    this.user_id = participant.user_id;
    this.company_id = participant.company_id;
    this.name = participant.name;
    this.email = participant.email;
    this.nik = participant.nik;
    this.birth_place = participant.birth_place;
    // Handle date formatting
    if (participant.birth_date) {
        this.birth_date = new Date(participant.birth_date).toISOString().split('T')[0];
    } else {
        this.birth_date = null;
    }
    this.job_title = participant.job_title;
    this.department = participant.department;
    this.phone_number = participant.phone_number;
    this.is_active = participant.is_active;
    this.created_at = participant.created_at;
    this.updated_at = participant.updated_at;
  }
}
