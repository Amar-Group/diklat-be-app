import { db } from "./connection";
import { menus, roles, role_permissions } from "./schema";
import { eq, and } from "drizzle-orm";

/**
 * Idempotent system initialization function.
 * Safe to run on every server startup — only adds missing system menus or records
 * without touching, deleting, or overwriting existing real data.
 */
export async function initSystemData() {
  try {
    // 1. Ensure 'Diklat Management' menu exists
    const diklatParents = await db.select().from(menus).where(eq(menus.name, "Diklat Management"));
    if (diklatParents.length === 0) return;

    const parentId = diklatParents[0].id;

    // 2. Ensure 'Kurikulum' menu exists under 'Diklat Management'
    const existingKurikulum = await db.select().from(menus).where(
      and(
        eq(menus.name, "Kurikulum"),
        eq(menus.parent_id, parentId)
      )
    );

    let menuId: number;
    if (existingKurikulum.length > 0) {
      menuId = existingKurikulum[0].id;
    } else {
      const [inserted] = await db.insert(menus).values({
        name: "Kurikulum",
        path: "/diklat/curriculum",
        permission_path: "/api/modules",
        icon: "BookMarked",
        is_visible: true,
        parent_id: parentId,
      }).$returningId();
      menuId = inserted.id;
      console.log(`[Auto-Init] Inserted 'Kurikulum' menu (ID: ${menuId})`);
    }

    // 3. Ensure permissions exist for all roles
    const allRoles = await db.select().from(roles);
    for (const r of allRoles) {
      const existingPerm = await db.select().from(role_permissions).where(
        and(
          eq(role_permissions.role_id, r.id),
          eq(role_permissions.menu_id, menuId)
        )
      );

      if (existingPerm.length === 0) {
        await db.insert(role_permissions).values({
          role_id: r.id,
          menu_id: menuId,
          can_read: true,
          can_create: r.code === "SUPER_ADMIN" || r.code === "INSTRUCTOR",
          can_update: r.code === "SUPER_ADMIN" || r.code === "INSTRUCTOR",
          can_delete: r.code === "SUPER_ADMIN",
          can_report: true,
        });
        console.log(`[Auto-Init] Granted 'Kurikulum' menu permissions to ${r.code}`);
      }
    }
  } catch (err) {
    console.error("[Auto-Init Error] Failed to initialize system data:", err);
  }
}
