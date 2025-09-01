"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/Overview", label: "Overview" },
    { href: "/kernel-modules", label: "Kernel Modules" },
    { href: "/firewall-rules", label: "Rules" },
    { href: "/api-interface", label: "API" },
    { href: "/logs-testing", label: "Logs" },
    { href: "/Settings", label: "Settings" },
    { href: "/Profile", label: "Profile" },
  ];

  const linkCls = (href: string) =>
    pathname === href
      ? "text-[var(--tint)] font-semibold"
      : "text-[var(--secondary)] hover:text-black";

  return (
    <nav className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-[var(--separator)] text-black">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" aria-label="Home" className="text-xl">
            🏠
          </Link>
          <h1 className="font-semibold text-[17px] tracking-tight">Firewall</h1>
        </div>
        <div className="space-x-6 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls(l.href)}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
