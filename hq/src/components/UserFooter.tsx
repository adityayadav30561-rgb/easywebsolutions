import Link from "next/link";
import { logout } from "@/app/auth-actions";
import { Avatar } from "./ui";

export function UserFooter({ name, email, isPlatformAdmin, canSwitch }: { name: string; email: string; isPlatformAdmin: boolean; canSwitch: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-3 px-3 py-2">
        <Avatar name={name} size={30} />
        <div className="min-w-0">
          <p className="truncate text-sm text-white">{name}</p>
          <p className="truncate text-xs text-white/45">{email}</p>
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-1 px-1">
        {canSwitch && (
          <Link href="/select-org" className="rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white">
            Switch
          </Link>
        )}
        {isPlatformAdmin && (
          <Link href="/admin" className="rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white">
            Platform admin
          </Link>
        )}
        <Link href="/account" className="rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white">
          Account
        </Link>
        <form action={logout}>
          <button type="submit" className="rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
