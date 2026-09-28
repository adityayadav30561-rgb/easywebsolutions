import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButton, ActionForm } from "@/components/forms";
import { Timeline } from "@/components/Timeline";
import { Badge, Card, PageHeader, StatusBadge } from "@/components/ui";
import { leadScope, requireStaff } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { convertLead, deleteLead, moveLead } from "../actions";
import { LeadForm } from "../LeadForm";

export const metadata: Metadata = { title: "Lead" };

export default async function LeadPage({ params }: PageProps<"/app/leads/[id]">) {
  const ctx = await requireStaff("leads:read");
  const { id } = await params;
  const lead = await ctx.db.lead.findFirst({
    where: { id, ...leadScope(ctx) },
    include: { stage: true, convertedClient: true, quotations: { orderBy: { createdAt: "desc" } } },
  });
  if (!lead) notFound();
  const stages = await ctx.db.pipelineStage.findMany({ where: { isActive: true }, orderBy: { sort: "asc" } });
  const write = ctx.can("leads:write");

  return (
    <>
      <PageHeader
        title={lead.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge color={lead.stage.color}>{lead.stage.name}</Badge>
            {lead.companyName && <span>{lead.companyName}</span>}
            {lead.convertedClient && (
              <span>
                · Converted to{" "}
                <Link className="link" href={`/app/clients/${lead.convertedClient.id}`}>
                  {lead.convertedClient.name}
                </Link>
              </span>
            )}
          </span>
        }
        back={{ href: "/app/leads", label: "Leads" }}
        actions={
          <>
            {ctx.can("quotes:write") && (
              <Link href={`/app/quotes/new?${lead.convertedClientId ? `clientId=${lead.convertedClientId}` : `leadId=${lead.id}`}`} className="btn-secondary">
                Create quotation
              </Link>
            )}
            {write && ctx.can("clients:write") && !lead.convertedClientId && (
              <ActionButton action={convertLead.bind(null, lead.id)} className="btn-primary" confirm="Create a client from this lead?">
                Convert to client
              </ActionButton>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {write ? (
            <Card title="Details">
              <LeadForm ctx={ctx} lead={lead} />
            </Card>
          ) : (
            <Card title="Details">
              <p className="text-sm whitespace-pre-wrap">{lead.notes || "No notes."}</p>
            </Card>
          )}
          <Timeline ctx={ctx} entityType="LEAD" entityId={lead.id} canWrite={write} />
        </div>

        <div className="space-y-6">
          {write && (
            <Card title="Move stage">
              <ActionForm action={moveLead.bind(null, lead.id)} submit="Move" submitClassName="btn-secondary btn-sm" className="space-y-2">
                <select name="stageId" className="input" defaultValue={lead.stageId} aria-label="Stage">
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.kind !== "OPEN" ? `(${s.kind.toLowerCase()})` : ""}
                    </option>
                  ))}
                </select>
                <input name="lostReason" className="input" placeholder="Reason, if lost" defaultValue={lead.lostReason ?? ""} />
              </ActionForm>
            </Card>
          )}
          <Card title="Quotations" pad={false}>
            {lead.quotations.length ? (
              <ul className="divide-y divide-zinc-100">
                {lead.quotations.map((q) => (
                  <li key={q.id}>
                    <Link href={`/app/quotes/${q.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-zinc-50">
                      <span>
                        {q.number} <span className="text-grey">· {formatMoney(q.total, q.currencyCode)}</span>
                      </span>
                      <StatusBadge status={q.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-sm text-grey">None yet.</p>
            )}
          </Card>
          <p className="text-xs text-grey">Created {formatDate(lead.createdAt)}</p>
          {ctx.can("leads:delete") && (
            <ActionButton action={deleteLead.bind(null, lead.id)} className="btn-danger btn-sm" confirm="Delete this lead permanently?">
              Delete lead
            </ActionButton>
          )}
        </div>
      </div>
    </>
  );
}
