"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabsBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/Overview", label: "Overview" },
    { href: "/kernel-modules", label: "Kernel Modules" },
    { href: "/firewall-rules", label: "Firewall Rules" },
    { href: "/api-interface", label: "API Interface" },
    { href: "/logs-testing", label: "Logs & Testing" },
  ];

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={
                  isActive
                    ? "py-3 border-b-2 border-blue-600 text-blue-600"
                    : "py-3 text-gray-600 hover:text-gray-900"
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


