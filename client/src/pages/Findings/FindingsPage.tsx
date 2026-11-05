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
          "border-red-500/30 bg-red-500/10 text-red-300",
        dot: "bg-red-400",
      };

    case "HIGH":
      return {
        badge:
          "border-orange-500/30 bg-orange-500/10 text-orange-300",
        dot: "bg-orange-400",
      };

    case "MEDIUM":
      return {
        badge:
          "border-amber-500/30 bg-amber-500/10 text-amber-300",
        dot: "bg-amber-400",
      };

    case "LOW":
      return {
        badge:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        dot: "bg-emerald-400",
      };

    default:
      return {
        badge:
          "border-slate-700 bg-slate-900 text-slate-400",
        dot: "bg-slate-500",
      };
  }
}

function getStatusClasses(status: string | null | undefined) {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return "border-red-500/20 bg-red-500/10 text-red-300";

    case "IN_REVIEW":
    case "REVIEW":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";

    case "RESOLVED":
    case "CLOSED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

    default:
      return "border-slate-700 bg-slate-900 text-slate-400";
  }
}

function formatPageReference(
  finding: RiskFinding,
) {
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

function formatConfidence(
  confidence: number | null,
) {
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
    <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/10 transition hover:border-slate-700">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${riskClasses.badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${riskClasses.dot}`}
                />

                {finding.severity}
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                {finding.category}
              </span>

              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                  finding.status,
                )}`}
              >
                {finding.status}
              </span>
            </div>

            <h3 className="text-base font-semibold leading-6 text-white">
              {finding.title}
            </h3>
          </div>

          <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-600">
              Confidence
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-300">
              {formatConfidence(
                finding.confidence_score,
              )}
            </p>
          </div>
        </div>

        {/* Description */}
        {finding.description && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              Risk Description
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {finding.description}
            </p>
          </div>
        )}

        {/* Evidence */}
        {finding.evidence_text && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                Evidence
              </p>

              {pageReference && (
                <span className="text-[11px] font-medium text-slate-500">
                  {pageReference}
                </span>
              )}
            </div>

            <blockquote className="mt-2 border-l-2 border-slate-700 pl-3 text-sm leading-6 text-slate-400">
              {finding.evidence_text}
            </blockquote>
          </div>
        )}

        {/* Recommendation */}
        {finding.recommendation && (
          <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-400/70">
              Recommended Action
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {finding.recommendation}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldAlert className="h-3.5 w-3.5" />

            <span>
              Finding ID:{" "}
              <span className="font-mono text-slate-500">
                {finding.id.slice(0, 8)}
              </span>
            </span>
          </div>

          {pageReference && !finding.evidence_text && (
            <span className="text-xs text-slate-500">
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
    <div className="min-h-full bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-red-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300">
                  <FileSearch className="h-5 w-5" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                  Contract Risk Intelligence
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Risk Findings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Review AI-identified contractual risks,
                supporting evidence, confidence scores,
                and recommended actions.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
              <ShieldAlert className="h-4 w-4 text-red-300" />

              <div>
                <p className="text-xs font-semibold text-slate-300">
                  Finding Intelligence
                </p>

                <p className="text-[11px] text-slate-500">
                  Evidence-backed risk review
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contract selection */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Scope
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Select Contract Version
              </h2>
            </div>

            <FileSearch className="h-5 w-5 text-slate-600" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Contract */}
            <div>
              <label
                htmlFor="findings-contract"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
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
                <p className="mt-2 text-xs text-slate-600">
                  Loading contracts...
                </p>
              )}

              {contractsQuery.isError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Unable to load contracts.
                </p>
              )}
            </div>

            {/* Version */}
            <div>
              <label
                htmlFor="findings-version"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <p className="mt-2 text-xs text-slate-600">
                    Loading versions...
                  </p>
                )}

              {contractDetailQuery
                .versionsQuery.isError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
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
                  <p className="mt-2 text-xs text-amber-400">
                    No uploaded versions are available.
                  </p>
                )}
            </div>
          </div>

          {selectedContract &&
            selectedVersion && (
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-500">
                Viewing findings for{" "}
                <strong className="font-medium text-slate-300">
                  {selectedContract.title}
                </strong>{" "}
                — Version{" "}
                <strong className="font-medium text-slate-300">
                  {selectedVersion.version_number}
                </strong>
              </div>
            )}
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400">
                <Filter className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Filters
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Refine Findings
                </h2>
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
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
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-40"
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
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none transition placeholder:text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-40"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-40"
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
          <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 px-6 py-14 text-center">
            <FileSearch className="mx-auto h-10 w-10 text-slate-700" />

            <h3 className="mt-4 text-base font-semibold text-slate-300">
              Select a contract version
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Choose a contract and version above to
              review its AI-generated risk findings.
            </p>
          </section>
        ) : findingsQuery.isPending ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-14 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-400" />

            <p className="mt-3 text-sm text-slate-500">
              Loading risk findings...
            </p>
          </section>
        ) : findingsQuery.isError ? (
          <section className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-400" />

            <h3 className="mt-3 text-base font-semibold text-red-300">
              Unable to load risk findings
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-400/70">
              The findings service could not return
              results for the selected contract version.
            </p>
          </section>
        ) : findings.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 px-6 py-14 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-emerald-500/50" />

            <h3 className="mt-4 text-base font-semibold text-slate-300">
              No findings found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              No risk findings match the selected
              contract version and current filters.
            </p>
          </section>
        ) : (
          <>
            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Findings
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Identified Contract Risks
                  </h2>
                </div>

                <span className="w-fit rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">
                  {total} total
                </span>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
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
              <section className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Page{" "}
                  <span className="font-medium text-slate-300">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-300">
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
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
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
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
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