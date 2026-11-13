import {
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  FileText,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { useContracts } from "../../features/contracts/useContracts";
import { useContractDetail } from "../../features/contracts/useContractDetail";
import { useComplianceOverview } from "../../features/compliance/useCompliance";
import { useRiskFindings } from "../../features/contracts/useContractAnalysis";

import type { RiskFinding } from "../../types/analysis";
import type { ComplianceCategory } from "../../types/compliance";

function formatLabel(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatScore(score: number | null) {
  if (score === null) {
    return "—";
  }

  return Number(score).toFixed(1);
}

function getSeverityClass(
  severity: string | null | undefined,
) {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "border-[#e8412c]/25 bg-[#e8412c]/10 text-[#c52f20]";

    case "HIGH":
      return "border-[#e8412c]/20 bg-[#fff0ed] text-[#d63a28]";

    case "MEDIUM":
      return "border-amber-300 bg-amber-50 text-amber-700";

    case "LOW":
      return "border-[#9caf88]/50 bg-[#e5eadf] text-[#526347]";

    default:
      return "border-[#dddcd3] bg-[#f4f3ed] text-[#687268]";
  }
}

function getStatusClass(status: string) {
  switch (status.toUpperCase()) {
    case "OPEN":
      return "border-[#e8412c]/20 bg-[#fff0ed] text-[#d63a28]";

    case "ACCEPTED":
      return "border-amber-300 bg-amber-50 text-amber-700";

    case "MITIGATED":
      return "border-[#9caf88]/50 bg-[#e5eadf] text-[#526347]";

    case "DISMISSED":
      return "border-[#dddcd3] bg-[#f4f3ed] text-[#687268]";

    default:
      return "border-[#dddcd3] bg-[#f4f3ed] text-[#687268]";
  }
}

function OverviewCard({
  label,
  value,
  description,
  danger = false,
}: {
  label: string;
  value: string | number;
  description: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border p-5 shadow-[0_12px_35px_rgba(36,48,39,0.05)] transition ${
        danger
          ? "border-[#e8412c]/20 bg-[#fffaf8]"
          : "border-[#dddcd3] bg-[#fffefa]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
          {label}
        </div>

        {danger ? (
          <ShieldAlert className="h-4 w-4 text-[#e8412c]" />
        ) : (
          <ShieldCheck className="h-4 w-4 text-[#718060]" />
        )}
      </div>

      <div
        className={`mt-5 text-3xl font-semibold tracking-tight ${
          danger ? "text-[#c52f20]" : "text-[#243027]"
        }`}
      >
        {value}
      </div>

      <div className="mt-2 text-xs leading-5 text-[#7a8279]">
        {description}
      </div>
    </div>
  );
}

function SeverityBadge({
  severity,
}: {
  severity: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getSeverityClass(
        severity,
      )}`}
    >
      {severity}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusClass(
        status,
      )}`}
    >
      {formatLabel(status)}
    </span>
  );
}

function CategoryTable({
  categories,
}: {
  categories: ComplianceCategory[];
}) {
  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#dddcd3] bg-[#faf9f4] px-6 py-12 text-center text-sm text-[#7a8279]">
        No compliance category data is available for this
        version.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dddcd3] bg-[#fffefa]">
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse">
          <thead>
            <tr className="border-b border-[#dddcd3] bg-[#f4f3ed]">
              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                Category
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                Total
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c52f20]">
                Critical
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d63a28]">
                High
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                Medium
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-[#526347]">
                Low
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category, index) => (
              <tr
                key={category.category}
                className={`border-b border-[#ebe9e1] last:border-b-0 transition hover:bg-[#f8f7f1] ${
                  index % 2 === 0
                    ? "bg-[#fffefa]"
                    : "bg-[#fcfbf7]"
                }`}
              >
                <td className="px-5 py-4">
                  <span className="font-medium text-[#243027]">
                    {formatLabel(category.category)}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="font-semibold text-[#243027]">
                    {category.total}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="font-semibold text-[#c52f20]">
                    {category.critical}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="font-semibold text-[#d63a28]">
                    {category.high}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="font-semibold text-amber-700">
                    {category.medium}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="font-semibold text-[#526347]">
                    {category.low}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FindingsTable({
  findings,
}: {
  findings: RiskFinding[];
}) {
  if (findings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#dddcd3] bg-[#faf9f4] px-6 py-12 text-center text-sm text-[#7a8279]">
        No compliance findings were found for this
        version.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dddcd3] bg-[#fffefa]">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead>
            <tr className="border-b border-[#dddcd3] bg-[#f4f3ed]">
              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                Finding
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                Severity
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                Status
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                Recommendation
              </th>
            </tr>
          </thead>

          <tbody>
            {findings.map((finding) => (
              <tr
                key={finding.id}
                className="border-b border-[#ebe9e1] last:border-b-0 transition hover:bg-[#f8f7f1]"
              >
                <td className="max-w-[420px] px-5 py-5 align-top">
                  <div className="font-semibold text-[#243027]">
                    {finding.title}
                  </div>

                  <div className="mt-2 text-sm leading-6 text-[#687268]">
                    {finding.description}
                  </div>

                  <div className="mt-3 inline-flex rounded-full border border-[#dddcd3] bg-[#f4f3ed] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#687268]">
                    {formatLabel(finding.category)}
                  </div>
                </td>

                <td className="px-5 py-5 align-top">
                  <SeverityBadge
                    severity={finding.severity}
                  />
                </td>

                <td className="px-5 py-5 align-top">
                  <StatusBadge status={finding.status} />
                </td>

                <td className="max-w-[360px] px-5 py-5 align-top">
                  <div className="text-sm leading-6 text-[#687268]">
                    {finding.recommendation ||
                      "No recommendation provided."}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  const contractsQuery = useContracts({
    page: 1,
    page_size: 100,
  });

  const contracts = contractsQuery.data?.items ?? [];

  const [selectedContractId, setSelectedContractId] =
    useState("");

  const effectiveContractId =
    selectedContractId || contracts[0]?.id || "";

  const { versionsQuery } =
    useContractDetail(effectiveContractId);

  const versions = versionsQuery.data?.items ?? [];

  const [selectedVersionId, setSelectedVersionId] =
    useState("");

  const effectiveVersionId =
    selectedVersionId || versions[0]?.id || null;

  const complianceQuery = useComplianceOverview(
    effectiveContractId,
    effectiveVersionId,
  );

  const findingsQuery = useRiskFindings(
    effectiveContractId,
    effectiveVersionId,
  );

  const findings = useMemo(
    () => findingsQuery.data?.items ?? [],
    [findingsQuery.data],
  );

  const compliance = complianceQuery.data;

  function handleContractChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setSelectedContractId(event.target.value);
    setSelectedVersionId("");
  }

  function handleVersionChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setSelectedVersionId(event.target.value);
  }

  if (contractsQuery.isLoading) {
    return (
      <div className="lexmind-page px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="lexmind-card w-full max-w-md px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#526347]">
              <FileCheck2 className="h-5 w-5" />
            </div>

            <p className="mt-5 text-sm font-medium text-[#243027]">
              Loading compliance workspace...
            </p>

            <p className="mt-2 text-xs text-[#7a8279]">
              Preparing your contract compliance data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (contractsQuery.isError) {
    return (
      <div className="lexmind-page px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="w-full max-w-md rounded-[24px] border border-[#e8412c]/20 bg-[#fffaf8] px-6 py-10 text-center shadow-[0_18px_45px_rgba(36,48,39,0.06)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#e8412c]">
              <AlertCircle className="h-5 w-5" />
            </div>

            <h2 className="lexmind-display mt-5 text-2xl text-[#243027]">
              Unable to load contracts
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7a8279]">
              Please try again after checking your
              connection and workspace access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="lexmind-page px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="relative overflow-hidden rounded-[28px] border border-[#dddcd3] bg-[#fffefa] px-6 py-8 shadow-[0_18px_45px_rgba(36,48,39,0.06)] sm:px-8 lg:px-10">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#9caf88]/15 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526347]">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                  Compliance
                </span>
              </div>

              <h1 className="lexmind-display mt-5 text-4xl leading-tight text-[#243027] sm:text-5xl">
                Compliance Workspace
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#687268] sm:text-base">
                Review contractual risk, compliance
                categories, and outstanding findings from
                one centralized workspace.
              </p>
            </div>
          </section>

          <div className="rounded-[24px] border border-dashed border-[#dddcd3] bg-[#faf9f4] px-6 py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-[#9aa198]" />

            <h2 className="mt-5 text-lg font-semibold text-[#243027]">
              No contracts available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7a8279]">
              No contracts are available for compliance
              review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lexmind-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="relative overflow-hidden rounded-[28px] border border-[#dddcd3] bg-[#fffefa] px-6 py-7 shadow-[0_18px_45px_rgba(36,48,39,0.06)] sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9caf88]/15 blur-3xl" />

          <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526347]">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                  Compliance
                </span>
              </div>

              <h1 className="lexmind-display mt-5 text-4xl leading-tight text-[#243027] sm:text-5xl">
                Compliance Workspace
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#687268] sm:text-base">
                Review contractual risk, compliance
                categories, and unresolved findings in one
                focused workspace.
              </p>
            </div>

            {/* Selectors */}
            <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[560px]">
              <label className="group">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                  Contract
                </span>

                <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-1 transition focus-within:border-[#9caf88] focus-within:ring-4 focus-within:ring-[#9caf88]/10">
                  <select
                    value={effectiveContractId}
                    onChange={handleContractChange}
                    className="w-full cursor-pointer bg-transparent py-3 text-sm font-medium text-[#243027] outline-none"
                  >
                    {contracts.map((contract) => (
                      <option
                        key={contract.id}
                        value={contract.id}
                      >
                        {contract.title}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="group">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                  Version
                </span>

                <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-1 transition focus-within:border-[#9caf88] focus-within:ring-4 focus-within:ring-[#9caf88]/10">
                  <select
                    value={effectiveVersionId ?? ""}
                    onChange={handleVersionChange}
                    disabled={versionsQuery.isLoading}
                    className="w-full cursor-pointer bg-transparent py-3 text-sm font-medium text-[#243027] outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {versions.map((version) => (
                      <option
                        key={version.id}
                        value={version.id}
                      >
                        Version {version.version_number}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>
          </div>
        </header>

        {/* Version loading */}
        {versionsQuery.isLoading && (
          <div className="lexmind-card flex items-center gap-4 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526347]">
              <FileText className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#243027]">
                Loading contract versions
              </p>

              <p className="mt-1 text-xs text-[#7a8279]">
                Preparing available versions for review.
              </p>
            </div>
          </div>
        )}

        {!versionsQuery.isLoading &&
          versions.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-[#dddcd3] bg-[#faf9f4] px-6 py-10 text-center">
              <FileText className="mx-auto h-8 w-8 text-[#9aa198]" />

              <p className="mt-4 text-sm font-medium text-[#243027]">
                No versions are available
              </p>

              <p className="mt-1 text-xs text-[#7a8279]">
                This contract does not have a version
                available for compliance review.
              </p>
            </div>
          )}

        {/* Compliance loading */}
        {complianceQuery.isLoading &&
          effectiveVersionId && (
            <div className="lexmind-card flex items-center gap-4 px-5 py-4">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#9caf88]" />

              <div>
                <p className="text-sm font-medium text-[#243027]">
                  Loading compliance analysis
                </p>

                <p className="mt-1 text-xs text-[#7a8279]">
                  Evaluating the selected contract version.
                </p>
              </div>
            </div>
          )}

        {complianceQuery.isError && (
          <div className="rounded-[22px] border border-[#e8412c]/20 bg-[#fffaf8] px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-[#e8412c]">
                <AlertCircle className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#243027]">
                  Unable to load compliance data
                </p>

                <p className="mt-1 text-xs leading-5 text-[#7a8279]">
                  Compliance data could not be loaded for
                  the selected contract version.
                </p>
              </div>
            </div>
          </div>
        )}

        {compliance && (
          <>
            {/* Overview */}
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                    Overview
                  </div>

                  <h2 className="lexmind-display mt-2 text-3xl text-[#243027]">
                    Compliance Overview
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-[#dddcd3] bg-[#fffefa] px-3 py-1.5 font-medium text-[#243027]">
                    {compliance.contract_title}
                  </span>

                  <span className="rounded-full bg-[#e5eadf] px-3 py-1.5 font-medium text-[#526347]">
                    {formatLabel(
                      compliance.contract_type,
                    )}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <OverviewCard
                  label="Compliance Score"
                  value={formatScore(
                    compliance.overall_risk_score,
                  )}
                  description="Overall contract risk score"
                />

                <div className="rounded-[22px] border border-[#dddcd3] bg-[#fffefa] p-5 shadow-[0_12px_35px_rgba(36,48,39,0.05)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                      Overall Status
                    </div>

                    <CheckCircle2 className="h-4 w-4 text-[#718060]" />
                  </div>

                  <div className="mt-5">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${getSeverityClass(
                        compliance.risk_level,
                      )}`}
                    >
                      {compliance.risk_level ||
                        "UNASSESSED"}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-[#7a8279]">
                    Analysis:{" "}
                    <span className="font-medium text-[#526347]">
                      {formatLabel(
                        compliance.analysis_status,
                      )}
                    </span>
                  </div>
                </div>

                <OverviewCard
                  label="Open Findings"
                  value={compliance.open_findings}
                  description="Findings requiring attention"
                  danger={compliance.open_findings > 0}
                />

                <OverviewCard
                  label="Critical Findings"
                  value={compliance.critical_findings}
                  description="Critical compliance risks"
                  danger={
                    compliance.critical_findings > 0
                  }
                />

                <OverviewCard
                  label="High Findings"
                  value={compliance.high_risk_findings}
                  description="High severity risks"
                  danger={
                    compliance.high_risk_findings > 0
                  }
                />
              </div>
            </section>

            {/* Category distribution */}
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                    Risk Distribution
                  </div>

                  <h2 className="lexmind-display mt-2 text-3xl text-[#243027]">
                    Compliance Categories
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#7a8279]">
                  <TriangleAlert className="h-3.5 w-3.5 text-[#e8412c]" />

                  <span>
                    {compliance.total_findings} total
                    findings
                  </span>
                </div>
              </div>

              <CategoryTable
                categories={compliance.categories}
              />
            </section>

            {/* Findings */}
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                    Review Queue
                  </div>

                  <h2 className="lexmind-display mt-2 text-3xl text-[#243027]">
                    Compliance Findings
                  </h2>
                </div>

                <div className="rounded-full border border-[#dddcd3] bg-[#fffefa] px-3 py-1.5 text-xs font-medium text-[#687268]">
                  {findings.length} findings loaded
                </div>
              </div>

              {findingsQuery.isLoading ? (
                <div className="lexmind-card flex items-center gap-4 px-5 py-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526347]">
                    <FileCheck2 className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#243027]">
                      Loading findings
                    </p>

                    <p className="mt-1 text-xs text-[#7a8279]">
                      Fetching compliance findings for this
                      version.
                    </p>
                  </div>
                </div>
              ) : findingsQuery.isError ? (
                <div className="rounded-[22px] border border-[#e8412c]/20 bg-[#fffaf8] px-5 py-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-[#e8412c]">
                      <AlertCircle className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#243027]">
                        Unable to load compliance findings
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#7a8279]">
                        The findings for this contract
                        version could not be loaded.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <FindingsTable findings={findings} />
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
