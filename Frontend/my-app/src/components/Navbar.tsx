import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <h1 className="font-bold text-lg">Firewall</h1>
      <div className="space-x-4">
        <Link href="/" className="hover:text-gray-300 transition-colors">Logo</Link>
        <Link href="/Overview" className="hover:text-gray-300 transition-colors">Overview</Link>
        <Link href="/Kernel%20Modules" className="hover:text-gray-300 transition-colors">Kernel Modules</Link>
        <Link href="/Firewall%20Rules" className="hover:text-gray-300 transition-colors">Firewall Rules</Link>
        <Link href="/API%20Interface" className="hover:text-gray-300 transition-colors">API Interface</Link>
        <Link href="/Logs%20%26%20Testing" className="hover:text-gray-300 transition-colors">Logs & Testing</Link>
      </div>
    </nav>
  );
}