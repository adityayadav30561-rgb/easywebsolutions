import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, StatusBadge, Table } from "@/components/ui";
import { clientScope, requireStaff } from "@/lib/context";

export const metadata: Metadata = { title: "Clients" };

export default async function Clients({ searchParams }: PageProps<"/app/clients">) {
  const ctx = await requireStaff("clients:read");
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const clients = await ctx.db.client.findMany({
    where: { ...clientScope(ctx), ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}) },
    include: {
      _count: { select: { projects: true, tickets: { where: { status: { isClosed: false } } } } },
      subscriptions: { where: { status: "ACTIVE" }, include: { plan: { select: { name: true } } } },
    },
    orderBy: { name: "asc" },
    take: 500,
  });
  const care = ctx.has("CARE_PLANS");

  return (
    <>
      <PageHeader
        title="Clients"
        description={`${clients.length} client${clients.length === 1 ? "" : "s"}`}
        actions={
          <>
            <form>
              <input name="q" defaultValue={q} placeholder="Search clients" className="input w-48" aria-label="Search clients" />
            </form>
            {ctx.can("clients:write") && (
              <Link href="/app/clients/new" className="btn-primary">
                New client
              </Link>
            )}
          </>
        }
      />
      <Table head={["Client", "Contact", "Projects", "Open tickets", ...(care ? ["Care plan"] : []), "Status"]}>
        {clients.map((c) => (
          <tr key={c.id}>
            <td>
              <Link href={`/app/clients/${c.id}`} className="link">
                {c.name}
              </Link>
              {c.industry && <div className="text-xs text-grey">{c.industry}</div>}
            </td>
            <td className="text-grey">{c.email ?? c.phone ?? "—"}</td>
            <td>{c._count.projects}</td>
            <td>{c._count.tickets}</td>
            {care && <td>{c.subscriptions.map((s) => s.plan.name).join(", ") || "—"}</td>}
            <td>
              <StatusBadge status={c.status} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
