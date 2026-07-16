export interface CompanyEntity {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  status: "active" | "inactive";
  created_at: Date;
  updated_at: Date;
}