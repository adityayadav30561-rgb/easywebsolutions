"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { form, safe, zOptText, zText } from "@/lib/actions";
import { audit, authorize, clientScope, projectScope } from "@/lib/context";
import { must } from "@/lib/guard";
import { assertStaff } from "@/lib/lookups";
import { nextNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: zText(160),
  description: zOptText(5000),
  clientId: z.string().min(1, "Choose a client"),
  statusId: z.string().min(1, "Choose a status"),
  managerId: z.string().nullable(),
  startDate: z.date().nullable(),
  dueDate: z.date().nullable(),
  budget: z.number().min(0).max(100_000_000).nullable(),
  progress: z.number().int().min(0).max(100),
  visibleToClient: z.boolean(),
});

export const saveProject = safe(async (id: string | null, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("projects:write");
  const f = form(fd);
  const data = schema.parse({
    name: f.str("name"),
    description: f.opt("description"),
    clientId: f.str("clientId"),
    statusId: f.str("statusId"),
    managerId: f.opt("managerId"),
    startDate: f.date("startDate"),
    dueDate: f.date("dueDate"),
    budget: f.num("budget"),
    progress: f.num("progress") ?? 0,
    visibleToClient: f.bool("visibleToClient"),
  });
  must(await ctx.db.client.findFirst({ where: { id: data.clientId, ...clientScope(ctx) } }), "Client");
  must(await ctx.db.projectStatus.findUnique({ where: { id: data.statusId } }), "Status");
  await assertStaff(ctx, data.managerId);

  if (id) {
    must(await ctx.db.project.findFirst({ where: { id, ...projectScope(ctx) } }), "Project");
    await ctx.db.project.update({ where: { id }, data });
    await audit(ctx, "update", "project", id, `Updated project "${data.name}"`);
    refresh();
    return { ok: "Saved" };
  }
  const project = await ctx.db.project.create({
    data: { organizationId: ctx.orgId, number: await nextNumber(prisma, ctx.orgId, "PROJECT"), ...data, managerId: data.managerId ?? ctx.userId },
  });
  await prisma.projectMember.create({ data: { projectId: project.id, userId: project.managerId ?? ctx.userId } });
  await audit(ctx, "create", "project", project.id, `Created project ${project.number} "${project.name}"`);
  redirect(`/app/projects/${project.id}`);
});

export const deleteProject = safe(async (id: string) => {
  const ctx = await authorize("projects:delete");
  const p = must(await ctx.db.project.findUnique({ where: { id } }), "Project");
  await ctx.db.activity.deleteMany({ where: { entityType: "PROJECT", entityId: id } });
  await ctx.db.project.delete({ where: { id } });
  await audit(ctx, "delete", "project", id, `Deleted project ${p.number}`);
  redirect("/app/projects");
});

async function ownProject(id: string, perm: "projects:write" | "tasks:write") {
  const ctx = await authorize(perm);
  const project = must(await ctx.db.project.findFirst({ where: { id, ...projectScope(ctx) } }), "Project");
  return { ctx, project };
}

export const addMember = safe(async (projectId: string, _prev: unknown, fd: FormData) => {
  const { ctx } = await ownProject(projectId, "projects:write");
  const userId = must(await assertStaff(ctx, String(fd.get("userId") ?? "") || null), "Team member");
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId, userId } }, update: {}, create: { projectId, userId } });
  refresh();
});

export const removeMember = safe(async (projectId: string, userId: string) => {
  await ownProject(projectId, "projects:write");
  await prisma.projectMember.deleteMany({ where: { projectId, userId } });
  refresh();
});

const taskSchema = z.object({
  title: zText(200),
  assigneeId: z.string().nullable(),
  dueDate: z.date().nullable(),
  visibleToClient: z.boolean(),
});

export const addTask = safe(async (projectId: string, _prev: unknown, fd: FormData) => {
  const { ctx } = await ownProject(projectId, "tasks:write");
  const f = form(fd);
  const data = taskSchema.parse({ title: f.str("title"), assigneeId: f.opt("assigneeId"), dueDate: f.date("dueDate"), visibleToClient: f.bool("visibleToClient") });
  await assertStaff(ctx, data.assigneeId);
  const last = await ctx.db.task.findFirst({ where: { projectId }, orderBy: { sort: "desc" } });
  await ctx.db.task.create({ data: { organizationId: ctx.orgId, projectId, ...data, sort: (last?.sort ?? 0) + 1 } });
  await syncProgress(ctx.db, projectId);
  refresh();
  return { ok: "Task added" };
});

export const setTaskStatus = safe(async (taskId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("tasks:write");
  const task = must(await ctx.db.task.findUnique({ where: { id: taskId } }), "Task");
  must(await ctx.db.project.findFirst({ where: { id: task.projectId, ...projectScope(ctx) } }), "Project");
  const status = z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).parse(fd.get("status"));
  await ctx.db.task.update({ where: { id: taskId }, data: { status } });
  await syncProgress(ctx.db, task.projectId);
  refresh();
});

export const deleteTask = safe(async (taskId: string) => {
  const ctx = await authorize("tasks:write");
  const task = must(await ctx.db.task.findUnique({ where: { id: taskId } }), "Task");
  must(await ctx.db.project.findFirst({ where: { id: task.projectId, ...projectScope(ctx) } }), "Project");
  await ctx.db.task.delete({ where: { id: taskId } });
  await syncProgress(ctx.db, task.projectId);
  refresh();
});

/** Progress follows the share of finished tasks once a project has tasks. */
async function syncProgress(db: Awaited<ReturnType<typeof authorize>>["db"], projectId: string) {
  const [total, done] = await Promise.all([db.task.count({ where: { projectId } }), db.task.count({ where: { projectId, status: "DONE" } })]);
  if (total > 0) await db.project.update({ where: { id: projectId }, data: { progress: Math.round((done / total) * 100) } });
}
