import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Table } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { userNames } from "@/lib/lookups";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Audit log" };

const PAGE = 100;

export default async function Audit({ searchParams }: PageProps<"/app/settings/audit">) {
  const ctx = await requireStaff("audit:view");
  const sp = await searchParams;
  const page = Math.max(0, Number(sp.page ?? 0) || 0);
  const rows = await ctx.db.auditLog.findMany({ orderBy: { createdAt: "desc" }, skip: page * PAGE, take: PAGE + 1 });
  const names = await userNames(ctx, rows.map((r) => r.userId));

  return (
    <>
      <PageHeader title="Audit log" description="Who changed what in your organisation." />
      <Table head={["When", "Who", "Action", "What"]}>
        {rows.slice(0, PAGE).map((r) => (
          <tr key={r.id}>
            <td className="whitespace-nowrap text-grey">{formatDateTime(r.createdAt)}</td>
            <td>{r.userId ? (names.get(r.userId) ?? "Former member") : "System"}</td>
            <td className="text-grey">
              {r.action} · {r.entityType}
            </td>
            <td>{r.summary}</td>
          </tr>
        ))}
      </Table>
      <div className="mt-4 flex gap-2">
        {page > 0 && (
          <Link className="btn-secondary" href={`/app/settings/audit?page=${page - 1}`}>
            Newer
          </Link>
        )}
        {rows.length > PAGE && (
          <Link className="btn-secondary" href={`/app/settings/audit?page=${page + 1}`}>
            Older
          </Link>
        )}
      </div>
    </>
  );
}
