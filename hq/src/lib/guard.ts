import { headers } from "next/headers";

/** Throw a friendly error when a lookup through the tenant-scoped client finds nothing. */
export function must<T>(value: T | null | undefined, what = "Record"): T {
  if (value === null || value === undefined) throw new Error(`${what} not found`);
  return value;
}

/** Absolute link for sharing: APP_URL when set, otherwise the host of the current request. */
export async function appUrl(path: string) {
  let base = process.env.APP_URL;
  if (!base) {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    base = `${h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")}://${host}`;
  }
  return `${base.replace(/\/$/, "")}${path}`;
}
