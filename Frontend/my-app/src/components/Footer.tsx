export default function Footer() {
  return (
    <footer className="border-t border-[var(--separator)] bg-white text-black py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <p className="text-xs text-[var(--secondary)]">
          © 2025 Firewall Management System
        </p>
        <div className="flex space-x-6 text-xs text-[var(--secondary)]">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Cookies</span>
        </div>
      </div>
    </footer>
  );
}
