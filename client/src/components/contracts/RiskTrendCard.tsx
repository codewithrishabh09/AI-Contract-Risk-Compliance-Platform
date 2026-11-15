import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type { ContractRiskTrend } from "../../types/versionAnalysis";

interface RiskTrendCardProps {
  trend: ContractRiskTrend;
}

function getRiskClasses(riskLevel: string | null) {
  switch (riskLevel) {
    case "CRITICAL":
      return {
        badge: "border-[#e8412c]/25 bg-[#fff0ed] text-[#c93422]",
        dot: "bg-[#e8412c]",
      };

    case "HIGH":
      return {
        badge: "border-[#e8412c]/20 bg-[#fff5f2] text-[#c93422]",
        dot: "bg-[#e8412c]",
      };

    case "MEDIUM":
      return {
        badge: "border-[#d8ad43]/30 bg-[#fff8df] text-[#9b7415]",
        dot: "bg-[#d8ad43]",
      };

    case "LOW":
      return {
        badge: "border-[#9caf88]/40 bg-[#e5eadf] text-[#526047]",
        dot: "bg-[#9caf88]",
      };

    default:
      return {
        badge: "border-[#dddcd3] bg-[#f4f5ef] text-[#687268]",
        dot: "bg-[#9caf88]",
      };
  }
}

function getDirectionContent(trend: ContractRiskTrend) {
  switch (trend.risk_direction) {
    case "IMPROVED":
      return {
        label: "Improved",
        icon: TrendingDown,
        classes:
          "border-[#9caf88]/40 bg-[#e5eadf] text-[#526047]",
      };

    case "WORSENED":
      return {
        label: "Worsened",
        icon: TrendingUp,
        classes:
          "border-[#e8412c]/20 bg-[#fff0ed] text-[#c93422]",
      };

    case "UNCHANGED":
      return {
        label: "Unchanged",
        icon: Minus,
        classes:
          "border-[#dddcd3] bg-[#f4f5ef] text-[#687268]",
      };

    default:
      return {
        label: "No Previous Data",
        icon: Minus,
        classes:
          "border-[#dddcd3] bg-[#f4f5ef] text-[#8a9188]",
      };
  }
}

export default function RiskTrendCard({
  trend,
}: RiskTrendCardProps) {
  const direction = getDirectionContent(trend);

  const DirectionIcon = direction.icon;

  const analyzedVersions = trend.versions.filter(
    (version) =>
      version.overall_risk_score !== null,
  );

  const currentPoint =
    trend.versions.find(
      (version) =>
        version.version_number ===
        trend.current_version_number,
    ) ?? null;

  return (
    <section className="rounded-[24px] border border-[#dddcd3] bg-[#243027] p-5 shadow-[0_16px_42px_rgba(36,48,39,0.10)] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9caf88]/15 text-[#9caf88]">
              <ShieldAlert size={18} strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg font-semibold text-white">
                Risk Trend
              </h2>

              <p className="mt-1 text-[11px] text-white/50">
                Version-by-version contract risk analysis
              </p>
            </div>
          </div>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${direction.classes}`}
        >
          <DirectionIcon size={13} />

          {direction.label}
        </div>
      </div>

      {/* Current summary */}
      {currentPoint ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {/* Current Risk */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
              Current Risk
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-semibold tracking-[-0.04em] text-white">
                {currentPoint.overall_risk_score}
              </span>

              <span className="pb-1 text-[10px] text-white/35">
                / 100
              </span>
            </div>

            <span
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                getRiskClasses(currentPoint.risk_level).badge
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  getRiskClasses(currentPoint.risk_level).dot
                }`}
              />

              {currentPoint.risk_level ?? "Not analyzed"}
            </span>
          </div>

          {/* Risk Change */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
              Risk Change
            </p>

            <div className="mt-2 flex items-center gap-2">
              {trend.risk_score_change !== null ? (
                trend.risk_score_change < 0 ? (
                  <ArrowDownRight
                    size={18}
                    className="text-[#9caf88]"
                  />
                ) : trend.risk_score_change > 0 ? (
                  <ArrowUpRight
                    size={18}
                    className="text-[#e8412c]"
                  />
                ) : (
                  <Minus
                    size={18}
                    className="text-white/40"
                  />
                )
              ) : null}

              <span className="text-3xl font-semibold tracking-[-0.04em] text-white">
                {trend.risk_score_change !== null
                  ? trend.risk_score_change > 0
                    ? `+${trend.risk_score_change}`
                    : trend.risk_score_change
                  : "—"}
              </span>
            </div>

            <p className="mt-2 text-[10px] leading-4 text-white/35">
              Compared with previous analyzed version
            </p>
          </div>

          {/* Current Findings */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
              Current Findings
            </p>

            <div className="mt-2 flex items-end gap-3">
              <span className="text-3xl font-semibold tracking-[-0.04em] text-white">
                {currentPoint.finding_count}
              </span>

              <span className="pb-1 text-[10px] text-white/35">
                total
              </span>
            </div>

            <div className="mt-3 flex gap-3 text-[10px]">
              <span className="text-[#e7bd58]">
                {currentPoint.high_risk_findings} high
              </span>

              <span className="text-[#f07869]">
                {currentPoint.critical_findings} critical
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-10 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-white/40">
            <ShieldAlert size={21} />
          </div>

          <p className="mt-4 text-sm font-medium text-white/65">
            No analyzed versions yet
          </p>

          <p className="mt-1 text-[10px] leading-5 text-white/35">
            Run contract analysis to start tracking risk over time.
          </p>
        </div>
      )}

      {/* Version history */}
      {analyzedVersions.length > 0 ? (
        <div className="mt-7">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
              Version History
            </span>

            <span className="text-[10px] text-white/35">
              Lower score = lower risk
            </span>
          </div>

          <div className="space-y-3">
            {trend.versions.map((point) => {
              const score = point.overall_risk_score;
              const riskClasses = getRiskClasses(
                point.risk_level,
              );

              return (
                <div
                  key={point.contract_version_id}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:border-white/15 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#9caf88]/20 bg-[#9caf88]/10 text-[10px] font-bold text-[#b9c8aa]">
                        V{point.version_number}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-white/85">
                          Version {point.version_number}
                        </p>

                        <p className="mt-1 text-[10px] text-white/35">
                          {point.finding_count} findings
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      {score !== null ? (
                        <div className="flex items-center gap-2 sm:justify-end">
                          <p className="text-lg font-semibold tracking-[-0.03em] text-white">
                            {score}
                          </p>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.06em] ${riskClasses.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${riskClasses.dot}`}
                            />

                            {point.risk_level}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-white/35">
                          Not analyzed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                      {score !== null ? (
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            point.risk_level === "CRITICAL" ||
                            point.risk_level === "HIGH"
                              ? "bg-[#e8412c]"
                              : point.risk_level ===
                                  "MEDIUM"
                                ? "bg-[#d8ad43]"
                                : "bg-[#9caf88]"
                          }`}
                          style={{
                            width: `${Math.max(
                              4,
                              Math.min(100, score),
                            )}%`,
                          }}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[9px] text-white/30">
                    <span>
                      {point.high_risk_findings} high
                    </span>

                    <span>
                      {point.critical_findings} critical
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}