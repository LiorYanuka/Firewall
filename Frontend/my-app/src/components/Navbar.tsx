import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <h1 className="font-bold text-lg">Firewall</h1>
      <div className="space-x-4">
        <Link href="/" className="hover:text-gray-300 transition-colors" aria-label="Home">🏠</Link>
        <Link href="/Overview" className="hover:text-gray-300 transition-colors">Overview</Link>
        <Link href="/kernel-modules" className="hover:text-gray-300 transition-colors">Kernel Modules</Link>
        <Link href="/firewall-rules" className="hover:text-gray-300 transition-colors">Firewall Rules</Link>
        <Link href="/api-interface" className="hover:text-gray-300 transition-colors">API Interface</Link>
        <Link href="/logs-testing" className="hover:text-gray-300 transition-colors">Logs & Testing</Link>
        <Link href="/Settings" className="hover:text-gray-300 transition-colors">Settings</Link>
        <Link href="/Profile" className="hover:text-gray-300 transition-colors">Profile</Link>
      </div>
    </nav>
  );
}