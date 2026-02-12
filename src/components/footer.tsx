import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-6 text-sm text-text-muted">
      <div className="flex items-center justify-between">
        <a href="https://github.com/tracefinity" className="hover:text-text-primary transition-colors">
          github.com/tracefinity
        </a>
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-text-primary transition-colors">
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  );
}
