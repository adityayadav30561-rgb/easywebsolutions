import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { ActionForm } from "@/components/forms";
import { Field } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { login } from "../auth-actions";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getSession()) redirect("/");
  return (
    <AuthShell title="Sign in" subtitle="Use the email your agency invited you with.">
      <ActionForm action={login} submit="Sign in" submitClassName="btn-primary w-full" className="space-y-4">
        <Field label="Email">
          <input className="input" type="email" name="email" autoComplete="email" required autoFocus />
        </Field>
        <Field label="Password">
          <input className="input" type="password" name="password" autoComplete="current-password" required />
        </Field>
      </ActionForm>
    </AuthShell>
  );
}
