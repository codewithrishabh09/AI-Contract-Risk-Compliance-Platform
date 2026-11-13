import { useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Filter,
  Loader2,
  ShieldAlert,
} from "lucide-react";

import { useContractDetail } from "../../features/contracts/useContractDetail";
import { useContracts } from "../../features/contracts/useContracts";
import { useRiskFindings } from "../../features/contracts/useContractAnalysis";

import type {
  Contract,
  ContractVersion,
} from "../../types/contracts";

import type { RiskFinding } from "../../types/analysis";

function getRiskClasses(severity: string | null | undefined) {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return {
        badge:
          "border-[#E8412C]/25 bg-[#E8412C]/10 text-[#C93422]",
        dot: "bg-[#E8412C]",
      };

    case "HIGH":
      return {
        badge:
          "border-[#D66A4A]/25 bg-[#D66A4A]/10 text-[#B65337]",
        dot: "bg-[#D66A4A]",
      };

    case "MEDIUM":
      return {
        badge:
          "border-[#C5A34A]/25 bg-[#C5A34A]/10 text-[#92751E]",
        dot: "bg-[#C5A34A]",
      };

    case "LOW":
      return {
        badge:
          "border-[#9CAF88]/40 bg-[#E5EADF] text-[#5F6E52]",
        dot: "bg-[#718060]",
      };

    default:
      return {
        badge:
          "border-[#DDDCD3] bg-[#F1F0EA] text-[#687268]",
        dot: "bg-[#8B918B]",
      };
  }
}

function getStatusClasses(status: string | null | undefined) {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return "border-[#E8412C]/20 bg-[#E8412C]/8 text-[#C93422]";

    case "IN_REVIEW":
    case "REVIEW":
      return "border-[#C5A34A]/25 bg-[#C5A34A]/10 text-[#92751E]";

    case "RESOLVED":
    case "CLOSED":
      return "border-[#9CAF88]/40 bg-[#E5EADF] text-[#5F6E52]";

    default:
      return "border-[#DDDCD3] bg-[#F1F0EA] text-[#687268]";
  }
}

function formatPageReference(finding: RiskFinding) {
  if (
    finding.page_start !== null &&
    finding.page_end !== null
  ) {
    if (finding.page_start === finding.page_end) {
      return `Page ${finding.page_start}`;
    }

    return `Pages ${finding.page_start}-${finding.page_end}`;
  }

  if (finding.page_start !== null) {
    return `Page ${finding.page_start}`;
  }

  return null;
}

function formatConfidence(confidence: number | null) {
  if (confidence === null) {
    return "—";
  }

  const value =
    confidence <= 1
      ? confidence * 100
      : confidence;

  return `${Math.round(value)}%`;
}

function FindingCard({
  finding,
}: {
  finding: RiskFinding;
}) {
  const riskClasses = getRiskClasses(
    finding.severity,
  );

  const pageReference =
    formatPageReference(finding);

  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-[#DDDCD3] bg-[#FFFEFA] p-5 shadow-[0_14px_40px_rgba(36,48,39,0.055)] transition duration-200 hover:-translate-y-0.5 hover:border-[#C9CEC1] hover:shadow-[0_18px_48px_rgba(36,48,39,0.09)] sm:p-6">
      <div className="absolute inset-y-0 left-0 w-1 bg-[#9CAF88] opacity-0 transition group-hover:opacity-100" />

      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${riskClasses.badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${riskClasses.dot}`}
                />

                {finding.severity}
              </span>

              <span className="rounded-full border border-[#DDDCD3] bg-[#F3F2EC] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#687268]">
                {finding.category}
              </span>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] ${getStatusClasses(
                  finding.status,
                )}`}
              >
                {finding.status}
              </span>
            </div>

            <h3 className="font-['Playfair_Display'] text-lg font-semibold leading-7 text-[#243027] sm:text-xl">
              {finding.title}
            </h3>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#E1E0D8] bg-[#F7F5EF] px-4 py-3 sm:min-w-[110px] sm:text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8A9189]">
              Confidence
            </p>

            <p className="mt-1 text-sm font-bold text-[#243027]">
              {formatConfidence(
                finding.confidence_score,
              )}
            </p>
          </div>
        </div>

        {/* Description */}
        {finding.description && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A9189]">
              Risk Description
            </p>

            <p className="mt-2 text-sm leading-6 text-[#687268]">
              {finding.description}
            </p>
          </div>
        )}

        {/* Evidence */}
        {finding.evidence_text && (
          <div className="rounded-2xl border border-[#DDDCD3] bg-[#F7F5EF]/75 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#718060]">
                Evidence
              </p>

              {pageReference && (
                <span className="text-[11px] font-semibold text-[#8A9189]">
                  {pageReference}
                </span>
              )}
            </div>

            <blockquote className="mt-3 border-l-2 border-[#9CAF88] pl-4 text-sm leading-6 text-[#4F5A52]">
              {finding.evidence_text}
            </blockquote>
          </div>
        )}

        {/* Recommendation */}
        {finding.recommendation && (
          <div className="rounded-2xl border border-[#9CAF88]/35 bg-[#E5EADF]/55 p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5F6E52]">
              Recommended Action
            </p>

            <p className="mt-2 text-sm leading-6 text-[#536052]">
              {finding.recommendation}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E4DD] pt-4">
          <div className="flex items-center gap-2 text-xs text-[#8A9189]">
            <ShieldAlert className="h-3.5 w-3.5 text-[#718060]" />

            <span>
              Finding ID:{" "}
              <span className="font-mono text-[#687268]">
                {finding.id.slice(0, 8)}
              </span>
            </span>
          </div>

          {pageReference && !finding.evidence_text && (
            <span className="text-xs font-medium text-[#8A9189]">
              {pageReference}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function FindingsPage() {
  const [selectedContractId, setSelectedContractId] =
    useState("");

  const [selectedVersionId, setSelectedVersionId] =
    useState("");

  const [severity, setSeverity] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const contractsQuery = useContracts({
    page: 1,
    page_size: 100,
  });

  const contractDetailQuery =
    useContractDetail(selectedContractId);

  const selectedContract = useMemo<Contract | undefined>(
    () =>
      contractsQuery.data?.items.find(
        (contract) =>
          contract.id === selectedContractId,
      ),
    [
      contractsQuery.data?.items,
      selectedContractId,
    ],
  );

  const versions = useMemo<ContractVersion[]>(
    () =>
      contractDetailQuery.versionsQuery.data
        ?.items ?? [],
    [contractDetailQuery.versionsQuery.data],
  );

  const selectedVersion = useMemo<
    ContractVersion | undefined
  >(
    () =>
      versions.find(
        (version) =>
          version.id === selectedVersionId,
      ),
    [versions, selectedVersionId],
  );

  const findingsQuery = useRiskFindings(
    selectedContractId,
    selectedVersionId || null,
    {
      severity: severity || undefined,
      category: category || undefined,
      status: status || undefined,
      page,
      page_size: pageSize,
    },
  );

  const findings =
    findingsQuery.data?.items ?? [];

  const total =
    findingsQuery.data?.total ?? 0;

  const totalPages =
    findingsQuery.data?.total_pages ?? 0;

  const handleContractChange = (
    contractId: string,
  ) => {
    setSelectedContractId(contractId);
    setSelectedVersionId("");
    setPage(1);
  };

  const handleVersionChange = (
    versionId: string,
  ) => {
    setSelectedVersionId(versionId);
    setPage(1);
  };

  const handleSeverityChange = (
    value: string,
  ) => {
    setSeverity(value);
    setPage(1);
  };

  const handleCategoryChange = (
    value: string,
  ) => {
    setCategory(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: string,
  ) => {
    setStatus(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSeverity("");
    setCategory("");
    setStatus("");
    setPage(1);
  };

  const hasFilters =
    Boolean(severity) ||
    Boolean(category) ||
    Boolean(status);

  return (
    <div className="lexmind-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="lexmind-card relative overflow-hidden px-6 py-7 sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9CAF88]/10 blur-3xl" />

          <div className="pointer-events-none absolute bottom-0 right-0 h-px w-2/3 bg-gradient-to-l from-[#9CAF88]/40 to-transparent" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#9CAF88]/35 bg-[#E5EADF] text-[#5F6E52]">
                  <FileSearch className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#718060]">
                  Contract Risk Intelligence
                </span>
              </div>

              <h1 className="lexmind-display text-3xl font-medium tracking-tight text-[#243027] sm:text-4xl">
                Risk Findings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687268]">
                Review AI-identified contractual risks,
                supporting evidence, confidence scores,
                and recommended actions.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-[#DDDCD3] bg-[#F7F5EF] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5EADF] text-[#5F6E52]">
                <ShieldAlert className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#243027]">
                  Finding Intelligence
                </p>

                <p className="mt-0.5 text-[11px] text-[#8A9189]">
                  Evidence-backed risk review
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contract selection */}
        <section className="lexmind-card p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9189]">
                Scope
              </p>

              <h2 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
                Select Contract Version
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F0EA] text-[#718060]">
              <FileSearch className="h-4 w-4" />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Contract */}
            <div>
              <label
                htmlFor="findings-contract"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A9189]"
              >
                Contract
              </label>

              <select
                id="findings-contract"
                value={selectedContractId}
                onChange={(event) =>
                  handleContractChange(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-[#D8D8CF] bg-[#FFFEFA] px-4 py-3 text-sm text-[#243027] outline-none transition placeholder:text-[#A2A7A1] focus:border-[#9CAF88] focus:ring-2 focus:ring-[#9CAF88]/15"
              >
                <option value="">
                  Select a contract
                </option>

                {contractsQuery.data?.items.map(
                  (contract) => (
                    <option
                      key={contract.id}
                      value={contract.id}
                    >
                      {contract.title}
                    </option>
                  ),
                )}
              </select>

              {contractsQuery.isPending && (
                <p className="mt-2 text-xs text-[#8A9189]">
                  Loading contracts...
                </p>
              )}

              {contractsQuery.isError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#C93422]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Unable to load contracts.
                </p>
              )}
            </div>

            {/* Version */}
            <div>
              <label
                htmlFor="findings-version"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A9189]"
              >
                Contract Version
              </label>

              <select
                id="findings-version"
                value={selectedVersionId}
                onChange={(event) =>
                  handleVersionChange(
                    event.target.value,
                  )
                }
                disabled={
                  !selectedContractId ||
                  contractDetailQuery
                    .versionsQuery.isPending
                }
                className="w-full rounded-xl border border-[#D8D8CF] bg-[#FFFEFA] px-4 py-3 text-sm text-[#243027] outline-none transition focus:border-[#9CAF88] focus:ring-2 focus:ring-[#9CAF88]/15 disabled:cursor-not-allowed disabled:bg-[#F1F0EA] disabled:opacity-60"
              >
                <option value="">
                  {!selectedContractId
                    ? "Select a contract first"
                    : "Select a version"}
                </option>

                {versions.map((version) => (
                  <option
                    key={version.id}
                    value={version.id}
                  >
                    Version{" "}
                    {version.version_number}
                  </option>
                ))}
              </select>

              {contractDetailQuery
                .versionsQuery.isPending &&
                selectedContractId && (
                  <p className="mt-2 text-xs text-[#8A9189]">
                    Loading versions...
                  </p>
                )}

              {contractDetailQuery
                .versionsQuery.isError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#C93422]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Unable to load contract versions.
                </p>
              )}

              {!contractDetailQuery
                .versionsQuery.isPending &&
                selectedContractId &&
                versions.length === 0 &&
                !contractDetailQuery
                  .versionsQuery.isError && (
                  <p className="mt-2 text-xs text-[#92751E]">
                    No uploaded versions are available.
                  </p>
                )}
            </div>
          </div>

          {selectedContract &&
            selectedVersion && (
              <div className="mt-5 rounded-xl border border-[#DDDCD3] bg-[#F7F5EF] px-4 py-3 text-xs text-[#687268]">
                Viewing findings for{" "}
                <strong className="font-semibold text-[#243027]">
                  {selectedContract.title}
                </strong>{" "}
                — Version{" "}
                <strong className="font-semibold text-[#243027]">
                  {selectedVersion.version_number}
                </strong>
              </div>
            )}
        </section>

        {/* Filters */}
        <section className="lexmind-card p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F0EA] text-[#718060]">
                <Filter className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9189]">
                  Filters
                </p>

                <h2 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
                  Refine Findings
                </h2>
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-[#718060] transition hover:text-[#526044]"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Severity */}
            <div>
              <label
                htmlFor="severity-filter"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A9189]"
              >
                Severity
              </label>

              <select
                id="severity-filter"
                value={severity}
                onChange={(event) =>
                  handleSeverityChange(
                    event.target.value,
                  )
                }
                disabled={!selectedVersionId}
                className="w-full rounded-xl border border-[#D8D8CF] bg-[#FFFEFA] px-4 py-3 text-sm text-[#243027] outline-none transition focus:border-[#9CAF88] focus:ring-2 focus:ring-[#9CAF88]/15 disabled:cursor-not-allowed disabled:bg-[#F1F0EA] disabled:opacity-50"
              >
                <option value="">
                  All severities
                </option>
                <option value="CRITICAL">
                  Critical
                </option>
                <option value="HIGH">
                  High
                </option>
                <option value="MEDIUM">
                  Medium
                </option>
                <option value="LOW">
                  Low
                </option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A9189]"
              >
                Category
              </label>

              <input
                id="category-filter"
                type="text"
                value={category}
                onChange={(event) =>
                  handleCategoryChange(
                    event.target.value,
                  )
                }
                disabled={!selectedVersionId}
                placeholder="e.g. payment"
                className="w-full rounded-xl border border-[#D8D8CF] bg-[#FFFEFA] px-4 py-3 text-sm text-[#243027] outline-none transition placeholder:text-[#A2A7A1] focus:border-[#9CAF88] focus:ring-2 focus:ring-[#9CAF88]/15 disabled:cursor-not-allowed disabled:bg-[#F1F0EA] disabled:opacity-50"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A9189]"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={status}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value,
                  )
                }
                disabled={!selectedVersionId}
                className="w-full rounded-xl border border-[#D8D8CF] bg-[#FFFEFA] px-4 py-3 text-sm text-[#243027] outline-none transition focus:border-[#9CAF88] focus:ring-2 focus:ring-[#9CAF88]/15 disabled:cursor-not-allowed disabled:bg-[#F1F0EA] disabled:opacity-50"
              >
                <option value="">
                  All statuses
                </option>
                <option value="OPEN">
                  Open
                </option>
                <option value="IN_REVIEW">
                  In Review
                </option>
                <option value="RESOLVED">
                  Resolved
                </option>
                <option value="CLOSED">
                  Closed
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Findings */}
        {!selectedVersionId ? (
          <section className="lexmind-card border-dashed px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F0EA] text-[#8A9189]">
              <FileSearch className="h-7 w-7" />
            </div>

            <h3 className="lexmind-display mt-5 text-xl font-medium text-[#243027]">
              Select a contract version
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A9189]">
              Choose a contract and version above to
              review its AI-generated risk findings.
            </p>
          </section>
        ) : findingsQuery.isPending ? (
          <section className="lexmind-card px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5EADF] text-[#718060]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>

            <p className="mt-4 text-sm font-medium text-[#687268]">
              Loading risk findings...
            </p>
          </section>
        ) : findingsQuery.isError ? (
          <section className="rounded-[22px] border border-[#E8412C]/20 bg-[#E8412C]/5 px-6 py-12 text-center shadow-[0_14px_40px_rgba(36,48,39,0.04)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8412C]/10 text-[#C93422]">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h3 className="lexmind-display mt-4 text-xl font-medium text-[#243027]">
              Unable to load risk findings
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A9189]">
              The findings service could not return
              results for the selected contract version.
            </p>
          </section>
        ) : findings.length === 0 ? (
          <section className="lexmind-card border-dashed px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5EADF] text-[#718060]">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <h3 className="lexmind-display mt-5 text-xl font-medium text-[#243027]">
              No findings found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A9189]">
              No risk findings match the selected
              contract version and current filters.
            </p>
          </section>
        ) : (
          <>
            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9189]">
                    Findings
                  </p>

                  <h2 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
                    Identified Contract Risks
                  </h2>
                </div>

                <span className="w-fit rounded-full border border-[#DDDCD3] bg-[#F1F0EA] px-3 py-1 text-xs font-semibold text-[#687268]">
                  {total} total
                </span>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {findings.map((finding) => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                  />
                ))}
              </div>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <section className="lexmind-card flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#8A9189]">
                  Page{" "}
                  <span className="font-semibold text-[#243027]">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#243027]">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) =>
                        Math.max(1, current - 1),
                      )
                    }
                    disabled={
                      !findingsQuery.data
                        ?.has_previous
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8D8CF] bg-[#FFFEFA] px-3.5 py-2.5 text-xs font-semibold text-[#526057] transition hover:border-[#BFC7B7] hover:bg-[#F1F0EA] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) =>
                        current + 1,
                      )
                    }
                    disabled={
                      !findingsQuery.data?.has_next
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#243027] px-3.5 py-2.5 text-xs font-semibold text-[#F7F5EF] transition hover:bg-[#344239] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}