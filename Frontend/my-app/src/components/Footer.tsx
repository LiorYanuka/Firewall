export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Firewall Management System</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Advanced firewall configuration and monitoring system with real-time rule management, 
              comprehensive logging, and API integration capabilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/Overview" className="text-gray-300 hover:text-white transition-colors">Overview</a></li>
              <li><a href="/Firewall%20Rules" className="text-gray-300 hover:text-white transition-colors">Rules</a></li>
              <li><a href="/API%20Interface" className="text-gray-300 hover:text-white transition-colors">API</a></li>
              <li><a href="/Logs%20%26%20Testing" className="text-gray-300 hover:text-white transition-colors">Logs</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">Documentation</li>
              <li className="text-gray-300">API Reference</li>
              <li className="text-gray-300">Contact Support</li>
              <li className="text-gray-300">GitHub</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Firewall Management System. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
