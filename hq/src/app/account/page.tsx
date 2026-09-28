import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/forms";
import { Card, Field, PageHeader } from "@/components/ui";
import { requireSession } from "@/lib/auth";
import { changePassword } from "../auth-actions";

export const metadata: Metadata = { title: "Account" };

export default async function Account() {
  const session = await requireSession();
  return (
    <main className="mx-auto max-w-lg px-5 py-12">
      <PageHeader title="Your account" description={session.user.email} back={{ href: "/", label: "Back" }} />
      <Card title="Change password">
        <ActionForm action={changePassword} reset submit="Update password" className="space-y-3">
          <Field label="Current password">
            <input name="current" type="password" className="input" required autoComplete="current-password" />
          </Field>
          <Field label="New password" hint="At least 8 characters.">
            <input name="next" type="password" className="input" required minLength={8} autoComplete="new-password" />
          </Field>
        </ActionForm>
      </Card>
      <p className="mt-6 text-sm text-grey">
        <Link href="/select-org" className="link">
          Switch workspace
        </Link>
      </p>
    </main>
  );
}
