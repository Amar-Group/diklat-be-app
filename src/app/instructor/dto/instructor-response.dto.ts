import { InstructorEntity } from "../contract/instructor.contract";

export class InstructorResponseDto {
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

  constructor(instructor: InstructorEntity) {
    this.id = instructor.id;
    this.user_id = instructor.user_id;
    this.name = instructor.name;
    this.email = instructor.email;
    this.bio = instructor.bio;
    this.expertise = instructor.expertise;
    this.cv_url = instructor.cv_url;
    this.is_active = instructor.is_active;
    this.created_at = instructor.created_at;
    this.updated_at = instructor.updated_at;
  }
}
