import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOrgContext } from "@/lib/context";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");
  const ctx = await getOrgContext();
  if (ctx) redirect(ctx.type === "CLIENT" ? "/portal" : "/app");
  redirect("/select-org");
}
