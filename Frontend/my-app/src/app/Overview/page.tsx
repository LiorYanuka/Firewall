"use client";
import { useEffect, useState } from "react";
import { config } from "@/config/env";

type RuleDto = {
  id: number;
  type: string;
  mode: string;
  value: string;
  active: boolean;
};

export default function Overview() {
  const [activeRules, setActiveRules] = useState(0);
  const [blockedRules, setBlockedRules] = useState(0);
  const [totalRules, setTotalRules] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/rules`);
        if (res.ok) {
          const data: {
            [k in "ip" | "port" | "url"]?: {
              blacklist?: Array<{
                id: number;
                value: string | number;
                active?: boolean;
              }>;
              whitelist?: Array<{
                id: number;
                value: string | number;
                active?: boolean;
              }>;
            };
          } = await res.json();
          const lists = [
            ...(data.ip?.blacklist || []),
            ...(data.ip?.whitelist || []),
            ...(data.url?.blacklist || []),
            ...(data.url?.whitelist || []),
            ...(data.port?.blacklist || []),
            ...(data.port?.whitelist || []),
          ];
          const active = lists.filter((r) => Boolean(r.active)).length;
          const blocked = lists.filter((r) => !Boolean(r.active)).length;
          setActiveRules(active);
          setBlockedRules(blocked);
          setTotalRules(lists.length);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="text-[13px] text-[var(--secondary)] mb-1">
            Active Modules
          </div>
          <div className="text-3xl font-semibold">3</div>
          <div className="text-[12px] text-[var(--secondary)]">of 4 total</div>
        </div>
        <div className="card p-6">
          <div className="text-[13px] text-[var(--secondary)] mb-1">
            Active Rules
          </div>
          <div className="text-3xl font-semibold">
            {loading ? "—" : activeRules}
          </div>
          <div className="text-[12px] text-[var(--secondary)]">
            of {loading ? "—" : totalRules} total
          </div>
        </div>
        <div className="card p-6">
          <div className="text-[13px] text-[var(--secondary)] mb-1">
            Blocked Rules
          </div>
          <div className="text-3xl font-semibold">
            {loading ? "—" : blockedRules}
          </div>
          <div className="text-[12px] text-[var(--secondary)]">
            inactive in DB
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-[17px] font-semibold mb-4">System Status</h3>
        <div className="space-y-3">
          {[
            {
              name: "simple_module",
              status: "Loaded",
              icon: "✅",
              hook: "N/A",
            },
            {
              name: "netfilter_hooks",
              status: "Loaded",
              icon: "✅",
              hook: "ALL_HOOKS",
            },
            {
              name: "country_blocker",
              status: "Unloaded",
              icon: "⚠️",
              hook: "NF_INET_PRE_ROUTING",
            },
          ].map((m) => (
            <div
              key={m.name}
              className="flex items-center justify-between border border-[var(--separator)] rounded-xl px-4 py-3"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{m.icon}</span>
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-[12px] text-[var(--secondary)]">
                    Hook: {m.hook}
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs border border-[var(--separator)]`}
              >
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
