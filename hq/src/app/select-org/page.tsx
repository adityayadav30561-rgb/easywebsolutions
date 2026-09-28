import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { Submit } from "@/components/forms";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chooseOrg, logout } from "../auth-actions";

export const metadata: Metadata = { title: "Choose workspace" };

export default async function SelectOrgPage() {
  const session = await requireSession();
  const memberships = await prisma.membership.findMany({
    where: { userId: session.userId, status: "ACTIVE", organization: { status: "ACTIVE" } },
    include: { organization: true, role: true, client: true },
    orderBy: { organization: { name: "asc" } },
  });

  return (
    <AuthShell title="Choose a workspace" subtitle={`Signed in as ${session.user.email}`}>
      <div className="space-y-2">
        {memberships.map((m) => (
          <form key={m.id} action={chooseOrg}>
            <input type="hidden" name="orgId" value={m.organizationId} />
            <button type="submit" className="card flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:border-violet-300">
              <span>
                <span className="block font-medium">{m.organization.name}</span>
                <span className="block text-xs text-grey">
                  {m.type === "CLIENT" ? `Client portal · ${m.client?.name ?? ""}` : m.role.name}
                </span>
              </span>
              <span aria-hidden="true" className="text-grey">→</span>
            </button>
          </form>
        ))}
        {memberships.length === 0 && (
          <p className="rounded-lg bg-white p-4 text-sm text-grey">You&apos;re not a member of any active workspace yet. Ask your agency for an invitation.</p>
        )}
      </div>
      <div className="mt-6 flex items-center gap-2">
        {session.user.isPlatformAdmin && (
          <Link href="/admin" className="btn-secondary">
            Platform admin
          </Link>
        )}
        <form action={logout}>
          <Submit className="btn-ghost">Sign out</Submit>
        </form>
      </div>
    </AuthShell>
  );
}
