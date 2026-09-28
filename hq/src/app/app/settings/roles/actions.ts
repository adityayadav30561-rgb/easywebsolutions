"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { safe, zOptText, zText } from "@/lib/actions";
import { audit, authorize } from "@/lib/context";
import { must } from "@/lib/guard";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const allowedFor = (type: "STAFF" | "CLIENT") => new Set<string>(PERMISSIONS.filter((p) => ("portal" in p) === (type === "CLIENT")).map((p) => p.key));

export const createRole = safe(async (_prev: unknown, fd: FormData) => {
  const ctx = await authorize("team:manage");
  const data = z
    .object({ name: zText(60), description: zOptText(200), type: z.enum(["STAFF", "CLIENT"]), copyFrom: z.string().nullable() })
    .parse({ name: fd.get("name"), description: fd.get("description") || null, type: fd.get("type"), copyFrom: fd.get("copyFrom") || null });
  const source = data.copyFrom ? must(await ctx.db.role.findUnique({ where: { id: data.copyFrom }, include: { permissions: true } }), "Role") : null;
  const allowed = allowedFor(data.type);
  const role = await ctx.db.role.create({
    data: {
      organizationId: ctx.orgId,
      key: `${slugify(data.name) || "role"}-${Date.now().toString(36)}`,
      name: data.name,
      description: data.description,
      type: data.type,
      dataScope: source?.dataScope ?? (data.type === "CLIENT" ? "ASSIGNED" : "ALL"),
    },
  });
  if (source) {
    await prisma.rolePermission.createMany({ data: source.permissions.filter((p) => allowed.has(p.permissionKey)).map((p) => ({ roleId: role.id, permissionKey: p.permissionKey })) });
  }
  await audit(ctx, "create", "role", role.id, `Created role "${role.name}"`);
  redirect(`/app/settings/roles/${role.id}`);
});

export const saveRole = safe(async (id: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("team:manage");
  const role = must(await ctx.db.role.findUnique({ where: { id } }), "Role");
  if (role.key === "owner") return { error: "The Owner role always has full access and can't be changed." };
  const data = z
    .object({ name: zText(60), description: zOptText(200), dataScope: z.enum(["ALL", "ASSIGNED"]) })
    .parse({ name: fd.get("name"), description: fd.get("description") || null, dataScope: role.type === "CLIENT" ? "ASSIGNED" : fd.get("dataScope") });
  const allowed = allowedFor(role.type);
  const perms = [...new Set(fd.getAll("perm").map(String))].filter((k) => allowed.has(k));

  // Don't let someone remove their own ability to manage the team.
  if (ctx.role.id === id && !perms.includes("team:manage")) return { error: "You can't remove team management from your own role." };

  await ctx.db.role.update({ where: { id }, data });
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId: id } }),
    prisma.rolePermission.createMany({ data: perms.map((permissionKey) => ({ roleId: id, permissionKey })) }),
  ]);
  await audit(ctx, "update", "role", id, `Updated role "${data.name}" (${perms.length} permissions, ${data.dataScope.toLowerCase()} records)`);
  refresh();
  return { ok: "Saved" };
});

export const deleteRole = safe(async (id: string) => {
  const ctx = await authorize("team:manage");
  const role = must(await ctx.db.role.findUnique({ where: { id }, include: { _count: { select: { memberships: true } } } }), "Role");
  if (role.isSystem) return { error: "Built-in roles can't be deleted." };
  if (role._count.memberships) return { error: "Move everyone off this role first." };
  await ctx.db.role.delete({ where: { id } });
  await audit(ctx, "delete", "role", id, `Deleted role "${role.name}"`);
  redirect("/app/settings/roles");
});
