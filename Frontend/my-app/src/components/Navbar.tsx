"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/Overview", label: "Overview" },
    { href: "/kernel-modules", label: "Kernel Modules" },
    { href: "/firewall-rules", label: "Firewall Rules" },
    { href: "/api-interface", label: "API Interface" },
    { href: "/logs-testing", label: "Logs & Testing" },
  ];

  const linkCls = (href: string) =>
    pathname === href
      ? "text-[var(--tint)] font-semibold"
      : "text-[var(--secondary)] hover:text-black";

  return (
    <nav className="sticky top-0 z-30 bg-[var(--surface)]/90 backdrop-blur border-b border-[var(--separator)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full border border-[var(--separator)] flex items-center justify-center">
              🔒
            </div>
            <div>
              <div className="text-[13px] text-[var(--secondary)] leading-3">
                Welcome back, Admin User
              </div>
              <h1 className="font-semibold text-[20px] tracking-tight">
                CheckPoint Firewall Dashboard
              </h1>
            </div>
          </div>
          <UserMenu />
        </div>
        <div className="h-12 flex items-center">
          <div className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls(l.href)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

import React from "react";
function UserMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        aria-label="User menu"
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--separator)] text-[var(--secondary)]"
      >
        AU
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 card p-2 text-sm">
          <Link
            href="/Settings"
            className="block px-2 py-2 rounded hover:bg-[var(--background)]"
          >
            Settings
          </Link>
          <Link
            href="/Profile"
            className="block px-2 py-2 rounded hover:bg-[var(--background)]"
          >
            Profile
          </Link>
          <button className="w-full text-left px-2 py-2 rounded text-[var(--secondary)] hover:bg-[var(--background)]">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
