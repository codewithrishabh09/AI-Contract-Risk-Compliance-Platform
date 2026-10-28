import {
  AlertTriangle,
  Clock3,
  FileText,
  LoaderCircle,
  ShieldAlert,
} from "lucide-react";

import MetricCard from "../../components/ui/MetricCard";
import RiskTrendChart from "../../components/dashboard/RiskTrendChart";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../features/dashboard/useDashboard";

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getFirstName(fullName?: string): string {
  if (!fullName?.trim()) {
    return "there";
  }

  return fullName.trim().split(/\s+/)[0];
}

function DashboardPage() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <LoaderCircle
            size={18}
            className="animate-spin text-indigo-400"
          />

          Loading contract intelligence...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle
              size={18}
              className="text-rose-400"
            />

            <div>
              <h2 className="text-sm font-semibold text-rose-300">
                Unable to load dashboard
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const firstName = getFirstName(user?.full_name);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[520px] rounded-full bg-indigo-600/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-400">
            Contract Intelligence
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {getGreeting()}, {firstName} 👋
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your contracts today.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Contracts"
            value={data.total_contracts}
            description="contracts in workspace"
          />

          <MetricCard
            label="High Risk Contracts"
            value={data.high_risk_contracts}
            description="requires attention"
          />

          <MetricCard
            label="Critical Findings"
            value={data.critical_findings}
            description="open critical issues"
          />

          <MetricCard
            label="Pending Analysis"
            value={data.pending_analysis}
            description="currently processing"
          />
        </div>

        {/* Risk summary */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">
                  Risk Overview
                </h2>

                <p className="mt-1 text-[11px] text-slate-600">
                  Contract risk activity
                </p>
              </div>

              <ShieldAlert
                size={17}
                className="text-indigo-400"
              />
            </div>

            <div className="mt-6">
              <RiskTrendChart data={data.risk_trend} />
            </div>
          </div>

          <div className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
            <h2 className="text-sm font-semibold text-slate-200">
              Risk Distribution
            </h2>

            <div className="mt-6 space-y-4">
              {[
                [
                  "Low",
                  data.risk_distribution.low,
                  "bg-emerald-400",
                ],
                [
                  "Medium",
                  data.risk_distribution.medium,
                  "bg-amber-400",
                ],
                [
                  "High",
                  data.risk_distribution.high,
                  "bg-orange-400",
                ],
                [
                  "Critical",
                  data.risk_distribution.critical,
                  "bg-rose-500",
                ],
              ].map(([label, value, color]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${color}`}
                    />

                    <span className="text-xs text-slate-400">
                      {label}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent contracts */}
        <div className="mt-6 overflow-hidden rounded-xl border border-[#173052] bg-[#071426]/80">
          <div className="flex items-center justify-between border-b border-[#173052] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">
                Recent Contracts
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                Latest activity in your organization
              </p>
            </div>

            <FileText
              size={17}
              className="text-indigo-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#173052] text-left">
                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    Contract
                  </th>

                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    Type
                  </th>

                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    Risk
                  </th>

                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    Status
                  </th>

                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    Updated
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.recent_contracts.length > 0 ? (
                  data.recent_contracts.map((contract) => (
                    <tr
                      key={contract.id}
                      className="border-b border-[#102744] last:border-0 hover:bg-white/[0.015]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            <FileText size={15} />
                          </div>

                          <span className="text-xs font-medium text-slate-300">
                            {contract.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {contract.contract_type}
                      </td>

                      <td className="px-5 py-4">
                        {contract.risk_score !== null ? (
                          <span className="text-xs font-semibold text-slate-300">
                            {contract.risk_score}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full border border-[#24446C] px-2.5 py-1 text-[10px] text-slate-400">
                          {contract.risk_level ?? contract.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-600">
                        {new Date(
                          contract.updated_at,
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-xs text-slate-600"
                    >
                      No contracts available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review time */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#173052] bg-[#071426]/60 px-5 py-4">
          <Clock3
            size={17}
            className="text-indigo-400"
          />

          <span className="text-xs text-slate-500">
            AI-powered contract review is active for this workspace.
          </span>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;