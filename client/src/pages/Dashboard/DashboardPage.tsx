import {
  AlertTriangle,
  ArrowRight,
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
      return "border-[#e8412c]/20 bg-[#fbe4df] text-[#d74430]";

    case "HIGH":
      return "border-[#e8412c]/20 bg-[#fbe4df] text-[#d74430]";

    case "MEDIUM":
      return "border-[#e9b36d]/30 bg-[#fff0dc] text-[#c27624]";

    case "LOW":
      return "border-[#9caf88]/30 bg-[#e5eadf] text-[#557046]";

    default:
      return "border-[#dddcd3] bg-[#f4f3ed] text-[#687268]";
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
   */
  if (isLoading && !data) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f7f5ef]">
        <div className="flex flex-col items-center gap-3 text-center">
          <LoaderCircle
            size={22}
            className="animate-spin text-[#718060]"
          />

          <div>
            <p className="text-sm font-semibold text-[#243027]">
              Loading contract intelligence
            </p>

            <p className="mt-1 text-xs text-[#7a8379]">
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
      <div className="relative min-h-full overflow-hidden bg-[#f7f5ef]">
        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[900px] items-center justify-center px-4 py-8 sm:px-6">
          <div
            className="
              w-full
              rounded-[22px]
              border border-[#dddcd3]
              bg-[#fffefa]
              p-8 text-center
              shadow-[0_18px_45px_rgba(36,48,39,0.07)]
            "
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fbe4df]">
              <AlertTriangle
                size={21}
                className="text-[#e8412c]"
              />
            </div>

            <h1 className="mt-5 font-['Playfair_Display'] text-xl font-semibold text-[#243027]">
              Unable to load dashboard
            </h1>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#7a8379]">
              We couldn&apos;t retrieve the latest contract
              intelligence data. Your contracts are not affected.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="
                mt-6 inline-flex items-center gap-2
                rounded-full
                bg-[#e8412c]
                px-5 py-2.5
                text-xs font-semibold text-white
                shadow-[0_8px_20px_rgba(232,65,44,0.18)]
                transition
                hover:bg-[#d83b28]
              "
            >
              <RefreshCw size={14} />

              Try again
            </button>

            {error instanceof Error ? (
              <p className="mx-auto mt-4 max-w-lg truncate text-[10px] text-[#a0a69f]">
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
    <div className="min-h-full bg-[#f7f5ef]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[620px] rounded-full bg-[#9caf88]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 xl:px-9">
          {/* Hero */}
          <section
            className="
              relative min-h-[238px]
              overflow-hidden
              rounded-[18px]
              border border-[#d9dacd]
              bg-[#e9e8da]
              shadow-[0_12px_35px_rgba(36,48,39,0.05)]
            "
          >
            <div
              className="
                absolute inset-0
                bg-cover bg-center
              "
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1649653084130-06638e40ca25?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=82&w=1600')",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#efeee2]/[0.98] via-[#efeee2]/[0.88] to-[#efeee2]/[0.18]" />

            <div className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-transparent via-[#9caf88]/[0.10] to-transparent" />

            <div className="relative z-10 flex min-h-[238px] items-center px-6 py-8 sm:px-8 lg:px-9">
              <div className="max-w-[680px]">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#43513f]">
                  Contract Intelligence
                </div>

                <h1
                  className="
                    font-['Playfair_Display']
                    text-[32px] font-semibold
                    leading-[1.08]
                    tracking-[-0.035em]
                    text-[#182019]
                    sm:text-[38px]
                    lg:text-[42px]
                  "
                >
                  {getGreeting()}, {firstName} 👋
                </h1>

                <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#4f594f] sm:text-[15px]">
                  Here&apos;s what&apos;s happening with your
                  contracts today.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/upload")}
                    className="
                      inline-flex items-center gap-2
                      rounded-full
                      bg-[#e8412c]
                      px-5 py-2.5
                      text-xs font-semibold text-white
                      shadow-[0_8px_22px_rgba(232,65,44,0.20)]
                      transition
                      hover:bg-[#d83b28]
                      hover:shadow-[0_10px_25px_rgba(232,65,44,0.25)]
                    "
                  >
                    Analyze New Contract
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/contracts")}
                    className="
                      inline-flex items-center gap-2
                      rounded-full
                      border border-[#e8412c]
                      bg-[#fffefa]/70
                      px-5 py-2.5
                      text-xs font-semibold text-[#243027]
                      transition
                      hover:bg-[#fffefa]
                    "
                  >
                    View All Contracts
                  </button>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 right-0 h-[74px] w-[180px] -skew-x-[28deg] translate-x-10 bg-[#e8412c]" />
          </section>

          {/* Metrics */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          </section>

          {/* Risk + distribution */}
          <section className="mt-6 grid gap-4 lg:grid-cols-3">
            <div
              className="
                rounded-[18px]
                border border-[#dddcd3]
                bg-[#fffefa]
                p-5
                shadow-[0_10px_30px_rgba(36,48,39,0.045)]
                lg:col-span-2
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5eadf]">
                    <ShieldAlert
                      size={17}
                      className="text-[#718060]"
                    />
                  </div>

                  <div>
                    <h2 className="font-['Playfair_Display'] text-[18px] font-semibold text-[#243027]">
                      Risk Overview
                    </h2>

                    <p className="mt-1 text-[11px] text-[#7a8379]">
                      Contract risk activity
                    </p>
                  </div>
                </div>

                {isFetching ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f2eb] px-2.5 py-1 text-[10px] font-medium text-[#718060]">
                    <LoaderCircle
                      size={11}
                      className="animate-spin"
                    />
                    Syncing
                  </div>
                ) : null}
              </div>

              <div className="mt-5">
                {hasRiskTrend ? (
                  <RiskTrendChart
                    data={data.risk_trend}
                  />
                ) : (
                  <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[14px] border border-dashed border-[#d8d9d0] bg-[#faf9f5] px-6 text-center">
                    <ShieldAlert
                      size={24}
                      className="text-[#9aa196]"
                    />

                    <p className="mt-3 text-xs font-semibold text-[#687268]">
                      No risk trend available yet
                    </p>

                    <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#8a9188]">
                      Risk activity will appear here once
                      contracts have completed analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Distribution */}
            <div
              className="
                rounded-[18px]
                border border-[#dddcd3]
                bg-[#fffefa]
                p-5
                shadow-[0_10px_30px_rgba(36,48,39,0.045)]
              "
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5eadf]">
                  <ShieldAlert
                    size={17}
                    className="text-[#718060]"
                  />
                </div>

                <div>
                  <h2 className="font-['Playfair_Display'] text-[18px] font-semibold text-[#243027]">
                    Risk Distribution
                  </h2>

                  <p className="mt-1 text-[11px] text-[#7a8379]">
                    Latest analyzed contract risk
                  </p>
                </div>
              </div>

              {hasRiskDistribution ? (
                <div className="mt-7 space-y-5">
                  {[
                    [
                      "Low",
                      data.risk_distribution.low,
                      "bg-[#718060]",
                    ],
                    [
                      "Medium",
                      data.risk_distribution.medium,
                      "bg-[#e9a15a]",
                    ],
                    [
                      "High",
                      data.risk_distribution.high,
                      "bg-[#e8412c]",
                    ],
                    [
                      "Critical",
                      data.risk_distribution.critical,
                      "bg-[#b83225]",
                    ],
                  ].map(
                    ([label, value, color]) => (
                      <div
                        key={label as string}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${color}`}
                          />

                          <span className="text-xs text-[#687268]">
                            {label}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-[#243027]">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="mt-7 rounded-[14px] border border-dashed border-[#d8d9d0] bg-[#faf9f5] px-4 py-8 text-center">
                  <p className="text-xs font-semibold text-[#687268]">
                    No analyzed contracts yet
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#8a9188]">
                    Risk distribution will appear after
                    analysis completes.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Contracts */}
          <section
            className="
              mt-6 overflow-hidden
              rounded-[18px]
              border border-[#dddcd3]
              bg-[#fffefa]
              shadow-[0_10px_30px_rgba(36,48,39,0.045)]
            "
          >
            <div className="flex items-center justify-between border-b border-[#e7e5dc] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5eadf]">
                  <FileText
                    size={17}
                    className="text-[#718060]"
                  />
                </div>

                <div>
                  <h2 className="font-['Playfair_Display'] text-[18px] font-semibold text-[#243027]">
                    Recent Contracts
                  </h2>

                  <p className="mt-1 text-[11px] text-[#7a8379]">
                    Latest activity in your organization
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/contracts")}
                className="
                  hidden items-center gap-1.5
                  text-xs font-semibold text-[#e8412c]
                  transition hover:text-[#c93626]
                  sm:inline-flex
                "
              >
                View All
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#e7e5dc] text-left">
                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a9188]">
                      Contract
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a9188]">
                      Type
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a9188]">
                      Risk
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a9188]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a9188]">
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
                          className="
                            group cursor-pointer
                            border-b border-[#eeece4]
                            last:border-0
                            transition-colors
                            hover:bg-[#f7f8f3]
                          "
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="
                                  flex h-9 w-9 shrink-0
                                  items-center justify-center
                                  rounded-[10px]
                                  border border-[#dce3d5]
                                  bg-[#edf1e9]
                                  text-[#718060]
                                  transition
                                  group-hover:bg-[#e5eadf]
                                "
                              >
                                <FileText size={15} />
                              </div>

                              <div className="min-w-0">
                                <span className="block truncate text-xs font-semibold text-[#334036]">
                                  {contract.title}
                                </span>

                                {contract.risk_score === null ? (
                                  <span className="mt-0.5 block text-[10px] text-[#9aa196]">
                                    Awaiting analysis
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-xs text-[#7a8379]">
                            {formatContractType(
                              contract.contract_type,
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {contract.risk_score !== null ? (
                              <span className="text-xs font-semibold text-[#334036]">
                                {formatRiskScore(
                                  contract.risk_score,
                                )}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-[#9aa196]">
                                <Clock3 size={12} />
                                Pending
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                inline-flex rounded-full
                                border px-2.5 py-1
                                text-[10px] font-semibold
                                ${getRiskBadgeClass(
                                  contract.risk_level,
                                )}
                              `}
                            >
                              {contract.risk_level
                                ? contract.risk_level
                                : getStatusLabel(
                                    contract.status,
                                  )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs text-[#8a9188]">
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
                              className="
                                text-[#b0b5ac]
                                transition
                                group-hover:translate-x-0.5
                                group-hover:text-[#e8412c]
                              "
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
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e5eadf]">
                            <FileText
                              size={19}
                              className="text-[#718060]"
                            />
                          </div>

                          <p className="mt-4 text-xs font-semibold text-[#687268]">
                            No contracts yet
                          </p>

                          <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#8a9188]">
                            Upload your first contract to
                            start analyzing risk, findings,
                            and compliance signals.
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              navigate("/upload")
                            }
                            className="
                              mt-4 inline-flex items-center gap-2
                              rounded-full
                              bg-[#e8412c]
                              px-4 py-2
                              text-[11px] font-semibold text-white
                              shadow-[0_7px_18px_rgba(232,65,44,0.16)]
                              transition
                              hover:bg-[#d83b28]
                            "
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
          </section>

          {/* Workspace status */}
          <section
            className="
              mt-6 flex items-start gap-3
              rounded-[16px]
              border border-[#dddcd3]
              bg-[#eef1e9]
              px-5 py-4
            "
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dce5d4]">
              <Clock3
                size={16}
                className="text-[#718060]"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-[#586258]">
                AI-powered contract review is active for
                this workspace.
              </p>

              {data.pending_analysis > 0 ? (
                <p className="mt-1 text-[10px] text-[#a46d2e]">
                  {data.pending_analysis} contract
                  {data.pending_analysis === 1
                    ? ""
                    : "s"} currently being analyzed.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;