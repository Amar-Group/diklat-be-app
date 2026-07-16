import { ClassEntity } from "../contract/class.contract";

export class ClassResponseDto {
  id: number;
  course_id: number;
  batch_name: string;
  method: string;
  start_date: string | null;
  end_date: string | null;
  price: number | null;
  created_at: Date;
  updated_at: Date;
  course_title?: string;

  constructor(cls: ClassEntity) {
    this.id = cls.id;
    this.course_id = cls.course_id;
    this.batch_name = cls.batch_name;
    this.method = cls.method;
    this.start_date = cls.start_date ? new Date(cls.start_date).toISOString().split('T')[0] : null;
    this.end_date = cls.end_date ? new Date(cls.end_date).toISOString().split('T')[0] : null;
    this.price = cls.price ? Number(cls.price) : null;
    this.created_at = cls.created_at;
    this.updated_at = cls.updated_at;
    this.course_title = cls.course_title;
  }
}
