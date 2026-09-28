import { Shell, type NavGroup } from "@/components/Shell";
import { UserFooter } from "@/components/UserFooter";
import { requireStaff } from "@/lib/context";
import { prisma } from "@/lib/prisma";

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const ctx = await requireStaff();
  const memberships = await prisma.membership.count({ where: { userId: ctx.userId, status: "ACTIVE" } });

  const item = (ok: boolean, href: string, label: string, icon: string) => (ok ? [{ href, label, icon }] : []);
  const groups: NavGroup[] = [
    { items: item(ctx.can("dashboard:view"), "/app", "Dashboard", "home") },
    {
      label: "Sales",
      items: [
        ...item(ctx.can("leads:read"), "/app/leads", "Leads", "funnel"),
        ...item(ctx.can("clients:read"), "/app/clients", "Clients", "building"),
        ...item(ctx.can("quotes:read"), "/app/quotes", "Quotations", "doc"),
        ...item(ctx.can("invoices:read"), "/app/invoices", "Invoices", "receipt"),
      ],
    },
    {
      label: "Delivery",
      items: [
        ...item(ctx.can("projects:read"), "/app/projects", "Projects", "folder"),
        ...item(ctx.can("tickets:read"), "/app/tickets", "Tickets", "ticket"),
        ...item(ctx.can("careplans:read"), "/app/care", "Care plans", "shield"),
      ],
    },
    {
      label: "Settings",
      items: [
        ...item(ctx.can("settings:manage"), "/app/settings", "Organisation", "cog"),
        ...item(ctx.can("team:manage"), "/app/settings/team", "Team & access", "users"),
        ...item(ctx.can("team:manage"), "/app/settings/roles", "Roles", "key"),
        ...item(ctx.can("masters:manage"), "/app/settings/masters", "Masters", "list"),
        ...item(ctx.can("audit:view"), "/app/settings/audit", "Audit log", "clock"),
      ],
    },
  ].filter((g) => g.items.length > 0);

  return (
    <Shell
      root="/app"
      brand={ctx.org.name}
      sub={ctx.role.name}
      groups={groups}
      footer={<UserFooter name={ctx.user.name} email={ctx.user.email} isPlatformAdmin={ctx.user.isPlatformAdmin} canSwitch={memberships > 1} />}
    >
      {children}
    </Shell>
  );
}
