import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { Badge, PageHeader, Table, Tabs } from "@/components/ui";
import { leadScope, requireStaff } from "@/lib/context";
import { userNames } from "@/lib/lookups";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads" };

export default async function Leads({ searchParams }: PageProps<"/app/leads">) {
  const ctx = await requireStaff("leads:read");
  const sp = await searchParams;
  const view = sp.view === "list" ? "list" : "board";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const cur = ctx.org.currencyCode;

  const where: Prisma.LeadWhereInput = {
    ...leadScope(ctx),
    ...(q
      ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { companyName: { contains: q, mode: "insensitive" } }, { contactName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }
      : {}),
  };

  const [stages, leads] = await Promise.all([
    ctx.db.pipelineStage.findMany({ where: { isActive: true }, orderBy: { sort: "asc" } }),
    ctx.db.lead.findMany({ where, include: { stage: true, source: true }, orderBy: { updatedAt: "desc" }, take: 500 }),
  ]);
  const names = await userNames(ctx, leads.map((l) => l.ownerId));

  return (
    <>
      <PageHeader
        title="Leads"
        description={`${leads.length} lead${leads.length === 1 ? "" : "s"}${ctx.assignedOnly ? " assigned to you" : ""}`}
        actions={
          <>
            <form className="flex">
              <input type="hidden" name="view" value={view} />
              <input name="q" defaultValue={q} placeholder="Search leads" className="input w-48" aria-label="Search leads" />
            </form>
            {ctx.can("leads:write") && (
              <Link href="/app/leads/new" className="btn-primary">
                New lead
              </Link>
            )}
          </>
        }
      />
      <Tabs
        current={view}
        items={[
          { key: "board", label: "Pipeline", href: `/app/leads?view=board${q ? `&q=${encodeURIComponent(q)}` : ""}` },
          { key: "list", label: "List", href: `/app/leads?view=list${q ? `&q=${encodeURIComponent(q)}` : ""}` },
        ]}
      />

      {view === "board" ? (
        <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4">
            {stages.map((s) => {
              const items = leads.filter((l) => l.stageId === s.id);
              const sum = items.reduce((t, l) => t + Number(l.value ?? 0), 0);
              return (
                <section key={s.id} className="w-72 shrink-0" aria-label={s.name}>
                  <header className="mb-2 flex items-center justify-between px-1">
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                      <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                      {s.name} <span className="font-normal text-grey">{items.length}</span>
                    </h2>
                    {ctx.can("reports:view") && <span className="text-xs text-grey">{formatMoney(sum, cur)}</span>}
                  </header>
                  <ul className="space-y-2 rounded-xl bg-zinc-100/70 p-2">
                    {items.map((l) => (
                      <li key={l.id}>
                        <Link href={`/app/leads/${l.id}`} className="card block p-3 transition hover:border-violet-300">
                          <p className="text-sm font-medium">{l.title}</p>
                          <p className="mt-0.5 text-xs text-grey">{l.companyName || l.contactName || "—"}</p>
                          <div className="mt-2 flex items-center justify-between text-xs text-grey">
                            <span>{l.value != null ? formatMoney(l.value, cur) : ""}</span>
                            <span>{l.ownerId ? names.get(l.ownerId) : "Unassigned"}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                    {items.length === 0 && <li className="px-2 py-6 text-center text-xs text-grey">No leads</li>}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        <Table head={["Lead", "Stage", "Source", "Value", "Owner", "Updated"]}>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>
                <Link href={`/app/leads/${l.id}`} className="link">
                  {l.title}
                </Link>
                <div className="text-xs text-grey">{l.companyName || l.contactName}</div>
              </td>
              <td>
                <Badge color={l.stage.color}>{l.stage.name}</Badge>
              </td>
              <td className="text-grey">{l.source?.name ?? "—"}</td>
              <td>{l.value != null ? formatMoney(l.value, cur) : "—"}</td>
              <td className="text-grey">{l.ownerId ? names.get(l.ownerId) : "—"}</td>
              <td className="text-grey">{formatDate(l.updatedAt)}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
