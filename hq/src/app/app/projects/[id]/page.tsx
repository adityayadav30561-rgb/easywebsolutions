import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButton, ActionForm, AutoSubmitSelect } from "@/components/forms";
import { Timeline } from "@/components/Timeline";
import { Avatar, Badge, Card, PageHeader, Progress, StatusBadge } from "@/components/ui";
import { projectScope, requireStaff } from "@/lib/context";
import { staffOptions, userNames } from "@/lib/lookups";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { addMember, addTask, deleteProject, deleteTask, removeMember, setTaskStatus } from "../actions";
import { ProjectForm } from "../ProjectForm";

export const metadata: Metadata = { title: "Project" };

const TASK_STATUSES = [
  ["TODO", "To do"],
  ["IN_PROGRESS", "In progress"],
  ["REVIEW", "Review"],
  ["DONE", "Done"],
] as const;

export default async function ProjectPage({ params }: PageProps<"/app/projects/[id]">) {
  const ctx = await requireStaff("projects:read");
  const { id } = await params;
  const project = await ctx.db.project.findFirst({
    where: { id, ...projectScope(ctx) },
    include: { client: true, status: true, tasks: { orderBy: [{ status: "asc" }, { sort: "asc" }] } },
  });
  if (!project) notFound();

  const [members, staff, tickets] = await Promise.all([
    prisma.projectMember.findMany({ where: { projectId: id } }),
    staffOptions(ctx),
    ctx.can("tickets:read") ? ctx.db.ticket.findMany({ where: { projectId: id }, include: { status: true }, orderBy: { createdAt: "desc" }, take: 20 }) : [],
  ]);
  const names = await userNames(ctx, [project.managerId, ...members.map((m) => m.userId), ...project.tasks.map((t) => t.assigneeId)]);
  const write = ctx.can("projects:write");
  const tasks = ctx.can("tasks:write");

  return (
    <>
      <PageHeader
        title={project.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>{project.number}</span>·
            <Link className="link" href={`/app/clients/${project.clientId}`}>
              {project.client.name}
            </Link>
            <Badge color={project.status.color}>{project.status.name}</Badge>
            {!project.visibleToClient && <Badge tone="amber">Hidden from client</Badge>}
          </span>
        }
        back={{ href: "/app/projects", label: "Projects" }}
        actions={
          ctx.can("tickets:write") && (
            <Link href={`/app/tickets/new?clientId=${project.clientId}&projectId=${id}`} className="btn-secondary">
              New ticket
            </Link>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card title={`Tasks (${project.tasks.filter((t) => t.status === "DONE").length}/${project.tasks.length} done)`}>
            <div className="mb-4 flex items-center gap-3">
              <Progress value={project.progress} />
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <ul className="divide-y divide-zinc-100">
              {project.tasks.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className={t.status === "DONE" ? "text-sm text-grey line-through" : "text-sm"}>{t.title}</p>
                    <p className="text-xs text-grey">
                      {t.assigneeId ? names.get(t.assigneeId) : "Unassigned"}
                      {t.dueDate ? ` · due ${formatDate(t.dueDate)}` : ""}
                      {t.visibleToClient ? " · visible to client" : ""}
                    </p>
                  </div>
                  {tasks ? (
                    <div className="flex items-center gap-1">
                      <form action={async (fd) => { "use server"; await setTaskStatus(t.id, undefined, fd); }}>
                        <AutoSubmitSelect name="status" defaultValue={t.status} label="Task status" className="w-36 py-1 text-xs">
                          {TASK_STATUSES.map(([v, l]) => (
                            <option key={v} value={v}>
                              {l}
                            </option>
                          ))}
                        </AutoSubmitSelect>
                      </form>
                      <ActionButton action={deleteTask.bind(null, t.id)} className="btn-ghost btn-sm" confirm="Delete this task?">
                        ✕<span className="sr-only">Delete task</span>
                      </ActionButton>
                    </div>
                  ) : (
                    <StatusBadge status={t.status} />
                  )}
                </li>
              ))}
              {project.tasks.length === 0 && <li className="py-3 text-sm text-grey">No tasks yet.</li>}
            </ul>
            {tasks && (
              <ActionForm action={addTask.bind(null, id)} reset submit="Add task" submitClassName="btn-secondary btn-sm" className="mt-4 grid gap-2 border-t border-line pt-4 sm:grid-cols-[1fr_10rem_9rem]">
                <input name="title" className="input" placeholder="New task" required aria-label="Task title" />
                <select name="assigneeId" className="input" aria-label="Assignee" defaultValue="">
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input name="dueDate" type="date" className="input" aria-label="Due date" />
                <label className="flex items-center gap-2 text-sm text-grey sm:col-span-3">
                  <input type="checkbox" name="visibleToClient" /> Show this task in the client portal
                </label>
              </ActionForm>
            )}
          </Card>

          {write && (
            <Card title="Project details">
              <ProjectForm ctx={ctx} project={project} />
            </Card>
          )}
          {!write && project.description && (
            <Card title="Scope">
              <p className="text-sm whitespace-pre-wrap">{project.description}</p>
            </Card>
          )}
          <Timeline ctx={ctx} entityType="PROJECT" entityId={id} canWrite={write} />
        </div>

        <div className="space-y-6">
          <Card title="Overview">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-grey">Manager</dt><dd>{project.managerId ? names.get(project.managerId) : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-grey">Start</dt><dd>{formatDate(project.startDate)}</dd></div>
              <div className="flex justify-between"><dt className="text-grey">Due</dt><dd>{formatDate(project.dueDate)}</dd></div>
            </dl>
          </Card>
          <Card title="Team">
            <ul className="space-y-2">
              {members.map((m) => (
                <li key={m.userId} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <Avatar name={names.get(m.userId) ?? "?"} /> {names.get(m.userId) ?? "Former member"}
                  </span>
                  {write && (
                    <ActionButton action={removeMember.bind(null, id, m.userId)} className="btn-ghost btn-sm">
                      Remove
                    </ActionButton>
                  )}
                </li>
              ))}
            </ul>
            {write && (
              <ActionForm action={addMember.bind(null, id)} submit="Add" submitClassName="btn-secondary btn-sm" className="mt-3 flex gap-2">
                <select name="userId" className="input" aria-label="Team member">
                  {staff
                    .filter((s) => !members.some((m) => m.userId === s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </ActionForm>
            )}
          </Card>
          {ctx.can("tickets:read") && (
            <Card title="Tickets" pad={false}>
              {tickets.length ? (
                <ul className="divide-y divide-zinc-100">
                  {tickets.map((t) => (
                    <li key={t.id}>
                      <Link href={`/app/tickets/${t.id}`} className="flex items-center justify-between gap-2 px-5 py-2.5 text-sm hover:bg-zinc-50">
                        <span className="truncate">{t.subject}</span>
                        <Badge color={t.status.color}>{t.status.name}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-4 text-sm text-grey">No tickets.</p>
              )}
            </Card>
          )}
          {ctx.can("projects:delete") && (
            <ActionButton action={deleteProject.bind(null, id)} className="btn-danger btn-sm" confirm="Delete this project, its tasks and links?">
              Delete project
            </ActionButton>
          )}
        </div>
      </div>
    </>
  );
}
