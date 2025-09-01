export default function Overview() {
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
          <div className="text-3xl font-semibold">2</div>
          <div className="text-[12px] text-[var(--secondary)]">of 3 total</div>
        </div>
        <div className="card p-6">
          <div className="text-[13px] text-[var(--secondary)] mb-1">
            Blocked Packets
          </div>
          <div className="text-3xl font-semibold">1,247</div>
          <div className="text-[12px] text-[var(--secondary)]">
            last 24 hours
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
              color: "text-green-600",
              icon: "✅",
              hook: "N/A",
            },
            {
              name: "netfilter_hooks",
              status: "Loaded",
              color: "text-green-600",
              icon: "✅",
              hook: "ALL_HOOKS",
            },
            {
              name: "country_blocker",
              status: "Unloaded",
              color: "text-yellow-600",
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
