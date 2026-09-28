import { Shell, type NavGroup } from "@/components/Shell";
import { UserFooter } from "@/components/UserFooter";
import { requireClient } from "@/lib/context";
import { prisma } from "@/lib/prisma";

export default async function PortalLayout({ children }: LayoutProps<"/portal">) {
  const ctx = await requireClient();
  const memberships = await prisma.membership.count({ where: { userId: ctx.userId, status: "ACTIVE" } });
  const item = (ok: boolean, href: string, label: string, icon: string) => (ok ? [{ href, label, icon }] : []);
  const groups: NavGroup[] = [
    {
      items: [
        { href: "/portal", label: "Overview", icon: "home" },
        ...item(ctx.can("portal:projects"), "/portal/projects", "Projects", "folder"),
        ...item(ctx.can("portal:tickets"), "/portal/tickets", "Support requests", "ticket"),
        ...item(ctx.can("portal:care"), "/portal/care", "Care plan", "shield"),
        ...item(ctx.can("portal:quotes"), "/portal/quotes", "Quotations", "doc"),
        ...item(ctx.can("portal:invoices"), "/portal/invoices", "Invoices", "receipt"),
      ],
    },
  ];
  return (
    <Shell
      root="/portal"
      brand={ctx.org.name}
      sub={`Client portal · ${ctx.membership.client?.name ?? ""}`}
      groups={groups}
      footer={<UserFooter name={ctx.user.name} email={ctx.user.email} isPlatformAdmin={false} canSwitch={memberships > 1} />}
    >
      {children}
    </Shell>
  );
}
