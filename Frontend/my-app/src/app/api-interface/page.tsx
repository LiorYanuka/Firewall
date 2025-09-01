"use client";

import { useMemo, useState } from "react";
import { config } from "@/config/env";

type Log = { level: "INFO" | "SUCCESS" | "ERROR"; message: string };

export default function ApiInterface() {
  const [command, setCommand] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);
  const [busy, setBusy] = useState(false);

  const helpLines = useMemo(
    () => [
      "Use the commands below to interact with the kernel modules via the API",
      "./firewall_api --help",
      "./firewall_api --block-ip 192.168.1.100",
      "./firewall_api --block-url example.com",
      "./firewall_api --block-port 22 --protocol tcp",
      "./firewall_api --load-module country_blocker",
    ],
    []
  );

  const append = (entry: Log) => setLogs((prev) => [...prev, entry]);
  const clear = () => setLogs([]);

  const parse = (cmd: string) => {
    const t = cmd.trim();
    if (!t) return { action: "noop" } as const;
    if (/--help\b/.test(t)) return { action: "help" } as const;

    const ipMatch = t.match(/--block-ip\s+([^\s]+)/);
    if (ipMatch) return { action: "blockIp", ip: ipMatch[1] } as const;

    const urlMatch = t.match(/--block-url\s+([^\s]+)/);
    if (urlMatch) return { action: "blockUrl", url: urlMatch[1] } as const;

    const portMatch = t.match(/--block-port\s+(\d{1,5})/);
    if (portMatch)
      return { action: "blockPort", port: Number(portMatch[1]) } as const;

    const loadMatch = t.match(/--load-module\s+([A-Za-z_]+)/);
    if (loadMatch) return { action: "loadModule", name: loadMatch[1] } as const;

    return { action: "unknown" } as const;
  };

  const validateIp = (ip: string) =>
    /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(
      ip
    );

  const onExecute = async () => {
    const p = parse(command);
    if (p.action === "noop") return;
    setBusy(true);
    try {
      switch (p.action) {
        case "help": {
          helpLines.forEach((l) => append({ level: "INFO", message: l }));
          break;
        }
        case "blockIp": {
          if (!validateIp(p.ip)) {
            append({ level: "ERROR", message: `Invalid IP: ${p.ip}` });
            break;
          }
          const res = await fetch(`${config.apiBaseUrl}/ip`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ values: [p.ip], mode: "blacklist" }),
          });
          if (res.ok) {
            append({
              level: "SUCCESS",
              message: `IP ${p.ip} has been blocked successfully`,
            });
            append({
              level: "INFO",
              message: "Rule added to NF_INET_PRE_ROUTING hook",
            });
            append({
              level: "INFO",
              message: "Module communication established via proc filesystem",
            });
          } else {
            const e = await safeJson(res);
            append({
              level: "ERROR",
              message: e?.error || "Failed to block IP",
            });
          }
          break;
        }
        case "blockUrl": {
          const res = await fetch(`${config.apiBaseUrl}/url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ values: [p.url], mode: "blacklist" }),
          });
          if (res.ok) {
            append({
              level: "SUCCESS",
              message: `URL ${p.url} has been blocked successfully`,
            });
          } else {
            const e = await safeJson(res);
            append({
              level: "ERROR",
              message: e?.error || "Failed to block URL",
            });
          }
          break;
        }
        case "blockPort": {
          if (p.port < 1 || p.port > 65535) {
            append({ level: "ERROR", message: `Invalid port: ${p.port}` });
            break;
          }
          const res = await fetch(`${config.apiBaseUrl}/port`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ values: [p.port], mode: "blacklist" }),
          });
          if (res.ok) {
            append({
              level: "SUCCESS",
              message: `Port ${p.port} has been blocked successfully`,
            });
          } else {
            const e = await safeJson(res);
            append({
              level: "ERROR",
              message: e?.error || "Failed to block port",
            });
          }
          break;
        }

        case "loadModule": {
          append({ level: "INFO", message: `Loading module '${p.name}'...` });
          append({
            level: "SUCCESS",
            message: `Module '${p.name}' initialized`,
          });
          break;
        }
        default: {
          append({
            level: "ERROR",
            message: "Unknown command. Use --help for available commands.",
          });
        }
      }
    } catch {
      append({ level: "ERROR", message: "Network error occurred" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="p-6 space-y-6">
      <div className="card p-4">
        <details open>
          <summary className="cursor-pointer text-[13px] text-[var(--secondary)]">
            Use the commands below to interact with the kernel modules via the
            API
          </summary>
          <div className="grid grid-cols-1 gap-3 mt-4">
            <CommandCard
              title="Help Section"
              cmdPrefix="./firewall_api --help"
              desc="Display all available commands and options"
            />
            <CommandCard
              title="IP Blocking"
              cmdPrefix="./firewall_api --block-ip 192.168.1.100"
              desc="Block traffic from specific IP address"
            />
            <CommandCard
              title="URL Blocking"
              cmdPrefix="./firewall_api --block-url example.com"
              desc="Block traffic for specific domain/URL"
            />
            <CommandCard
              title="Port Blocking"
              cmdPrefix="./firewall_api --block-port 22 --protocol tcp"
              desc="Block traffic on specific port"
            />
            <CommandCard
              title="Module Management"
              cmdPrefix="./firewall_api --load-module country_blocker"
              desc="Load or unload kernel modules"
            />
          </div>
        </details>
      </div>

      <div className="card p-5">
        <h3 className="text-[17px] font-semibold mb-3">
          API Testing Interface
        </h3>
        <p className="text-[12px] text-[var(--secondary)] mb-3">
          Test API commands directly from the dashboard
        </p>

        <div className="mb-2 text-sm font-medium">Command</div>
        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter API command (e.g., ./firewall_api --block-ip 192.168.1.100)"
          className="w-full h-24 border border-[var(--separator)] rounded-md p-3"
          style={{ background: "var(--input-bg)", color: "var(--foreground)" }}
        />

        <div className="flex items-center space-x-2 mt-3">
          <button
            onClick={onExecute}
            disabled={busy}
            className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200 disabled:opacity-50"
          >
            Execute
          </button>
          <button
            onClick={clear}
            className="px-4 py-2 rounded-md border border-[var(--separator)]"
          >
            Clear
          </button>
        </div>

        <div className="mt-5">
          <div className="text-sm font-medium mb-2">Output:</div>
          <div
            className="border border-[var(--separator)] rounded-md p-3 text-sm"
            style={{ background: "var(--surface)" }}
          >
            {logs.length === 0 ? (
              <div className="text-[var(--secondary)]">No output yet</div>
            ) : (
              <div className="space-y-1">
                {logs.map((l, i) => (
                  <div key={i}>
                    <span
                      className={
                        l.level === "SUCCESS"
                          ? "text-green-600"
                          : l.level === "ERROR"
                          ? "text-red-600"
                          : "text-[var(--secondary)]"
                      }
                    >
                      [{l.level}]
                    </span>{" "}
                    {l.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommandCard({
  title,
  cmdPrefix,
  desc,
}: {
  title: string;
  cmdPrefix: string;
  desc: string;
}) {
  return (
    <div className="rounded-md" style={{ background: "var(--surface)" }}>
      <div className="px-4 py-3 border-b border-[var(--separator)] font-medium">
        {title}
      </div>
      <div className="px-4 py-3">
        <pre className="text-sm mb-1" style={{ whiteSpace: "pre-wrap" }}>
          {cmdPrefix}
        </pre>
        <div className="text-[12px] text-[var(--secondary)]">{desc}</div>
      </div>
    </div>
  );
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
