import { unstable_rethrow } from "next/navigation";
import { z } from "zod";

export type ActionResult = { ok: string } | { error: string } | undefined;

/**
 * Wrap a server action so thrown errors (permission, validation, not found)
 * come back as `{ error }` for the form to display, while `redirect()` still works.
 */
export function safe<A extends unknown[]>(fn: (...args: A) => Promise<ActionResult | void>) {
  return async (...args: A): Promise<ActionResult> => {
    try {
      return (await fn(...args)) ?? undefined;
    } catch (e) {
      unstable_rethrow(e);
      if (e instanceof z.ZodError) return { error: e.issues.map((i) => `${i.path.join(".") || "Input"}: ${i.message}`).join(" · ") };
      const code = (e as { code?: string }).code;
      if (code === "P2025") return { error: "That record no longer exists or isn't yours." };
      if (code === "P2002") return { error: "That value is already in use." };
      if (code === "P2003") return { error: "This record is still used elsewhere, so it can't be removed." };
      console.error(e);
      return { error: e instanceof Error ? e.message : "Something went wrong." };
    }
  };
}

// ─── FormData parsing ───

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

export function form(fd: FormData) {
  return {
    str: (k: string) => str(fd.get(k)),
    opt: (k: string) => str(fd.get(k)) || null,
    num: (k: string) => {
      const s = str(fd.get(k));
      return s === "" ? null : Number(s);
    },
    date: (k: string) => {
      const s = str(fd.get(k));
      return s ? new Date(`${s}T00:00:00Z`) : null;
    },
    bool: (k: string) => fd.get(k) === "on" || fd.get(k) === "true",
    all: (k: string) => fd.getAll(k).map(str).filter(Boolean),
  };
}

export const zText = (max = 200) => z.string().trim().min(1, "Required").max(max);
export const zOptText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .transform((v) => v || null);
export const zEmail = z.email("Enter a valid email").transform((v) => v.toLowerCase());
export const zOptEmail = z
  .union([z.literal(""), z.null(), z.email("Enter a valid email")])
  .transform((v) => (v ? v.toLowerCase() : null));
export const zMoney = z.number({ error: "Enter an amount" }).finite().min(0).max(100_000_000);
