import {
  AlertTriangle,
  ChevronRight,
  Clock3,
  FileText,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

function formatContractType(
  value: string,
): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function formatRiskScore(
  value: number | null,
): string {
  if (value === null) {
    return "—";
  }

  return Number(value).toFixed(1);
}

function getRiskBadgeClass(
  riskLevel: string | null,
): string {
  switch (riskLevel?.toUpperCase()) {
    case "CRITICAL":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";

    case "HIGH":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";

    case "MEDIUM":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";

    case "LOW":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

    default:
      return "border-[#24446C] bg-transparent text-slate-400";
  }
}

function getStatusLabel(
  status: string,
): string {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function DashboardPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useDashboard();

  /*
   * Initial loading state.
   *
   * This is only shown when there is no dashboard
   * data available yet.
   */
  if (isLoading && !data) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <LoaderCircle
            size={20}
            className="animate-spin text-indigo-400"
          />

          <div>
            <p className="text-sm font-medium text-slate-300">
              Loading contract intelligence
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Preparing your workspace insights...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error state.
   */
  if (isError && !data) {
    return (
      <div className="relative min-h-full overflow-hidden">
        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[900px] items-center justify-center px-4 py-8">
          <div className="w-full rounded-2xl border border-rose-500/20 bg-[#071426]/90 p-8 text-center shadow-2xl shadow-black/20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
              <AlertTriangle
                size={21}
                className="text-rose-400"
              />
            </div>

            <h1 className="mt-5 text-base font-semibold text-slate-200">
              Unable to load dashboard
            </h1>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
              We couldn&apos;t retrieve the latest contract
              intelligence data. Your contracts are not affected.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#24446C] bg-[#0B1930] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white"
            >
              <RefreshCw size={14} />

              Try again
            </button>

            {error instanceof Error ? (
              <p className="mx-auto mt-4 max-w-lg truncate text-[10px] text-slate-700">
                {error.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const firstName = getFirstName(
    user?.full_name,
  );

  const hasRiskTrend =
    data.risk_trend.length > 0;

  const hasRiskDistribution =
    data.risk_distribution.low > 0 ||
    data.risk_distribution.medium > 0 ||
    data.risk_distribution.high > 0 ||
    data.risk_distribution.critical > 0;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[520px] rounded-full bg-indigo-600/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-400">
              Contract Intelligence
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {getGreeting()}, {firstName} 👋
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Here&apos;s what&apos;s happening with your
              contracts today.
            </p>
          </div>

          {/* Background refresh indicator */}
          {isFetching ? (
            <div className="hidden items-center gap-2 rounded-full border border-[#173052] bg-[#071426]/80 px-3 py-1.5 text-[10px] text-slate-500 sm:flex">
              <LoaderCircle
                size={12}
                className="animate-spin text-indigo-400"
              />

              Syncing
            </div>
          ) : null}
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
          {/* Risk trend */}
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
              {hasRiskTrend ? (
                <RiskTrendChart
                  data={data.risk_trend}
                />
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-[#173052] bg-[#050F1D]/50 px-6 text-center">
                  <ShieldAlert
                    size={24}
                    className="text-slate-700"
                  />

                  <p className="mt-3 text-xs font-medium text-slate-500">
                    No risk trend available yet
                  </p>

                  <p className="mt-1 max-w-sm text-[11px] leading-5 text-slate-700">
                    Risk activity will appear here once
                    contracts have completed analysis.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Risk distribution */}
          <div className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
            <h2 className="text-sm font-semibold text-slate-200">
              Risk Distribution
            </h2>

            <p className="mt-1 text-[11px] text-slate-600">
              Latest analyzed contract risk
            </p>

            {hasRiskDistribution ? (
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
                ].map(
                  ([label, value, color]) => (
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
                  ),
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-[#173052] px-4 py-8 text-center">
                <p className="text-xs font-medium text-slate-500">
                  No analyzed contracts yet
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-700">
                  Risk distribution will appear after
                  analysis completes.
                </p>
              </div>
            )}
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
            <table className="w-full min-w-[760px]">
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

                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>

              <tbody>
                {data.recent_contracts.length > 0 ? (
                  data.recent_contracts.map(
                    (contract) => (
                      <tr
                        key={contract.id}
                        onClick={() =>
                          navigate(
                            `/contracts/${contract.id}`,
                          )
                        }
                        className="group cursor-pointer border-b border-[#102744] last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500/15">
                              <FileText size={15} />
                            </div>

                            <div className="min-w-0">
                              <span className="block truncate text-xs font-medium text-slate-300 group-hover:text-white">
                                {contract.title}
                              </span>

                              {contract.risk_score === null ? (
                                <span className="mt-0.5 block text-[10px] text-slate-700">
                                  Awaiting analysis
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs text-slate-500">
                          {formatContractType(
                            contract.contract_type,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {contract.risk_score !== null ? (
                            <span className="text-xs font-semibold text-slate-300">
                              {formatRiskScore(
                                contract.risk_score,
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                              <Clock3 size={12} />

                              Pending
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${getRiskBadgeClass(
                              contract.risk_level,
                            )}`}
                          >
                            {contract.risk_level
                              ? contract.risk_level
                              : getStatusLabel(
                                  contract.status,
                                )}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-xs text-slate-600">
                          {new Date(
                            contract.updated_at,
                          ).toLocaleDateString(
                            undefined,
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>

                        <td className="px-3 py-4">
                          <ChevronRight
                            size={15}
                            className="text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-indigo-400"
                          />
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12"
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
                          <FileText
                            size={19}
                            className="text-indigo-400"
                          />
                        </div>

                        <p className="mt-4 text-xs font-medium text-slate-400">
                          No contracts yet
                        </p>

                        <p className="mt-1 max-w-sm text-[11px] leading-5 text-slate-700">
                          Upload your first contract to
                          start analyzing risk, findings,
                          and compliance signals.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            navigate("/upload")
                          }
                          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-2 text-[11px] font-semibold text-indigo-300 transition hover:bg-indigo-500/15 hover:text-indigo-200"
                        >
                          <FileText size={13} />

                          Upload Contract
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workspace status */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#173052] bg-[#071426]/60 px-5 py-4">
          <Clock3
            size={17}
            className="text-indigo-400"
          />

          <div>
            <p className="text-xs text-slate-500">
              AI-powered contract review is active for
              this workspace.
            </p>

            {data.pending_analysis > 0 ? (
              <p className="mt-1 text-[10px] text-amber-500/70">
                {data.pending_analysis} contract
                {data.pending_analysis === 1
                  ? ""
                  : "s"} currently being analyzed.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;