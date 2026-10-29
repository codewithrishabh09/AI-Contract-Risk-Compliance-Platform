import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";
import type { RiskFinding } from "../../types/analysis";

interface RiskFindingCardProps {
  finding: RiskFinding;
}

function getSeverityClasses(severity: string) {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return {
        badge:
          "border-red-400/30 bg-red-500/10 text-red-300",
        icon: "text-red-300",
      };

    case "HIGH":
      return {
        badge:
          "border-orange-400/30 bg-orange-500/10 text-orange-300",
        icon: "text-orange-300",
      };

    case "MEDIUM":
      return {
        badge:
          "border-amber-400/30 bg-amber-500/10 text-amber-300",
        icon: "text-amber-300",
      };

    case "LOW":
      return {
        badge:
          "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
        icon: "text-emerald-300",
      };

    default:
      return {
        badge:
          "border-slate-400/30 bg-slate-500/10 text-slate-300",
        icon: "text-slate-300",
      };
  }
}

function formatConfidence(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  return `${Math.round(value * 100)}%`;
}

export default function RiskFindingCard({
  finding,
}: RiskFindingCardProps) {
  const severityClasses = getSeverityClasses(finding.severity);

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 transition hover:border-white/15">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white/[0.04] p-2.5">
              <ShieldAlert
                className={`h-5 w-5 ${severityClasses.icon}`}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${severityClasses.badge}`}
                >
                  {finding.severity}
                </span>

                <span className="text-xs text-slate-500">
                  {finding.category}
                </span>
              </div>

              <h3 className="mt-3 text-base font-semibold text-white">
                {finding.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            {finding.status === "OPEN" ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}

            <span>{finding.status}</span>
          </div>
        </div>

        <div>
          <p className="text-sm leading-6 text-slate-300">
            {finding.description}
          </p>
        </div>

        {finding.evidence_text && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Evidence
              </p>
            </div>

            <p className="mt-3 text-sm italic leading-6 text-slate-400">
              “{finding.evidence_text}”
            </p>
          </div>
        )}

        {finding.recommendation && (
          <div className="rounded-xl border border-violet-400/10 bg-violet-500/[0.04] p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-violet-300" />

              <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                Recommendation
              </p>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {finding.recommendation}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-xs text-slate-500">
          {(finding.page_start !== null ||
            finding.page_end !== null) && (
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />

              <span>
                Page{" "}
                {finding.page_start ??
                  finding.page_end}
                {finding.page_end &&
                finding.page_end !== finding.page_start
                  ? `–${finding.page_end}`
                  : ""}
              </span>
            </div>
          )}

          <div>
            Confidence{" "}
            <span className="font-medium text-slate-300">
              {formatConfidence(finding.confidence_score)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}