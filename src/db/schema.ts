import {
  int,
  varchar,
  datetime,
  boolean,
  mysqlTable,
  foreignKey,
  text,
  decimal,
  date,
  mysqlEnum,
  json,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql/sql";

// ==========================================
// 1. RBAC & CORE AUTHENTICATION
// ==========================================
export const menus = mysqlTable(
  "menus",
  {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 100 }).notNull(),
    path: varchar({ length: 255 }),
    permission_path: varchar({ length: 255 }),
    icon: varchar({ length: 255 }),
    is_visible: boolean().default(false),
    parent_id: int(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    parent_fk: foreignKey({
      columns: [table.parent_id],
      foreignColumns: [table.id],
    }),
  })
);

export const roles = mysqlTable("roles", {
  id: int().primaryKey().autoincrement(),
  code: varchar({ length: 50 }).notNull().unique(), // e.g. super_admin, hrd, instructor, participant
  name: varchar({ length: 100 }).notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const role_permissions = mysqlTable(
  "role_permissions",
  {
    id: int().primaryKey().autoincrement(),
    role_id: int().notNull(),
    menu_id: int().notNull(),
    can_read: boolean().default(false),
    can_create: boolean().default(false),
    can_update: boolean().default(false),
    can_delete: boolean().default(false),
    can_report: boolean().default(false),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    role_fk: foreignKey({
      columns: [table.role_id],
      foreignColumns: [roles.id],
    }),
    menu_fk: foreignKey({
      columns: [table.menu_id],
      foreignColumns: [menus.id],
    }),
  })
);

// ==========================================
// 2. ORGANIZATION & USER PROFILES
// ==========================================
export const companies = mysqlTable("companies", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull(),
  address: text(),
  phone: varchar({ length: 20 }),
  email: varchar({ length: 100 }),
  status: mysqlEnum(['active', 'inactive']).default('active'),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const users = mysqlTable(
  "users",
  {
    id: int().primaryKey().autoincrement(),
    username: varchar({ length: 100 }).notNull().unique(),
    email: varchar({ length: 100 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    role_id: int().notNull(),
    company_id: int(), // Nullable (for individual participants/admins)
    is_active: boolean().default(true),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    role_fk: foreignKey({
      columns: [table.role_id],
      foreignColumns: [roles.id],
    }),
    company_fk: foreignKey({
      columns: [table.company_id],
      foreignColumns: [companies.id],
    }),
  })
);

export const instructor_profiles = mysqlTable("instructor_profiles", {
  id: int().primaryKey().autoincrement(),
  user_id: int().notNull().unique(),
  bio: text(),
  expertise: varchar({ length: 255 }),
  cv_url: varchar({ length: 255 }),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  user_fk: foreignKey({
    columns: [table.user_id],
    foreignColumns: [users.id],
  }),
}));

export const participant_profiles = mysqlTable("participant_profiles", {
  id: int().primaryKey().autoincrement(),
  user_id: int().notNull().unique(),
  nik: varchar({ length: 20 }), // e.g. for BNSP
  birth_place: varchar({ length: 100 }),
  birth_date: date(),
  job_title: varchar({ length: 100 }),
  department: varchar({ length: 100 }),
  phone_number: varchar({ length: 20 }),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  user_fk: foreignKey({
    columns: [table.user_id],
    foreignColumns: [users.id],
  }),
}));

// ==========================================
// 3. COURSE & CLASS MANAGEMENT
// ==========================================
export const courses = mysqlTable("courses", {
  id: int().primaryKey().autoincrement(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  competencies: text(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const classes = mysqlTable("classes", {
  id: int().primaryKey().autoincrement(),
  course_id: int().notNull(),
  batch_name: varchar({ length: 100 }).notNull(),
  method: mysqlEnum(['lms', 'online', 'offline', 'hybrid']).notNull(),
  start_date: date(),
  end_date: date(),
  price: decimal({ precision: 12, scale: 2 }),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  course_fk: foreignKey({
    columns: [table.course_id],
    foreignColumns: [courses.id],
  }),
}));

export const class_instructors = mysqlTable("class_instructors", {
  id: int().primaryKey().autoincrement(),
  class_id: int().notNull(),
  instructor_id: int().notNull(),
}, (table) => ({
  class_fk: foreignKey({
    columns: [table.class_id],
    foreignColumns: [classes.id],
  }),
  instructor_fk: foreignKey({
    columns: [table.instructor_id],
    foreignColumns: [users.id],
  }),
}));

export const class_participants = mysqlTable("class_participants", {
  id: int().primaryKey().autoincrement(),
  class_id: int().notNull(),
  participant_id: int().notNull(),
  status: mysqlEnum(['registered', 'ongoing', 'completed', 'dropped']).default('registered'),
}, (table) => ({
  class_fk: foreignKey({
    columns: [table.class_id],
    foreignColumns: [classes.id],
  }),
  participant_fk: foreignKey({
    columns: [table.participant_id],
    foreignColumns: [users.id],
  }),
}));

// ==========================================
// 4. LMS & LEARNING MATERIALS
// ==========================================
export const course_modules = mysqlTable("course_modules", {
  id: int().primaryKey().autoincrement(),
  course_id: int().notNull(),
  title: varchar({ length: 255 }).notNull(),
  order_sequence: int().notNull().default(0),
}, (table) => ({
  course_fk: foreignKey({
    columns: [table.course_id],
    foreignColumns: [courses.id],
  }),
}));

export const materials = mysqlTable("materials", {
  id: int().primaryKey().autoincrement(),
  module_id: int().notNull(),
  type: mysqlEnum(['video', 'document']).notNull(),
  title: varchar({ length: 255 }).notNull(),
  file_url: varchar({ length: 255 }).notNull(),
  duration_seconds: int().default(0),
  is_skippable: boolean().default(false),
}, (table) => ({
  module_fk: foreignKey({
    columns: [table.module_id],
    foreignColumns: [course_modules.id],
  }),
}));

export const supplementary_materials = mysqlTable("supplementary_materials", {
  id: int().primaryKey().autoincrement(),
  class_id: int().notNull(),
  instructor_id: int().notNull(),
  title: varchar({ length: 255 }).notNull(),
  file_url: varchar({ length: 255 }).notNull(),
}, (table) => ({
  class_fk: foreignKey({
    columns: [table.class_id],
    foreignColumns: [classes.id],
  }),
  instructor_fk: foreignKey({
    columns: [table.instructor_id],
    foreignColumns: [users.id],
  }),
}));

export const participant_progress = mysqlTable("participant_progress", {
  id: int().primaryKey().autoincrement(),
  participant_id: int().notNull(),
  material_id: int().notNull(),
  last_watched_second: int().default(0),
  is_completed: boolean().default(false),
}, (table) => ({
  participant_fk: foreignKey({
    columns: [table.participant_id],
    foreignColumns: [users.id],
  }),
  material_fk: foreignKey({
    columns: [table.material_id],
    foreignColumns: [materials.id],
  }),
}));

export const quizzes = mysqlTable("quizzes", {
  id: int().primaryKey().autoincrement(),
  module_id: int().notNull(),
  title: varchar({ length: 255 }).notNull(),
  passing_grade: int().notNull(),
}, (table) => ({
  module_fk: foreignKey({
    columns: [table.module_id],
    foreignColumns: [course_modules.id],
  }),
}));

export const questions = mysqlTable("questions", {
  id: int().primaryKey().autoincrement(),
  quiz_id: int().notNull(),
  question_text: text().notNull(),
  options: json(), // Stores array of options
  correct_answer: varchar({ length: 255 }).notNull(),
}, (table) => ({
  quiz_fk: foreignKey({
    columns: [table.quiz_id],
    foreignColumns: [quizzes.id],
  }),
}));

export const quiz_attempts = mysqlTable("quiz_attempts", {
  id: int().primaryKey().autoincrement(),
  participant_id: int().notNull(),
  quiz_id: int().notNull(),
  score: decimal({ precision: 5, scale: 2 }),
  is_passed: boolean().default(false),
}, (table) => ({
  participant_fk: foreignKey({
    columns: [table.participant_id],
    foreignColumns: [users.id],
  }),
  quiz_fk: foreignKey({
    columns: [table.quiz_id],
    foreignColumns: [quizzes.id],
  }),
}));

// ==========================================
// 5. SESSIONS, LOGISTICS & ATTENDANCE
// ==========================================
export const sessions = mysqlTable("sessions", {
  id: int().primaryKey().autoincrement(),
  class_id: int().notNull(),
  title: varchar({ length: 255 }).notNull(),
  type: mysqlEnum(['online', 'offline', 'field_trip']).notNull(),
  start_time: datetime().notNull(),
  end_time: datetime().notNull(),
  meeting_url: varchar({ length: 255 }),
  qr_token: varchar({ length: 100 }).unique(),
}, (table) => ({
  class_fk: foreignKey({
    columns: [table.class_id],
    foreignColumns: [classes.id],
  }),
}));

export const attendances = mysqlTable("attendances", {
  id: int().primaryKey().autoincrement(),
  session_id: int().notNull(),
  participant_id: int().notNull(),
  check_in_time: datetime().notNull(),
  method: mysqlEnum(['auto_zoom', 'qr_scan', 'manual']).notNull(),
}, (table) => ({
  session_fk: foreignKey({
    columns: [table.session_id],
    foreignColumns: [sessions.id],
  }),
  participant_fk: foreignKey({
    columns: [table.participant_id],
    foreignColumns: [users.id],
  }),
}));

export const class_logistics = mysqlTable("class_logistics", {
  id: int().primaryKey().autoincrement(),
  class_id: int().notNull(),
  hotel_name: varchar({ length: 255 }),
  hotel_address: varchar({ length: 255 }),
  map_url: varchar({ length: 255 }),
  food_schedule: json(),
  field_trip_destination: varchar({ length: 255 }),
  itinerary: json(),
}, (table) => ({
  class_fk: foreignKey({
    columns: [table.class_id],
    foreignColumns: [classes.id],
  }),
}));

// ==========================================
// 6. INVOICING & FINANCE
// ==========================================
export const invoices = mysqlTable("invoices", {
  id: int().primaryKey().autoincrement(),
  invoice_number: varchar({ length: 100 }).notNull().unique(),
  company_id: int(),
  user_id: int(), // for individual payments
  class_id: int().notNull(),
  total_amount: decimal({ precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum(['unpaid', 'pending_validation', 'paid']).default('unpaid'),
  payment_proof_url: varchar({ length: 255 }),
  due_date: date(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  company_fk: foreignKey({
    columns: [table.company_id],
    foreignColumns: [companies.id],
  }),
  user_fk: foreignKey({
    columns: [table.user_id],
    foreignColumns: [users.id],
  }),
  class_fk: foreignKey({
    columns: [table.class_id],
    foreignColumns: [classes.id],
  }),
}));

// ==========================================
// 7. EVALUATIONS & CERTIFICATION
// ==========================================
export const evaluations = mysqlTable("evaluations", {
  id: int().primaryKey().autoincrement(),
  participant_id: int().notNull(),
  class_id: int().notNull(),
  instructor_rating: int(), // e.g. 1-5
  material_rating: int(), // e.g. 1-5
  review_text: text(),
  is_approved_for_landing_page: boolean().default(false),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  participant_fk: foreignKey({
    columns: [table.participant_id],
    foreignColumns: [users.id],
  }),
  class_fk: foreignKey({
    columns: [table.class_id],
    foreignColumns: [classes.id],
  }),
}));

export const certificates = mysqlTable("certificates", {
  id: int().primaryKey().autoincrement(),
  participant_id: int().notNull(),
  class_id: int().notNull(),
  certificate_number: varchar({ length: 100 }).notNull().unique(),
  bnsp_code: varchar({ length: 100 }),
  file_url: varchar({ length: 255 }),
  issued_date: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  participant_fk: foreignKey({
    columns: [table.participant_id],
    foreignColumns: [users.id],
  }),
  class_fk: foreignKey({
    columns: [table.class_id],
    foreignColumns: [classes.id],
  }),
}));
