import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { ActionForm } from "@/components/forms";
import { Field } from "@/components/ui";
import { getSession, hashToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { acceptInvite } from "../../auth-actions";

export const metadata: Metadata = { title: "Accept invitation" };

export default async function InvitePage({ params }: PageProps<"/invite/[token]">) {
  const { token } = await params;
  const invite = await prisma.invitation.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { organization: true, role: true },
  });

  if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
    return (
      <AuthShell title="Invitation expired" subtitle="This link has already been used or has expired. Ask for a new invitation.">
        <span />
      </AuthShell>
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: invite.email }, select: { id: true } });
  const session = await getSession();
  const signedInAsInvitee = !!existing && session?.userId === existing.id;

  return (
    <AuthShell
      title={`Join ${invite.organization.name}`}
      subtitle={
        <>
          You&apos;ve been invited as <strong>{invite.role.name}</strong> ({invite.email}).
        </>
      }
    >
      <ActionForm action={acceptInvite.bind(null, token)} submit="Accept invitation" submitClassName="btn-primary w-full" className="space-y-4">
        {!existing && (
          <Field label="Your name">
            <input className="input" name="name" defaultValue={invite.name ?? ""} required autoComplete="name" />
          </Field>
        )}
        {!signedInAsInvitee && (
          <Field label={existing ? "Your existing password" : "Choose a password"} hint={existing ? undefined : "At least 8 characters."}>
            <input className="input" type="password" name="password" required minLength={existing ? 1 : 8} autoComplete={existing ? "current-password" : "new-password"} />
          </Field>
        )}
      </ActionForm>
    </AuthShell>
  );
}
