"use client";

import { useEffect, useState } from "react";
import { config } from "@/config/env";

type LogEntry = {
  level: "INFO" | "ERROR" | "BLOCK" | "SUCCESS";
  message: string;
  time?: string;
};

export default function LogsTesting() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [busy, setBusy] = useState(false);

  const MAX_LOGS = 100;
  const pushLog = (entry: LogEntry) =>
    setLogs((prev) => [entry, ...prev].slice(0, MAX_LOGS));

  const loadLogs = async () => {
    try {
      // For demo: build logs from rules endpoint; in real app, hit a /logs endpoint
      const res = await fetch(`${config.apiBaseUrl}/rules`);
      if (res.ok) {
        const data = await res.json();
        const entries: LogEntry[] = [];
        ["ip", "url", "port"].forEach((type) => {
          ["blacklist", "whitelist"].forEach((mode) => {
            (data?.[type]?.[mode] || []).forEach((r: any) => {
              entries.push({
                level: r.active ? "INFO" : "BLOCK",
                message: `${type.toUpperCase()} ${String(r.value)} in ${mode} ${
                  r.active ? "(active)" : "(inactive)"
                }`,
              });
            });
          });
        });
        setLogs(entries.slice(0, 100));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const clearLogs = () => setLogs([]);
  const exportLogs = () => {
    const blob = new Blob(
      [
        logs
          .map(
            (l) =>
              `[${new Date().toLocaleTimeString()}] [${l.level}] ${l.message}`
          )
          .join("\n"),
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "firewall-logs.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const runIpTest = async () => {
    setBusy(true);
    try {
      const testIp = "192.168.1.100";
      const res = await fetch(`${config.apiBaseUrl}/ip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: [testIp], mode: "whitelist" }),
      });
      pushLog({
        level: res.ok ? "SUCCESS" : "ERROR",
        message: res.ok
          ? `IP ${testIp} whitelisted via test`
          : "IP test failed",
      });
    } finally {
      setBusy(false);
    }
  };

  const runUrlTest = async () => {
    setBusy(true);
    try {
      const url = "example.com";
      const res = await fetch(`${config.apiBaseUrl}/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: [url], mode: "blacklist" }),
      });
      pushLog({
        level: res.ok ? "SUCCESS" : "ERROR",
        message: res.ok ? `URL ${url} blacklisted via test` : "URL test failed",
      });
    } finally {
      setBusy(false);
    }
  };

  const runPortTest = async () => {
    setBusy(true);
    try {
      const port = 22;
      const res = await fetch(`${config.apiBaseUrl}/port`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: [port], mode: "whitelist" }),
      });
      pushLog({
        level: res.ok ? "SUCCESS" : "ERROR",
        message: res.ok
          ? `Port ${port} whitelisted via test`
          : "Port test failed",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="p-6 space-y-8">
      <div>
        <h2 className="text-[17px] font-semibold mb-2">System Logs</h2>
        <p className="text-[12px] text-[var(--secondary)] mb-3">
          Real-time logs from kernel modules and firewall operations
        </p>
        <div className="border border-[var(--separator)] rounded-md overflow-hidden">
          <div
            className="max-h-72 overflow-auto divide-y divide-[var(--separator)]"
            style={{ background: "var(--surface)" }}
          >
            {logs.length === 0 ? (
              <div className="px-3 py-2 text-[var(--secondary)]">
                No logs yet
              </div>
            ) : (
              logs.map((l, i) => (
                <div key={i} className="px-3 py-2 text-sm">
                  <span
                    className={
                      l.level === "ERROR"
                        ? "text-red-600"
                        : l.level === "SUCCESS"
                        ? "text-green-600"
                        : "text-[var(--secondary)]"
                    }
                  >
                    [{new Date().toLocaleTimeString()}] [{l.level}]
                  </span>{" "}
                  {l.message}
                </div>
              ))
            )}
          </div>
          <div className="flex items-center space-x-2 p-2 bg-[var(--surface)] border-t border-[var(--separator)]">
            <button
              onClick={clearLogs}
              className="px-3 py-1 rounded-md border border-[var(--separator)] text-sm"
            >
              Clear Logs
            </button>
            <button
              onClick={exportLogs}
              className="px-3 py-1 rounded-md border border-[var(--separator)] text-sm"
            >
              Export Logs
            </button>
            <button
              onClick={loadLogs}
              className="px-3 py-1 rounded-md bg-white text-black hover:bg-gray-200 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[17px] font-semibold mb-3">Testing Scenarios</h3>
        <p className="text-[12px] text-[var(--secondary)] mb-4">
          Predefined tests to validate firewall functionality
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TestCard
            title="Add IP (whitelist)"
            desc="POST /ip {values:['192.168.1.100'], mode:'whitelist'}"
            onRun={runIpTest}
            busy={busy}
          />
          <TestCard
            title="Add URL (blacklist)"
            desc="POST /url {values:['https://example.com'], mode:'blacklist'}"
            onRun={runUrlTest}
            busy={busy}
          />
          <TestCard
            title="Add Port (whitelist)"
            desc="POST /port {values:[80], mode:'whitelist'}"
            onRun={runPortTest}
            busy={busy}
          />
          <TestCard
            title="Happy Flow (add → toggle)"
            desc="Runs add/retrieve/toggle like system.happy.test.ts"
            onRun={async () => {
              setBusy(true);
              try {
                await runIpTest();
                await fetch(`${config.apiBaseUrl}/rules`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ips: { values: ["192.168.1.100"], active: false },
                  }),
                });
                pushLog({ level: "INFO", message: "Toggled IP to inactive" });
              } finally {
                setBusy(false);
              }
            }}
            busy={busy}
          />
        </div>
      </div>
    </section>
  );
}

function TestCard({
  title,
  desc,
  onRun,
  busy,
}: {
  title: string;
  desc: string;
  onRun: () => void;
  busy: boolean;
}) {
  return (
    <div className="card p-4">
      <div className="font-medium mb-1">{title}</div>
      <div className="text-[12px] text-[var(--secondary)] mb-3">{desc}</div>
      <button
        onClick={onRun}
        disabled={busy}
        className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200 disabled:opacity-50"
      >
        Run Test
      </button>
    </div>
  );
}
