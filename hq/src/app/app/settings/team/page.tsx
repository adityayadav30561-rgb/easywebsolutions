import type { Metadata } from "next";
import { ActionButton, ActionForm } from "@/components/forms";
import { Avatar, Badge, Card, Field, PageHeader, StatusBadge } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { formatDate } from "@/lib/utils";
import { changeRole, inviteStaff, revokeInvite, setMemberStatus } from "./actions";

export const metadata: Metadata = { title: "Team & access" };

export default async function Team() {
  const ctx = await requireStaff("team:manage");
  const [members, roles, invites] = await Promise.all([
    ctx.db.membership.findMany({ where: { type: "STAFF" }, include: { user: true, role: true }, orderBy: { createdAt: "asc" } }),
    ctx.db.role.findMany({ where: { type: "STAFF" }, orderBy: { name: "asc" } }),
    ctx.db.invitation.findMany({ where: { acceptedAt: null, role: { type: "STAFF" } }, include: { role: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <PageHeader title="Team & access" description="Staff of your agency. Client portal users are managed on each client's page." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Card title={`Members (${members.length})`} pad={false}>
          <ul className="divide-y divide-zinc-100">
            {members.map((m) => (
              <li key={m.id} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={m.user.name} size={34} />
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {m.user.name} {m.userId === ctx.userId && <Badge tone="violet">You</Badge>}
                      {m.status !== "ACTIVE" && <StatusBadge status={m.status} />}
                    </p>
                    <p className="truncate text-xs text-grey">
                      {m.user.email} · {m.user.lastLoginAt ? `last seen ${formatDate(m.user.lastLoginAt)}` : "never signed in"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ActionForm action={changeRole.bind(null, m.id)} submit="Save" submitClassName="btn-ghost btn-sm" className="flex flex-wrap items-center gap-2 [&>div]:mt-0">
                    <input name="jobTitle" className="input w-32" defaultValue={m.jobTitle ?? ""} placeholder="Job title" aria-label="Job title" />
                    <select name="roleId" className="input w-36" defaultValue={m.roleId} aria-label="Role">
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </ActionForm>
                  {m.userId !== ctx.userId && (
                    <ActionButton action={setMemberStatus.bind(null, m.id)} fields={{ status: m.status === "ACTIVE" ? "DISABLED" : "ACTIVE" }} className="btn-ghost btn-sm" confirm={m.status === "ACTIVE" ? `Disable ${m.user.name}? They lose access immediately.` : undefined}>
                      {m.status === "ACTIVE" ? "Disable" : "Enable"}
                    </ActionButton>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card title="Invite a team member">
            <ActionForm action={inviteStaff} submit="Create invitation" className="space-y-3">
              <Field label="Name">
                <input name="name" className="input" />
              </Field>
              <Field label="Email">
                <input name="email" type="email" className="input" required />
              </Field>
              <Field label="Role">
                <select name="roleId" className="input" defaultValue={roles.find((r) => r.key === "member")?.id}>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                      {r.dataScope === "ASSIGNED" ? " (assigned work only)" : ""}
                    </option>
                  ))}
                </select>
              </Field>
            </ActionForm>
            <p className="mt-3 text-xs text-grey">You&apos;ll get a one-time link to send them. It expires after 7 days.</p>
          </Card>
          {invites.length > 0 && (
            <Card title="Pending invitations">
              <ul className="space-y-2 text-sm">
                {invites.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block truncate">{i.email}</span>
                      <span className="text-xs text-grey">
                        {i.role.name} · {i.expiresAt < new Date() ? "expired" : `expires ${formatDate(i.expiresAt)}`}
                      </span>
                    </span>
                    <ActionButton action={revokeInvite.bind(null, i.id)} className="btn-ghost btn-sm">
                      Revoke
                    </ActionButton>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
