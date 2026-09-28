import { Shell } from "@/components/Shell";
import { UserFooter } from "@/components/UserFooter";
import { requirePlatformAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await requirePlatformAdmin();
  return (
    <Shell
      root="/admin"
      brand="HQ Platform"
      sub="Platform administration"
      groups={[{ items: [{ href: "/admin", label: "Organisations", icon: "building" }] }]}
      footer={<UserFooter name={session.user.name} email={session.user.email} isPlatformAdmin={false} canSwitch />}
    >
      {children}
    </Shell>
  );
}
