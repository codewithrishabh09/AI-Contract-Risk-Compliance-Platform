import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ShieldAlert,
} from "lucide-react";

function DashboardPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[520px] rounded-full bg-indigo-600/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-400">
              <Activity size={13} />
              Contract Intelligence
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Good morning, Rishabh
              <span className="ml-2">👋</span>
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Here&apos;s what&apos;s happening with your contracts today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <CalendarDays size={15} />
              Oct 26, 2026
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/15"
            >
              <ShieldAlert size={14} />
              Review risks
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>

        {/* Placeholder KPI area */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total Contracts", "42"],
            ["High Risk Contracts", "8"],
            ["Critical Findings", "3"],
            ["Pending Analysis", "6"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5"
            >
              <div className="text-xs text-slate-500">
                {label}
              </div>

              <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {value}
              </div>

              <div className="mt-2 text-[11px] text-emerald-400">
                +12% vs last 7 days
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;