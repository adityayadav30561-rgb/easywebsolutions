import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { MASTERS } from "@/lib/masters";

export const metadata: Metadata = { title: "Masters" };

export default async function MastersIndex() {
  const ctx = await requireStaff("masters:manage");
  const list = [
    ...MASTERS.filter((m) => !m.feature || ctx.has(m.feature)).map((m) => ({ href: `/app/settings/masters/${m.key}`, label: m.label, description: m.description })),
    { href: "/app/settings/masters/packages", label: "Packages", description: "Bundles of services that fill a quotation in one click." },
    ...(ctx.has("CARE_PLANS") ? [{ href: "/app/care/plans", label: "Care plans", description: "Your monthly website-care plans." }] : []),
  ];
  return (
    <>
      <PageHeader title="Masters" description="The lookup lists your team works with. Each agency has its own." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <Link key={m.href} href={m.href} className="card block p-5 transition hover:border-violet-300">
            <p className="font-medium">{m.label}</p>
            <p className="mt-1 text-sm text-grey">{m.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
