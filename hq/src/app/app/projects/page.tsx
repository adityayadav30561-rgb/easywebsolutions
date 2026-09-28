import type { Metadata } from "next";
import Link from "next/link";
import { Badge, PageHeader, Progress, Table } from "@/components/ui";
import { projectScope, requireStaff } from "@/lib/context";
import { userNames } from "@/lib/lookups";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects" };

export default async function Projects({ searchParams }: PageProps<"/app/projects">) {
  const ctx = await requireStaff("projects:read");
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const showClosed = sp.closed === "1";
  const [statuses, projects] = await Promise.all([
    ctx.db.projectStatus.findMany({ orderBy: { sort: "asc" } }),
    ctx.db.project.findMany({
      where: { ...projectScope(ctx), ...(status ? { statusId: status } : showClosed ? {} : { status: { isClosed: false } }) },
      include: { client: { select: { name: true } }, status: true },
      orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }],
      take: 500,
    }),
  ]);
  const names = await userNames(ctx, projects.map((p) => p.managerId));

  return (
    <>
      <PageHeader
        title="Projects"
        description={ctx.assignedOnly ? "Projects you manage or are a member of" : undefined}
        actions={
          <>
            <form className="flex gap-2">
              <select name="status" defaultValue={status} className="input w-44" aria-label="Status">
                <option value="">All open</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1.5 text-sm text-grey">
                <input type="checkbox" name="closed" value="1" defaultChecked={showClosed} /> Include finished
              </label>
              <button className="btn-secondary">Filter</button>
            </form>
            {ctx.can("projects:write") && (
              <Link href="/app/projects/new" className="btn-primary">
                New project
              </Link>
            )}
          </>
        }
      />
      <Table head={["Project", "Client", "Status", "Progress", "Manager", "Due"]}>
        {projects.map((p) => (
          <tr key={p.id}>
            <td>
              <Link href={`/app/projects/${p.id}`} className="link">
                {p.name}
              </Link>
              <div className="text-xs text-grey">{p.number}</div>
            </td>
            <td className="text-grey">{p.client.name}</td>
            <td>
              <Badge color={p.status.color}>{p.status.name}</Badge>
            </td>
            <td className="w-40">
              <div className="flex items-center gap-2">
                <Progress value={p.progress} />
                <span className="w-9 text-right text-xs text-grey">{p.progress}%</span>
              </div>
            </td>
            <td className="text-grey">{p.managerId ? names.get(p.managerId) : "—"}</td>
            <td className={p.dueDate && p.dueDate < new Date() && !p.status.isClosed ? "text-red-700" : "text-grey"}>{formatDate(p.dueDate)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
