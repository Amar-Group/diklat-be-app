export interface CourseEntity {
  id: number;
  title: string;
  description: string | null;
  competencies: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}