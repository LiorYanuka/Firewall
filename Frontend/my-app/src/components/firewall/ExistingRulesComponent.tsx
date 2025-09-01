"use client";

import { useState, useEffect } from "react";
import { config } from "@/config/env";

interface Rule {
  id: number;
  type: "ip" | "port" | "url";
  mode: "whitelist" | "blacklist";
  value: string;
  active: boolean;
  createdAt?: string;
}

export default function ExistingRulesComponent() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.serverUrl}/rules`);
      if (response.ok) {
        const data = await response.json();
        setRules(data.rules || []);
      } else {
        setError("Failed to fetch rules");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRule = async (ruleId: number, currentActive: boolean) => {
    try {
      const response = await fetch(`${config.serverUrl}/rules`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ruleId,
          active: !currentActive,
        }),
      });

      if (response.ok) {
        setRules((prev) =>
          prev.map((rule) =>
            rule.id === ruleId ? { ...rule, active: !currentActive } : rule
          )
        );
      } else {
        setError("Failed to update rule");
      }
    } catch {
      setError("Network error occurred");
    }
  };

  const deleteRule = async (ruleId: number, ruleType: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      const endpoint =
        ruleType === "ip"
          ? "/ip/remove"
          : ruleType === "port"
          ? "/port/remove"
          : "/url/remove";

      const response = await fetch(`${config.serverUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ruleId,
        }),
      });

      if (response.ok) {
        setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
      } else {
        setError("Failed to delete rule");
      }
    } catch {
      setError("Network error occurred");
    }
  };

  const filteredRules = rules.filter((rule) => {
    if (filter === "all") return true;
    if (filter === "active") return rule.active;
    if (filter === "inactive") return !rule.active;
    return true;
  });

  const getModeColor = (mode: string) => {
    return mode === "whitelist"
      ? "bg-gray-800 text-white"
      : "bg-black text-white";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ip":
        return "🌐";
      case "port":
        return "🔌";
      case "url":
        return "🔗";
      default:
        return "📋";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading rules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[17px] font-semibold">Existing Rules</h3>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "active" | "inactive")
            }
            className="px-3 py-1 border border-gray-700 bg-black text-white rounded-md text-sm"
          >
            <option value="all">All Rules</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <button
            onClick={fetchRules}
            className="px-3 py-1 bg-white text-black rounded-md text-sm hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      {filteredRules.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filter === "all" ? "No rules found" : `No ${filter} rules found`}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 border rounded-lg ${
                rule.active
                  ? "border-gray-700 bg-black text-white"
                  : "border-gray-200 bg-white text-black"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getTypeIcon(rule.type)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{rule.value}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(
                          rule.mode
                        )}`}
                      >
                        {rule.mode}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.active
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {rule.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Type: {rule.type.toUpperCase()}
                      {rule.createdAt &&
                        ` • Created: ${new Date(
                          rule.createdAt
                        ).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleRule(rule.id, rule.active)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      rule.active
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-gray-900"
                    }`}
                  >
                    {rule.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id, rule.type)}
                    className="px-3 py-1 bg-white text-red-600 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
