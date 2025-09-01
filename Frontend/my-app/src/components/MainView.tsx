"use client";

import { useState } from "react";
import AddRuleComponent from "@/components/firewall/AddRuleComponent";
import ExistingRulesComponent from "@/components/firewall/ExistingRulesComponent";

export default function MainView() {
  const [activeTab, setActiveTab] = useState<"add" | "existing">("add");

  return (
    <section className="p-6">
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
