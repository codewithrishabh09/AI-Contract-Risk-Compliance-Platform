import { useMemo, useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Play,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  useAnalysisJob,
  useLatestContractAnalysis,
  useRiskFindings,
  useStartContractAnalysis,
} from "../../features/contracts/useContractAnalysis";
import { useContractDetail } from "../../features/contracts/useContractDetail";
import { useContracts } from "../../features/contracts/useContracts";

import type {
  Contract,
  ContractVersion,
} from "../../types/contracts";

import type {
  RiskFinding,
  RiskLevel,
} from "../../types/analysis";

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getRiskClasses(level: string | null | undefined) {
  switch (level?.toUpperCase()) {
    case "CRITICAL":
      return {
        badge: "border-red-500/30 bg-red-500/10 text-red-300",
        dot: "bg-red-400",
        score: "text-red-300",
      };

    case "HIGH":
      return {
        badge: "border-orange-500/30 bg-orange-500/10 text-orange-300",
        dot: "bg-orange-400",
        score: "text-orange-300",
      };

    case "MEDIUM":
      return {
        badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        dot: "bg-amber-400",
        score: "text-amber-300",
      };

    case "LOW":
      return {
        badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        dot: "bg-emerald-400",
        score: "text-emerald-300",
      };

    default:
      return {
        badge: "border-slate-600 bg-slate-800/60 text-slate-300",
        dot: "bg-slate-400",
        score: "text-slate-200",
      };
  }
}

function getJobStatusLabel(status: string | undefined) {
  switch (status) {
    case "QUEUED":
      return "Queued";

    case "RUNNING":
      return "Processing";

    case "SUCCEEDED":
    case "COMPLETED":
      return "Completed";

    case "FAILED":
      return "Failed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status || "Not started";
  }
}

function isJobRunning(status: string | undefined) {
  return status === "QUEUED" || status === "RUNNING";
}

function isJobCompleted(status: string | undefined) {
  return status === "SUCCEEDED" || status === "COMPLETED";
}

function isJobFailed(status: string | undefined) {
  return status === "FAILED" || status === "CANCELLED";
}

function getFindingCount(
  findings: RiskFinding[],
  level: RiskLevel,
) {
  return findings.filter(
    (finding) =>
      finding.severity?.toUpperCase() === level,
  ).length;
}

function AnalysisStatusCard({
  jobStatus,
}: {
  jobStatus: string | undefined;
}) {
  const isProcessing = isJobRunning(jobStatus);
  const isCompleted = isJobCompleted(jobStatus);
  const isFailed = isJobFailed(jobStatus);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Processing State
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            Analysis Pipeline
          </h3>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            isProcessing
              ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
              : isCompleted
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : isFailed
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-slate-700 bg-slate-900 text-slate-400"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isCompleted ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : isFailed ? (
            <XCircle className="h-5 w-5" />
          ) : (
            <Clock3 className="h-5 w-5" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${
            isProcessing
              ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
              : isCompleted
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : isFailed
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : "border-slate-700 bg-slate-900 text-slate-400"
          }`}
        >
          {getJobStatusLabel(jobStatus)}
        </span>

        {isProcessing && (
          <span className="text-sm text-slate-500">
            AI engine is processing the selected contract version.
          </span>
        )}

        {isCompleted && (
          <span className="text-sm text-slate-500">
            Analysis completed successfully.
          </span>
        )}

        {isFailed && (
          <span className="text-sm text-red-400">
            The analysis job did not complete successfully.
          </span>
        )}

        {!jobStatus && (
          <span className="text-sm text-slate-500">
            Start an analysis to generate risk intelligence.
          </span>
        )}
      </div>
    </div>
  );
}

function RiskSummaryCard({
  score,
  level,
  status,
}: {
  score: number | null | undefined;
  level: string | null | undefined;
  status: string | null | undefined;
}) {
  const riskClasses = getRiskClasses(level);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Risk Overview
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            Contract Risk Profile
          </h3>
        </div>

        <ShieldAlert className="h-5 w-5 text-slate-500" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Overall Score
          </p>

          <div className="mt-2 flex items-end gap-1">
            <span
              className={`text-3xl font-bold ${riskClasses.score}`}
            >
              {score ?? "—"}
            </span>

            {score !== null && score !== undefined && (
              <span className="mb-1 text-sm text-slate-500">
                / 100
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Risk Level
          </p>

          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${riskClasses.badge}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${riskClasses.dot}`}
              />

              {level || "Not available"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Analysis Status
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-200">
            {status || "Not analyzed"}
          </p>
        </div>
      </div>
    </div>
  );
}

function FindingMiniCard({
  finding,
}: {
  finding: RiskFinding;
}) {
  const riskClasses = getRiskClasses(finding.severity);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${riskClasses.badge}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${riskClasses.dot}`}
              />

              {finding.severity}
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-[11px] font-medium text-slate-400">
              {finding.category}
            </span>
          </div>

          <h4 className="font-semibold text-slate-100">
            {finding.title}
          </h4>

          {finding.description && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
              {finding.description}
            </p>
          )}
        </div>

        {finding.confidence_score !== null &&
          finding.confidence_score !== undefined && (
            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-wide text-slate-600">
                Confidence
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-300">
                {Math.round(
                  finding.confidence_score * 100,
                )}
                %
              </p>
            </div>
          )}
      </div>

      {finding.evidence_text && (
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Evidence
          </p>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {finding.evidence_text}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AnalysisPage() {
  const [selectedContractId, setSelectedContractId] =
    useState("");

  const [selectedVersionId, setSelectedVersionId] =
    useState("");

  const [activeJobId, setActiveJobId] =
    useState<string | null>(null);

  const contractsQuery = useContracts({
    page: 1,
    page_size: 100,
  });

  const contractDetailQuery = useContractDetail(
    selectedContractId,
  );

  const selectedContract = useMemo<Contract | undefined>(
    () => {
      return contractsQuery.data?.items.find(
        (contract) =>
          contract.id === selectedContractId,
      );
    },
    [
      contractsQuery.data?.items,
      selectedContractId,
    ],
  );

  const versions = useMemo<ContractVersion[]>(
    () => {
      return (
        contractDetailQuery.versionsQuery.data
          ?.items ?? []
      );
    },
    [contractDetailQuery.versionsQuery.data],
  );

  const selectedVersion = useMemo<
    ContractVersion | undefined
  >(
    () => {
      return versions.find(
        (version) =>
          version.id === selectedVersionId,
      );
    },
    [versions, selectedVersionId],
  );

  const latestAnalysisQuery =
    useLatestContractAnalysis(
      selectedContractId,
      selectedVersionId || null,
    );

  const findingsQuery = useRiskFindings(
    selectedContractId,
    selectedVersionId || null,
    {
      page: 1,
      page_size: 100,
    },
  );

  const startAnalysisMutation =
    useStartContractAnalysis();

  const analysisJobQuery =
    useAnalysisJob(activeJobId);

  const latestAnalysis =
    latestAnalysisQuery.data;

  const findings =
    findingsQuery.data?.items ?? [];

  const jobStatus =
    analysisJobQuery.data?.status;

  const isRunning =
    startAnalysisMutation.isPending ||
    isJobRunning(jobStatus);

  const canRunAnalysis =
    Boolean(selectedContractId) &&
    Boolean(selectedVersionId) &&
    !isRunning;

  const handleContractChange = (
    contractId: string,
  ) => {
    setSelectedContractId(contractId);
    setSelectedVersionId("");
    setActiveJobId(null);
  };

  const handleVersionChange = (
    versionId: string,
  ) => {
    setSelectedVersionId(versionId);
    setActiveJobId(null);
  };

  const handleRunAnalysis = async () => {
    if (
      !selectedContractId ||
      !selectedVersionId
    ) {
      return;
    }

    try {
      const response =
        await startAnalysisMutation.mutateAsync({
          contractId: selectedContractId,
          versionId: selectedVersionId,
        });

      setActiveJobId(response.job_id);
    } catch {
      // Mutation state exposes the error to the UI.
    }
  };

  const jobError =
    jobStatus === "FAILED"
      ? analysisJobQuery.data?.error_message
      : null;

  const hasAnalysis =
    latestAnalysis !== null &&
    latestAnalysis !== undefined;

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
                  <Bot className="h-5 w-5" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                  AI Contract Intelligence
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                AI Analysis
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Run the LexMind analysis engine against a
                specific contract version and review its
                risk intelligence, evidence, and
                recommendations.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
              <Sparkles className="h-4 w-4 text-blue-300" />

              <div>
                <p className="text-xs font-semibold text-slate-300">
                  AI Risk Engine
                </p>

                <p className="text-[11px] text-slate-500">
                  Evidence-backed analysis
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Analysis Configuration
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Select Contract Version
              </h2>
            </div>

            <FileText className="h-5 w-5 text-slate-600" />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
            {/* Contract */}
            <div>
              <label
                htmlFor="analysis-contract"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Contract
              </label>

              <select
                id="analysis-contract"
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
                htmlFor="analysis-version"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Contract Version
              </label>

              <select
                id="analysis-version"
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
                    {" — "}
                    {formatDate(
                      version.created_at,
                    )}
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
                    No uploaded versions are available
                    for this contract.
                  </p>
                )}
            </div>

            {/* Action */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={!canRunAnalysis}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto lg:min-w-[180px]"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run AI Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {selectedContract &&
            selectedVersion && (
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-500">
                <span>
                  Contract:{" "}
                  <strong className="font-medium text-slate-300">
                    {selectedContract.title}
                  </strong>
                </span>

                <span>
                  Type:{" "}
                  <strong className="font-medium text-slate-300">
                    {selectedContract.contract_type}
                  </strong>
                </span>

                <span>
                  Version:{" "}
                  <strong className="font-medium text-slate-300">
                    {
                      selectedVersion.version_number
                    }
                  </strong>
                </span>
              </div>
            )}

          {startAnalysisMutation.isError && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <div>
                <p className="font-medium">
                  Unable to start analysis.
                </p>

                <p className="mt-1 text-xs text-red-400/80">
                  Please verify that the selected
                  contract version is available and
                  that your account has analysis
                  permission.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Processing */}
        {(activeJobId ||
          latestAnalysisQuery.isFetching) && (
          <AnalysisStatusCard
            jobStatus={jobStatus}
          />
        )}

        {jobError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 text-red-400" />

              <div>
                <h3 className="font-semibold text-red-300">
                  Analysis failed
                </h3>

                <p className="mt-1 text-sm leading-6 text-red-400/80">
                  {jobError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {selectedVersionId &&
          latestAnalysisQuery.isPending && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-400" />

              <p className="mt-3 text-sm text-slate-400">
                Loading latest analysis...
              </p>
            </div>
          )}

        {/* Analysis error */}
        {selectedVersionId &&
          latestAnalysisQuery.isError &&
          !latestAnalysisQuery.isPending && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-400" />

                <div>
                  <h3 className="font-semibold text-slate-200">
                    No completed analysis available
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    This version has not produced a
                    readable analysis result yet. Start
                    an AI analysis to generate risk
                    intelligence.
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Analysis result */}
        {hasAnalysis && latestAnalysis && (
          <>
            <RiskSummaryCard
              score={
                latestAnalysis.overall_risk_score
              }
              level={latestAnalysis.risk_level}
              status={latestAnalysis.status}
            />

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              {/* AI Summary */}
              <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      AI Summary
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-white">
                      Contract Intelligence
                    </h3>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-400">
                    {latestAnalysis.summary ||
                      "The AI engine did not return a summary for this analysis."}
                  </p>
                </div>
              </section>

              {/* Distribution */}
              <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Risk Findings
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">
                    Severity Distribution
                  </h3>
                </div>

                <div className="space-y-3">
                  {(
                    [
                      ["CRITICAL", "Critical"],
                      ["HIGH", "High"],
                      ["MEDIUM", "Medium"],
                      ["LOW", "Low"],
                    ] as const
                  ).map(
                    ([level, label]) => {
                      const count =
                        getFindingCount(
                          findings,
                          level,
                        );

                      const riskClasses =
                        getRiskClasses(level);

                      return (
                        <div
                          key={level}
                          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${riskClasses.dot}`}
                            />

                            <span className="text-sm font-medium text-slate-300">
                              {label}
                            </span>
                          </div>

                          <span className="text-lg font-semibold text-white">
                            {count}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </section>
            </div>

            {/* Findings */}
            <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    AI Findings
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">
                    Identified Contract Risks
                  </h3>
                </div>

                <span className="w-fit rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">
                  {findingsQuery.data?.total ??
                    findings.length}{" "}
                  findings
                </span>
              </div>

              {findingsQuery.isPending ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                </div>
              ) : findings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 px-5 py-10 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400/70" />

                  <p className="mt-3 text-sm font-medium text-slate-300">
                    No risk findings were returned.
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    The selected contract version
                    currently has no identified findings
                    from the analysis engine.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {findings.map((finding) => (
                    <FindingMiniCard
                      key={finding.id}
                      finding={finding}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Metadata */}
            <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Analysis Metadata
                </p>

                <h3 className="mt-1 text-lg font-semibold text-white">
                  Model & Execution Details
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-600">
                    Provider
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-200">
                    {latestAnalysis.model_provider ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-600">
                    Model
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-slate-200">
                    {latestAnalysis.model_name ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-600">
                    Prompt Version
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-200">
                    {latestAnalysis.prompt_version ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-600">
                    Version
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-200">
                    {selectedVersion
                      ? `v${selectedVersion.version_number}`
                      : "—"}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}