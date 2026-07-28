import { isNotNull, isNull, sql } from "drizzle-orm";
import { db, menus, role_permissions, roles, users, instructor_profiles, participant_profiles, class_instructors, class_participants, courses, classes } from "./index";
import { hash } from "bcryptjs";

const roleSeedData = [
  { code: "SUPER_ADMIN", name: "Super Admin (Internal)" },
  { code: "HRD", name: "Klien Korporat (HRD)" },
  { code: "INSTRUCTOR", name: "Instruktur/Pemateri" },
  { code: "PARTICIPANT", name: "Peserta (Karyawan)" },
];

const menuSeedData = [
  // 1. Dashboard
  {
    name: "Dashboard",
    path: "/dashboard",
    permissionPath: null,
    icon: "LayoutDashboard",
    parentName: null,
  },
  // 2. User Management
  {
    name: "User Management",
    path: null,
    permissionPath: null,
    icon: "Users",
    parentName: null,
  },
  {
    name: "Klien Korporat",
    path: "/users/companies",
    permissionPath: "/api/companies",
    icon: "Building2",
    parentName: "User Management",
  },
  {
    name: "Instruktur",
    path: "/users/instructors",
    permissionPath: "/api/instructors",
    icon: "GraduationCap",
    parentName: "User Management",
  },
  {
    name: "Peserta",
    path: "/users/participants",
    permissionPath: "/api/participants",
    icon: "User",
    parentName: "User Management",
  },
  // 3. Diklat Management
  {
    name: "Diklat Management",
    path: null,
    permissionPath: null,
    icon: "BookOpen",
    parentName: null,
  },
  {
    name: "Program Diklat",
    path: "/diklat/courses",
    permissionPath: "/api/courses",
    icon: "Library",
    parentName: "Diklat Management",
  },
  {
    name: "Manajemen Kelas",
    path: "/diklat/classes",
    permissionPath: "/api/classes",
    icon: "MonitorPlay",
    parentName: "Diklat Management",
  },
  {
    name: "Kurikulum",
    path: "/diklat/curriculum",
    permissionPath: "/api/modules",
    icon: "BookMarked",
    parentName: "Diklat Management",
  },
  // 4. LMS Studio
  {
    name: "LMS Studio",
    path: null,
    permissionPath: null,
    icon: "Video",
    parentName: null,
  },
  {
    name: "Manajemen Modul",
    path: "/lms/modules",
    permissionPath: "/api/modules",
    icon: "FolderTree",
    parentName: "LMS Studio",
  },
  {
    name: "Materi Digital",
    path: "/lms/materials",
    permissionPath: "/api/materials",
    icon: "FileVideo",
    parentName: "LMS Studio",
  },
  {
    name: "Bank Soal & Kuis",
    path: "/lms/quizzes",
    permissionPath: "/api/quizzes",
    icon: "FileQuestion",
    parentName: "LMS Studio",
  },
  // 5. Logistik & Operasional
  {
    name: "Logistik & Operasional",
    path: null,
    permissionPath: null,
    icon: "MapPin",
    parentName: null,
  },
  {
    name: "Jadwal Sesi",
    path: "/logistics/sessions",
    permissionPath: "/api/sessions",
    icon: "CalendarDays",
    parentName: "Logistik & Operasional",
  },
  {
    name: "Data Kehadiran",
    path: "/logistics/attendances",
    permissionPath: "/api/attendances",
    icon: "UserCheck",
    parentName: "Logistik & Operasional",
  },
  {
    name: "Manajemen Fasilitas",
    path: "/logistics/facilities",
    permissionPath: "/api/logistics",
    icon: "Building",
    parentName: "Logistik & Operasional",
  },
  // 6. Keuangan (Billing)
  {
    name: "Keuangan",
    path: null,
    permissionPath: null,
    icon: "Receipt",
    parentName: null,
  },
  {
    name: "Manajemen Invoice",
    path: "/finance/invoices",
    permissionPath: "/api/invoices",
    icon: "Banknote",
    parentName: "Keuangan",
  },
  // 7. Sertifikasi & Evaluasi
  {
    name: "Sertifikasi & Evaluasi",
    path: null,
    permissionPath: null,
    icon: "Award",
    parentName: null,
  },
  {
    name: "Testimoni & Ulasan",
    path: "/qc/evaluations",
    permissionPath: "/api/evaluations",
    icon: "Star",
    parentName: "Sertifikasi & Evaluasi",
  },
  {
    name: "Penerbitan Sertifikat",
    path: "/qc/certificates",
    permissionPath: "/api/certificates",
    icon: "ScrollText",
    parentName: "Sertifikasi & Evaluasi",
  },
  // 8. Master Data (RBAC Asli)
  {
    name: "Master Data",
    path: null,
    permissionPath: null,
    icon: "Database",
    parentName: null,
  },
  {
    name: "Role",
    path: "/master-data/roles",
    permissionPath: "/api/roles",
    icon: "Shield",
    parentName: "Master Data",
  },
  {
    name: "User",
    path: "/master-data/users",
    permissionPath: "/api/users",
    icon: "UsersRound",
    parentName: "Master Data",
  },
  // 9. Web Management (RBAC Asli)
  {
    name: "Web Management",
    path: null,
    permissionPath: null,
    icon: "Settings",
    parentName: null,
  },
  {
    name: "Menu",
    path: "/web-management/menus",
    permissionPath: "/api/menus",
    icon: "MenuSquare",
    parentName: "Web Management",
  },
  {
    name: "Role Permission",
    path: "/web-management/role-permissions",
    permissionPath: "/api/role-permissions",
    icon: "ShieldCheck",
    parentName: "Web Management",
  }
];

async function clearAllTables() {
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);
  
  await db.delete(role_permissions);
  await db.delete(menus);
  await db.delete(instructor_profiles);
  await db.delete(participant_profiles);
  await db.delete(class_instructors);
  await db.delete(class_participants);
  await db.delete(classes);
  await db.delete(courses);
  
  await db.delete(users);
  await db.delete(roles);
  
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
}

async function seed() {
  try {
    console.log("Starting database seeding...");

    await clearAllTables();

    console.log("Seeding roles...");
    const insertedRoles = await db
      .insert(roles)
      .values(roleSeedData)
      .$returningId();

    console.log("Seeding users...");
    const defaultPassword = await hash("password123", 10);

    const insertedUsers = await db.insert(users).values([
      {
        username: "superadmin",
        email: "superadmin@example.com",
        password: defaultPassword,
        name: "Super Admin",
        role_id: insertedRoles[0].id,
      },
      {
        username: "hrd_user",
        email: "hrd@example.com",
        password: defaultPassword,
        name: "HRD Korporat",
        role_id: insertedRoles[1].id,
      },
      {
        username: "instruktur1",
        email: "instruktur@example.com",
        password: defaultPassword,
        name: "Instruktur",
        role_id: insertedRoles[2].id,
      },
      {
        username: "peserta1",
        email: "peserta@example.com",
        password: defaultPassword,
        name: "Peserta",
        role_id: insertedRoles[3].id,
      },
    ]).$returningId();

    console.log("Seeding profiles...");
    await db.insert(instructor_profiles).values({
      user_id: insertedUsers[2].id,
      expertise: "Umum",
    });

    await db.insert(participant_profiles).values({
      user_id: insertedUsers[3].id,
      nik: "1234567890",
    });

    console.log("Seeding parent menus...");
    const parentMenus = menuSeedData.filter((menu) => menu.parentName === null);
    const insertedParentMenus = await db
      .insert(menus)
      .values(
        parentMenus.map((menu) => ({
          name: menu.name,
          path: menu.path || "",
          permission_path: menu.permissionPath,
          icon: menu.icon,
          is_visible: (menu as any).isVisible ?? true,
          parent_id: null,
        })),
      )
      .$returningId();

    const parentMenuIdByName = new Map<string, number>();
    parentMenus.forEach((menu, index) => {
      parentMenuIdByName.set(menu.name, insertedParentMenus[index].id);
    });

    console.log("Seeding child menus...");
    const childMenus = menuSeedData.filter((menu) => menu.parentName !== null);
    const insertedChildMenus = await db
      .insert(menus)
      .values(
        childMenus.map((menu) => ({
          name: menu.name,
          path: menu.path || "",
          permission_path: menu.permissionPath,
          icon: menu.icon,
          is_visible: (menu as any).isVisible ?? true,
          parent_id: parentMenuIdByName.get(menu.parentName as string) ?? null,
        })),
      )
      .$returningId();

    const allInsertedMenus = [
      ...parentMenus.map((menu, i) => ({ ...menu, id: insertedParentMenus[i].id })),
      ...childMenus.map((menu, i) => ({ ...menu, id: insertedChildMenus[i].id })),
    ];

    console.log("Seeding role permissions...");
    const permissionsToInsert: any[] = [];

    allInsertedMenus.forEach((menu) => {
      // Super Admin (Access All)
      permissionsToInsert.push({
        role_id: insertedRoles[0].id,
        menu_id: menu.id,
        can_read: true,
        can_create: true,
        can_update: true,
        can_delete: true,
        can_report: true,
      });

      // HRD (Klien Korporat)
      if (
        menu.name === "Dashboard" ||
        menu.name === "User Management" ||
        menu.name === "Peserta" ||
        menu.name === "Diklat Management" ||
        menu.name === "Manajemen Kelas" ||
        menu.name === "Logistik & Operasional" ||
        menu.name === "Data Kehadiran" ||
        menu.name === "Keuangan" ||
        menu.name === "Manajemen Invoice" ||
        menu.name === "Sertifikasi & Evaluasi" ||
        menu.name === "Penerbitan Sertifikat"
      ) {
        permissionsToInsert.push({
          role_id: insertedRoles[1].id,
          menu_id: menu.id,
          can_read: true,
          can_create: menu.name === "Peserta",
          can_update: menu.name === "Peserta" || menu.name === "Manajemen Kelas",
          can_delete: false,
          can_report: true,
        });
      }

      // Instructor
      if (
        menu.name === "Dashboard" ||
        menu.name === "LMS Studio" ||
        menu.name === "Manajemen Modul" ||
        menu.name === "Materi Digital" ||
        menu.name === "Bank Soal & Kuis" ||
        menu.name === "Logistik & Operasional" ||
        menu.name === "Jadwal Sesi" ||
        menu.name === "Data Kehadiran" ||
        menu.name === "Sertifikasi & Evaluasi" ||
        menu.name === "Testimoni & Ulasan"
      ) {
        permissionsToInsert.push({
          role_id: insertedRoles[2].id,
          menu_id: menu.id,
          can_read: true,
          can_create: ["Materi Digital", "Bank Soal & Kuis"].includes(menu.name),
          can_update: ["Materi Digital", "Bank Soal & Kuis"].includes(menu.name),
          can_delete: false,
          can_report: true,
        });
      }

      // Participant (Tidak ada akses sidebar admin - hanya view LMS front-end,
      // sehingga tidak di-seed permissions admin panel-nya).
    });

    await db.insert(role_permissions).values(permissionsToInsert);

    console.log("Seeding courses...");
    const insertedCourses = await db.insert(courses).values([
      {
        title: "Pelatihan Persiapan Pensiun / Pra-Pensiun",
        description: "Pelatihan Masa Persiapan Pensiun bertujuan membantu pegawai (PNS/Swasta) menghadapi masa purna tugas secara optimal agar tetap sejahtera, mandiri, dan bermakna.",
        competencies: "Manajemen Keuangan, Kewirausahaan UMKM, Pengelolaan Stress, Pola Hidup Sehat Lansia",
        is_active: true,
      },
      {
        title: "Pelatihan Peningkatan Kapasitas Aparatur Desa",
        description: "Peningkatan kapasitas aparatur desa yang mencakup pengembangan sumber daya manusia, penguatan organisasi, dan reformasi institusi agar tata kelola administrasi dan pelayanan publik berjalan dengan baik.",
        competencies: "RPJM/RKP Desa, Tata Kelola Desa, Kepemimpinan SOTK, SISKEUDES & SIPADES, Manajemen Keuangan & Aset Desa",
        is_active: true,
      },
    ]).$returningId();

    console.log("Seeding classes...");
    await db.insert(classes).values([
      {
        course_id: insertedCourses[0].id,
        batch_name: "Angkatan 1 - Persiapan Pensiun 2026",
        method: "hybrid",
        price: "5500000.00",
      },
      {
        course_id: insertedCourses[1].id,
        batch_name: "Angkatan 1 - Peningkatan Kapasitas Aparatur Desa 2026",
        method: "offline",
        price: "5500000.00",
      },
    ]);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
