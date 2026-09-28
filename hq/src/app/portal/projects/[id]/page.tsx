import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, PageHeader, Progress, StatusBadge } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Project" };

export default async function PortalProject({ params }: PageProps<"/portal/projects/[id]">) {
  const ctx = await requireClient("portal:projects");
  const { id } = await params;
  const p = await ctx.db.project.findFirst({
    where: { id, clientId: ctx.clientId, visibleToClient: true },
    include: { status: true, tasks: { where: { visibleToClient: true }, orderBy: [{ sort: "asc" }] } },
  });
  if (!p) notFound();
  const tickets = ctx.can("portal:tickets") ? await ctx.db.ticket.findMany({ where: { projectId: id, clientId: ctx.clientId }, include: { status: true }, orderBy: { createdAt: "desc" } }) : [];

  return (
    <>
      <PageHeader title={p.name} description={<Badge color={p.status.color}>{p.status.name}</Badge>} back={{ href: "/portal/projects", label: "Projects" }} />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card title="Progress">
            <div className="flex items-center gap-3">
              <Progress value={p.progress} />
              <span className="font-medium">{p.progress}%</span>
            </div>
            {p.tasks.length > 0 && (
              <ol className="mt-5 space-y-2.5">
                {p.tasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className={t.status === "DONE" ? "text-grey line-through" : ""}>{t.title}</span>
                    <StatusBadge status={t.status} />
                  </li>
                ))}
              </ol>
            )}
          </Card>
          {p.description && (
            <Card title="Scope">
              <p className="text-sm whitespace-pre-wrap">{p.description}</p>
            </Card>
          )}
        </div>
        <div className="space-y-6">
          <Card title="Dates">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-grey">Started</dt><dd>{formatDate(p.startDate)}</dd></div>
              <div className="flex justify-between"><dt className="text-grey">Target</dt><dd>{formatDate(p.dueDate)}</dd></div>
            </dl>
          </Card>
          {ctx.can("portal:tickets") && (
            <Card title="Requests" pad={false} actions={<Link href={`/portal/tickets/new?projectId=${id}`} className="text-xs font-medium text-violet-700 hover:underline">+ New</Link>}>
              {tickets.length ? (
                <ul className="divide-y divide-zinc-100">
                  {tickets.map((t) => (
                    <li key={t.id}>
                      <Link href={`/portal/tickets/${t.id}`} className="flex items-center justify-between gap-2 px-5 py-2.5 text-sm hover:bg-zinc-50">
                        <span className="truncate">{t.subject}</span>
                        <Badge color={t.status.color}>{t.status.name}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-4 text-sm text-grey">None.</p>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
