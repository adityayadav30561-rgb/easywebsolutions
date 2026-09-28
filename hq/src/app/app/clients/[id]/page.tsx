import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButton, ActionForm } from "@/components/forms";
import { Timeline } from "@/components/Timeline";
import { Badge, Card, DefinitionList, PageHeader, StatusBadge } from "@/components/ui";
import { clientScope, projectScope, requireStaff, ticketScope } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { addContact, deleteClient, inviteClientUser, removeContact, setPortalAccess } from "../actions";
import { ClientForm } from "../ClientForm";

export const metadata: Metadata = { title: "Client" };

function Section({ title, href, children, count }: { title: string; href?: string; children: React.ReactNode; count: number }) {
  return (
    <Card title={`${title} (${count})`} pad={false} actions={href ? <Link href={href} className="text-xs font-medium text-violet-700 hover:underline">+ New</Link> : null}>
      {count ? <ul className="divide-y divide-zinc-100">{children}</ul> : <p className="px-5 py-4 text-sm text-grey">None yet.</p>}
    </Card>
  );
}

function Row({ href, left, right }: { href: string; left: React.ReactNode; right: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-zinc-50">
        <span className="min-w-0 truncate">{left}</span>
        <span className="shrink-0">{right}</span>
      </Link>
    </li>
  );
}

export default async function ClientPage({ params }: PageProps<"/app/clients/[id]">) {
  const ctx = await requireStaff("clients:read");
  const { id } = await params;
  const client = await ctx.db.client.findFirst({ where: { id, ...clientScope(ctx) }, include: { contacts: { orderBy: [{ isPrimary: "desc" }, { name: "asc" }] } } });
  if (!client) notFound();

  const [projects, tickets, quotes, invoices, subs, portalUsers, portalRoles, pendingInvites] = await Promise.all([
    ctx.can("projects:read") ? ctx.db.project.findMany({ where: { clientId: id, ...projectScope(ctx) }, include: { status: true }, orderBy: { createdAt: "desc" } }) : [],
    ctx.can("tickets:read") ? ctx.db.ticket.findMany({ where: { clientId: id, ...ticketScope(ctx) }, include: { status: true }, orderBy: { createdAt: "desc" }, take: 20 }) : [],
    ctx.can("quotes:read") ? ctx.db.quotation.findMany({ where: { clientId: id }, orderBy: { createdAt: "desc" } }) : [],
    ctx.can("invoices:read") ? ctx.db.invoice.findMany({ where: { clientId: id }, orderBy: { createdAt: "desc" } }) : [],
    ctx.can("careplans:read") ? ctx.db.careSubscription.findMany({ where: { clientId: id }, include: { plan: true }, orderBy: { createdAt: "desc" } }) : [],
    ctx.db.membership.findMany({ where: { clientId: id, type: "CLIENT" }, include: { user: { select: { name: true, email: true, lastLoginAt: true } } } }),
    ctx.db.role.findMany({ where: { type: "CLIENT" }, orderBy: { name: "asc" } }),
    ctx.db.invitation.findMany({ where: { clientId: id, acceptedAt: null, expiresAt: { gt: new Date() } } }),
  ]);
  const write = ctx.can("clients:write");
  const outstanding = invoices.filter((i) => ["SENT", "PARTIALLY_PAID"].includes(i.status)).reduce((s, i) => s + Number(i.total) - Number(i.amountPaid), 0);
  const cur = ctx.org.currencyCode;

  return (
    <>
      <PageHeader
        title={client.name}
        description={
          <span className="flex items-center gap-2">
            <StatusBadge status={client.status} /> {client.industry}
          </span>
        }
        back={{ href: "/app/clients", label: "Clients" }}
        actions={
          <>
            {ctx.can("quotes:write") && (
              <Link href={`/app/quotes/new?clientId=${id}`} className="btn-secondary">
                New quotation
              </Link>
            )}
            {ctx.can("tickets:write") && (
              <Link href={`/app/tickets/new?clientId=${id}`} className="btn-secondary">
                New ticket
              </Link>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {ctx.can("invoices:read") && ctx.can("reports:view") && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="card p-4">
                <p className="text-xs text-grey">Invoiced</p>
                <p className="mt-1 font-display text-lg font-semibold">{formatMoney(invoices.filter((i) => i.status !== "VOID").reduce((s, i) => s + Number(i.total), 0), cur)}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-grey">Outstanding</p>
                <p className="mt-1 font-display text-lg font-semibold">{formatMoney(outstanding, cur)}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-grey">Client since</p>
                <p className="mt-1 font-display text-lg font-semibold">{formatDate(client.createdAt)}</p>
              </div>
            </div>
          )}

          {ctx.can("projects:read") && (
            <Section title="Projects" count={projects.length} href={ctx.can("projects:write") ? `/app/projects/new?clientId=${id}` : undefined}>
              {projects.map((p) => (
                <Row key={p.id} href={`/app/projects/${p.id}`} left={<>{p.number} · {p.name}</>} right={<Badge color={p.status.color}>{p.status.name}</Badge>} />
              ))}
            </Section>
          )}
          {ctx.can("careplans:read") && (
            <Section title="Care plans" count={subs.length} href={ctx.can("careplans:write") ? `/app/care/new?clientId=${id}` : undefined}>
              {subs.map((s) => (
                <Row key={s.id} href={`/app/care/${s.id}`} left={<>{s.plan.name} · {s.websiteUrl ?? "—"}</>} right={<StatusBadge status={s.status} />} />
              ))}
            </Section>
          )}
          {ctx.can("tickets:read") && (
            <Section title="Recent tickets" count={tickets.length} href={ctx.can("tickets:write") ? `/app/tickets/new?clientId=${id}` : undefined}>
              {tickets.map((t) => (
                <Row key={t.id} href={`/app/tickets/${t.id}`} left={<>{t.number} · {t.subject}</>} right={<Badge color={t.status.color}>{t.status.name}</Badge>} />
              ))}
            </Section>
          )}
          {ctx.can("quotes:read") && (
            <Section title="Quotations" count={quotes.length} href={ctx.can("quotes:write") ? `/app/quotes/new?clientId=${id}` : undefined}>
              {quotes.map((q) => (
                <Row key={q.id} href={`/app/quotes/${q.id}`} left={<>{q.number} · {q.title}</>} right={<span className="flex items-center gap-3"><span className="text-grey">{formatMoney(q.total, q.currencyCode)}</span><StatusBadge status={q.status} /></span>} />
              ))}
            </Section>
          )}
          {ctx.can("invoices:read") && (
            <Section title="Invoices" count={invoices.length} href={ctx.can("invoices:write") ? `/app/invoices/new?clientId=${id}` : undefined}>
              {invoices.map((i) => (
                <Row key={i.id} href={`/app/invoices/${i.id}`} left={<>{i.number} · {formatDate(i.issueDate)}</>} right={<span className="flex items-center gap-3"><span className="text-grey">{formatMoney(i.total, i.currencyCode)}</span><StatusBadge status={i.status} /></span>} />
              ))}
            </Section>
          )}

          <Card title="Details">
            {write ? (
              <ClientForm ctx={ctx} client={client} />
            ) : (
              <DefinitionList
                items={[
                  ["Email", client.email],
                  ["Phone", client.phone],
                  ["Website", client.website],
                  ["Address", [client.address, client.city, client.country].filter(Boolean).join(", ") || null],
                  ["Tax ID", client.taxId],
                ]}
              />
            )}
          </Card>
          <Timeline ctx={ctx} entityType="CLIENT" entityId={id} canWrite={write} />
        </div>

        <div className="space-y-6">
          <Card title="Contacts">
            <ul className="space-y-3">
              {client.contacts.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-2 text-sm">
                  <span className="min-w-0">
                    <span className="font-medium">{c.name}</span> {c.isPrimary && <Badge tone="violet">Primary</Badge>}
                    <span className="block truncate text-xs text-grey">{[c.designation, c.email, c.phone].filter(Boolean).join(" · ")}</span>
                  </span>
                  {write && (
                    <ActionButton action={removeContact.bind(null, c.id)} className="btn-ghost btn-sm" confirm={`Remove ${c.name}?`}>
                      Remove
                    </ActionButton>
                  )}
                </li>
              ))}
              {client.contacts.length === 0 && <li className="text-sm text-grey">No contacts yet.</li>}
            </ul>
            {write && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-violet-700">Add contact</summary>
                <ActionForm action={addContact.bind(null, id)} reset submit="Add contact" submitClassName="btn-secondary btn-sm" className="mt-3 space-y-2">
                  <input name="name" className="input" placeholder="Name" required />
                  <input name="email" type="email" className="input" placeholder="Email" />
                  <input name="phone" className="input" placeholder="Phone" />
                  <input name="designation" className="input" placeholder="Role / designation" />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="isPrimary" /> Primary contact
                  </label>
                </ActionForm>
              </details>
            )}
          </Card>

          {ctx.has("CLIENT_PORTAL") && (
            <Card title="Client portal access">
              <ul className="space-y-3">
                {portalUsers.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{m.user.name}</span>
                      <span className="block truncate text-xs text-grey">
                        {m.user.email} · {m.user.lastLoginAt ? `last seen ${formatDate(m.user.lastLoginAt)}` : "never signed in"}
                      </span>
                    </span>
                    {write && (
                      <ActionButton action={setPortalAccess.bind(null, m.id)} fields={{ status: m.status === "ACTIVE" ? "DISABLED" : "ACTIVE" }} className="btn-ghost btn-sm">
                        {m.status === "ACTIVE" ? "Disable" : "Enable"}
                      </ActionButton>
                    )}
                  </li>
                ))}
                {pendingInvites.map((i) => (
                  <li key={i.id} className="text-sm text-grey">
                    {i.email} · invited, expires {formatDate(i.expiresAt)}
                  </li>
                ))}
                {portalUsers.length + pendingInvites.length === 0 && <li className="text-sm text-grey">No one from this client can sign in yet.</li>}
              </ul>
              {write && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-violet-700">Invite to portal</summary>
                  <ActionForm action={inviteClientUser.bind(null, id)} submit="Create invitation" submitClassName="btn-secondary btn-sm" className="mt-3 space-y-2">
                    <input name="name" className="input" placeholder="Name" />
                    <input name="email" type="email" className="input" placeholder="Email" required />
                    <select name="roleId" className="input" aria-label="Portal role">
                      {portalRoles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </ActionForm>
                </details>
              )}
            </Card>
          )}

          {ctx.can("clients:delete") && (
            <ActionButton action={deleteClient.bind(null, id)} className="btn-danger btn-sm" confirm="Delete this client permanently?">
              Delete client
            </ActionButton>
          )}
        </div>
      </div>
    </>
  );
}
