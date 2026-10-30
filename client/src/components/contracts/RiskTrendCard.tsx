import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type {
  ContractRiskTrend,
} from "../../types/versionAnalysis";

interface RiskTrendCardProps {
  trend: ContractRiskTrend;
}

function getRiskClasses(riskLevel: string | null) {
  switch (riskLevel) {
    case "CRITICAL":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";

    case "HIGH":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";

    case "MEDIUM":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";

    case "LOW":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-400";
  }
}

function getDirectionContent(trend: ContractRiskTrend) {
  switch (trend.risk_direction) {
    case "IMPROVED":
      return {
        label: "Improved",
        icon: TrendingDown,
        classes:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      };

    case "WORSENED":
      return {
        label: "Worsened",
        icon: TrendingUp,
        classes:
          "border-rose-500/20 bg-rose-500/10 text-rose-300",
      };

    case "UNCHANGED":
      return {
        label: "Unchanged",
        icon: Minus,
        classes:
          "border-slate-500/20 bg-slate-500/10 text-slate-300",
      };

    default:
      return {
        label: "No Previous Data",
        icon: Minus,
        classes:
          "border-slate-500/20 bg-slate-500/10 text-slate-400",
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
    <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <ShieldAlert size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Risk Trend
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Version-by-version contract risk analysis
              </p>
            </div>
          </div>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${direction.classes}`}
        >
          <DirectionIcon size={13} />

          {direction.label}
        </div>
      </div>

      {currentPoint ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[#173052] bg-[#09182b] p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Current Risk
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-semibold text-white">
                {currentPoint.overall_risk_score}
              </span>

              <span className="pb-1 text-[10px] text-slate-600">
                / 100
              </span>
            </div>

            <span
              className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${getRiskClasses(
                currentPoint.risk_level,
              )}`}
            >
              {currentPoint.risk_level ?? "Not analyzed"}
            </span>
          </div>

          <div className="rounded-lg border border-[#173052] bg-[#09182b] p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Risk Change
            </p>

            <div className="mt-2 flex items-center gap-2">
              {trend.risk_score_change !== null ? (
                trend.risk_score_change < 0 ? (
                  <ArrowDownRight
                    size={18}
                    className="text-emerald-400"
                  />
                ) : trend.risk_score_change > 0 ? (
                  <ArrowUpRight
                    size={18}
                    className="text-rose-400"
                  />
                ) : (
                  <Minus
                    size={18}
                    className="text-slate-400"
                  />
                )
              ) : null}

              <span className="text-2xl font-semibold text-white">
                {trend.risk_score_change !== null
                  ? trend.risk_score_change > 0
                    ? `+${trend.risk_score_change}`
                    : trend.risk_score_change
                  : "—"}
              </span>
            </div>

            <p className="mt-2 text-[10px] text-slate-600">
              Compared with previous analyzed version
            </p>
          </div>

          <div className="rounded-lg border border-[#173052] bg-[#09182b] p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Current Findings
            </p>

            <div className="mt-2 flex items-end gap-3">
              <span className="text-2xl font-semibold text-white">
                {currentPoint.finding_count}
              </span>

              <span className="pb-1 text-[10px] text-slate-600">
                total
              </span>
            </div>

            <div className="mt-2 flex gap-3 text-[10px]">
              <span className="text-orange-300">
                {currentPoint.high_risk_findings} high
              </span>

              <span className="text-rose-300">
                {currentPoint.critical_findings} critical
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-[#173052] bg-[#09182b]/60 p-8 text-center">
          <ShieldAlert
            size={22}
            className="mx-auto text-slate-600"
          />

          <p className="mt-3 text-xs font-medium text-slate-400">
            No analyzed versions yet
          </p>

          <p className="mt-1 text-[10px] text-slate-600">
            Run contract analysis to start tracking risk over time.
          </p>
        </div>
      )}

      {analyzedVersions.length > 0 ? (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Version History
            </span>

            <span className="text-[10px] text-slate-600">
              Lower score = lower risk
            </span>
          </div>

          <div className="space-y-4">
            {trend.versions.map((point) => {
              const score = point.overall_risk_score;

              return (
                <div
                  key={point.contract_version_id}
                  className="rounded-lg border border-[#173052] bg-[#09182b]/70 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-[10px] font-bold text-indigo-300">
                        V{point.version_number}
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-200">
                          Version {point.version_number}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-600">
                          {point.finding_count} findings
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {score !== null ? (
                        <>
                          <p className="text-sm font-semibold text-white">
                            {score}
                          </p>

                          <span
                            className={`text-[9px] font-semibold uppercase ${getRiskClasses(
                              point.risk_level,
                            )} rounded-full border px-2 py-1`}
                          >
                            {point.risk_level}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-600">
                          Not analyzed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#10233d]">
                    {score !== null ? (
                      <div
                        className="h-full rounded-full bg-indigo-400 transition-all duration-500"
                        style={{
                          width: `${Math.max(
                            4,
                            Math.min(100, score),
                          )}%`,
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[9px] text-slate-600">
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