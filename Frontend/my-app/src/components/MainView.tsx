"use client";

import { useState } from "react";
import AddRuleComponent from "@/components/firewall/AddRuleComponent";
import ExistingRulesComponent from "@/components/firewall/ExistingRulesComponent";

export default function MainView() {
  const [activeTab, setActiveTab] = useState<"add" | "existing">("add");

  return (
    <section className="p-6">
      <h2 className="text-[17px] font-semibold mb-4">Firewall Rules</h2>

      <div className="mb-4">
        <nav className="segmented inline-flex space-x-2">
          <button
            onClick={() => setActiveTab("add")}
            className={`text-sm ${activeTab === "add" ? "active" : ""}`}
          >
            Add New Rule
          </button>
          <button
            onClick={() => setActiveTab("existing")}
            className={`text-sm ${activeTab === "existing" ? "active" : ""}`}
          >
            Existing Rules
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === "add" ? (
          <div className="card p-5">
            <AddRuleComponent />
          </div>
        ) : (
          <div className="card p-5">
            <ExistingRulesComponent />
          </div>
        )}
      </div>
    </section>
  );
}

// 'use client';

// import { usePathname } from 'next/navigation';
// import Overview from '../app/Overview/page';
// import KernelModules from '../app/Kernel Modules/page';
// import FirewallRules from '../app/Firewall Rules/page';
// import ApiInterface from '../app/API Interface/page';
// import LogsTesting from '../app/Logs & Testing/page';

// export default function MainView() {
//   const pathname = usePathname();

//   const renderContent = () => {
//     switch (pathname) {
//       case '/':
//         return <Overview />;
//       case '/Overview':
//         return <Overview />;
//       case '/Kernel%20Modules':
//         return <KernelModules />;
//       case '/Firewall%20Rules':
//         return <FirewallRules />;
//       case '/API%20Interface':
//         return <ApiInterface />;
//       case '/Logs%20%26%20Testing':
//         return <LogsTesting />;
//       default:
//         return <Overview />;
//     }
//   };

//   return (
//     <main className="flex-1 p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {renderContent()}
//       </div>
//     </main>
//   );
// }
