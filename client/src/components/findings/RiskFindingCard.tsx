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
          "border-[#e8412c]/25 bg-[#fff1ee] text-[#c73524]",
        icon: "text-[#e8412c]",
        iconBackground: "bg-[#fff1ee]",
        accent: "bg-[#e8412c]",
      };

    case "HIGH":
      return {
        badge:
          "border-[#ed8a45]/30 bg-[#fff5ec] text-[#c56a2c]",
        icon: "text-[#d87935]",
        iconBackground: "bg-[#fff5ec]",
        accent: "bg-[#ed8a45]",
      };

    case "MEDIUM":
      return {
        badge:
          "border-[#d7aa32]/30 bg-[#fff9e8] text-[#9a7615]",
        icon: "text-[#c49422]",
        iconBackground: "bg-[#fff9e8]",
        accent: "bg-[#d7aa32]",
      };

    case "LOW":
      return {
        badge:
          "border-[#9caf88]/40 bg-[#edf2e9] text-[#5f704f]",
        icon: "text-[#718060]",
        iconBackground: "bg-[#edf2e9]",
        accent: "bg-[#9caf88]",
      };

    default:
      return {
        badge:
          "border-[#dddcd3] bg-[#f4f5ef] text-[#687268]",
        icon: "text-[#718060]",
        iconBackground: "bg-[#f4f5ef]",
        accent: "bg-[#9caf88]",
      };
  }
}

function formatConfidence(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  return `${Math.round(value * 100)}%`;
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function RiskFindingCard({
  finding,
}: RiskFindingCardProps) {
  const severityClasses = getSeverityClasses(finding.severity);
  const isOpen = finding.status === "OPEN";

  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-[#dddcd3] bg-[#fffefa] p-5 shadow-[0_8px_28px_rgba(36,48,39,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c9d3c1] hover:shadow-[0_16px_40px_rgba(36,48,39,0.08)] sm:p-6">
      {/* Severity accent */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${severityClasses.accent}`}
      />

      <div className="pl-1">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${severityClasses.iconBackground}`}
            >
              <ShieldAlert
                className={`h-[18px] w-[18px] ${severityClasses.icon}`}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${severityClasses.badge}`}
                >
                  {finding.severity}
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a9188]">
                  {finding.category}
                </span>
              </div>

              <h3 className="mt-2.5 font-['Playfair_Display'] text-[19px] font-medium leading-tight tracking-[-0.02em] text-[#243027]">
                {finding.title}
              </h3>
            </div>
          </div>

          {/* Status */}
          <div
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
              isOpen
                ? "border-[#e8d9c9] bg-[#faf6ef] text-[#8b735b]"
                : "border-[#cfdac8] bg-[#edf2e9] text-[#5f704f]"
            }`}
          >
            {isOpen ? (
              <AlertTriangle
                className="h-3.5 w-3.5"
                strokeWidth={1.8}
              />
            ) : (
              <CheckCircle2
                className="h-3.5 w-3.5"
                strokeWidth={1.8}
              />
            )}

            <span>{formatStatus(finding.status)}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-5">
          <p className="text-[13px] leading-6 text-[#687268] sm:text-sm">
            {finding.description}
          </p>
        </div>

        {/* Evidence */}
        {finding.evidence_text && (
          <div className="mt-5 rounded-2xl border border-[#e1e2da] bg-[#f8f8f3] p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e5eadf] text-[#718060]">
                <FileText
                  className="h-3.5 w-3.5"
                  strokeWidth={1.8}
                />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#718060]">
                Evidence
              </p>
            </div>

            <div className="mt-3 border-l-2 border-[#9caf88] pl-3.5">
              <p className="text-[13px] italic leading-6 text-[#687268]">
                “{finding.evidence_text}”
              </p>
            </div>
          </div>
        )}

        {/* Recommendation */}
        {finding.recommendation && (
          <div className="mt-4 rounded-2xl border border-[#d8dfd2] bg-[#f1f4ed] p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e1e8dc] text-[#718060]">
                <Lightbulb
                  className="h-3.5 w-3.5"
                  strokeWidth={1.8}
                />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#657354]">
                Recommendation
              </p>
            </div>

            <p className="mt-3 text-[13px] leading-6 text-[#526047]">
              {finding.recommendation}
            </p>
          </div>
        )}

        {/* Footer metadata */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#e5e3da] pt-4 text-[11px] text-[#858d84]">
          {(finding.page_start !== null ||
            finding.page_end !== null) && (
            <div className="flex items-center gap-1.5">
              <FileText
                className="h-3.5 w-3.5 text-[#9caf88]"
                strokeWidth={1.8}
              />

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

          <div className="flex items-center gap-1">
            <span>Confidence</span>

            <span className="font-semibold text-[#526047]">
              {formatConfidence(finding.confidence_score)}
            </span>
          </div>

          <div className="ml-auto hidden text-[10px] font-medium text-[#9aa198] sm:block">
            Contract finding
          </div>
        </div>
      </div>
    </article>
  );
}