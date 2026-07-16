import { isNotNull, isNull } from "drizzle-orm";
import { db, menus, role_permissions, roles, users } from "./index";
import { hash } from "bcryptjs";

const roleSeedData = [
  { code: "ADMIN", name: "Administrator" },
  { code: "USER", name: "User" },
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
  await db.delete(role_permissions);
  await db.delete(menus).where(isNotNull(menus.parent_id));
  await db.delete(menus).where(isNull(menus.parent_id));
  await db.delete(users);
  await db.delete(roles);
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
    const adminPassword = await hash("password123", 10);
    const userPassword = await hash("password123", 10);

    await db.insert(users).values([
      {
        username: "admin_user",
        email: "admin@example.com",
        password: adminPassword,
        name: "Admin User",
        role_id: insertedRoles[0].id,
      },
      {
        username: "regular_user",
        email: "user@example.com",
        password: userPassword,
        name: "Regular User",
        role_id: insertedRoles[1].id,
      },
    ]);

    console.log("Seeding parent menus...");
    const parentMenus = menuSeedData.filter((menu) => menu.parentName === null);
    const insertedParentMenus = await db
      .insert(menus)
      .values(
        parentMenus.map((menu) => ({
          name: menu.name,
          path: menu.path!,
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
          path: menu.path,
          permission_path: menu.permissionPath,
          icon: menu.icon,
          is_visible: (menu as any).isVisible ?? true,
          parent_id: parentMenuIdByName.get(menu.parentName as string) ?? null,
        })),
      )
      .$returningId();

    const allInsertedMenuIds = [
      ...insertedParentMenus,
      ...insertedChildMenus,
    ].map((menu) => menu.id);

    console.log("Seeding role permissions...");
    await db.insert(role_permissions).values(
      allInsertedMenuIds.map((menuId) => ({
        role_id: insertedRoles[0].id,
        menu_id: menuId,
        can_read: true,
        can_create: true,
        can_update: true,
        can_delete: true,
        can_report: true,
      })),
    );

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
