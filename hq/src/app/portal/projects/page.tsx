import type { Metadata } from "next";
import Link from "next/link";
import { Badge, PageHeader, Progress, Table } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects" };

export default async function PortalProjects() {
  const ctx = await requireClient("portal:projects");
  const projects = await ctx.db.project.findMany({ where: { clientId: ctx.clientId, visibleToClient: true }, include: { status: true }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader title="Projects" />
      <Table head={["Project", "Status", "Progress", "Target date"]}>
        {projects.map((p) => (
          <tr key={p.id}>
            <td>
              <Link href={`/portal/projects/${p.id}`} className="link">
                {p.name}
              </Link>
              <div className="text-xs text-grey">{p.number}</div>
            </td>
            <td>
              <Badge color={p.status.color}>{p.status.name}</Badge>
            </td>
            <td className="w-48">
              <div className="flex items-center gap-2">
                <Progress value={p.progress} />
                <span className="text-xs text-grey">{p.progress}%</span>
              </div>
            </td>
            <td className="text-grey">{formatDate(p.dueDate)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
