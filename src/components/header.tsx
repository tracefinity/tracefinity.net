import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";

export async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 -mx-6 px-6 backdrop-blur-md bg-base/80 border-b border-white/5">
      <div className="mx-auto max-w-3xl flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <Image src="/icon.svg" alt="" width={28} height={28} className="rounded-md" />
          <span className="text-sm font-semibold text-text-primary tracking-tight">Tracefinity</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          {isLoggedIn ? (
            <>
              <a href="/api/auth/app-token" className="text-text-muted hover:text-text-primary transition-colors">
                Open App
              </a>
              <Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/pricing" className="text-text-muted hover:text-text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-text-muted hover:text-text-primary transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
