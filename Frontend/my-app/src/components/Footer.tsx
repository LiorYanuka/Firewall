export default function Footer() {
  return (
    <footer
      className="mt-auto border-t border-[var(--separator)]"
      style={{ background: "var(--surface)", color: "var(--foreground)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
