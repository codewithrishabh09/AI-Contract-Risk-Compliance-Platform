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
        badge:
          "border-[#e8412c]/25 bg-[#e8412c]/10 text-[#c93625]",
        dot: "bg-[#e8412c]",
        score: "text-[#c93625]",
        soft: "bg-[#e8412c]/6",
      };

    case "HIGH":
      return {
        badge:
          "border-orange-300 bg-orange-50 text-orange-700",
        dot: "bg-orange-500",
        score: "text-orange-700",
        soft: "bg-orange-50/70",
      };

    case "MEDIUM":
      return {
        badge:
          "border-amber-300 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
        score: "text-amber-700",
        soft: "bg-amber-50/70",
      };

    case "LOW":
      return {
        badge:
          "border-[#9caf88]/45 bg-[#e5eadf] text-[#526344]",
        dot: "bg-[#718060]",
        score: "text-[#526344]",
        soft: "bg-[#e5eadf]/70",
      };

    default:
      return {
        badge:
          "border-[#dddcd3] bg-white text-[#687268]",
        dot: "bg-[#8b948c]",
        score: "text-[#243027]",
        soft: "bg-[#f7f5ef]",
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

function SectionEyebrow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#718060]">
      {children}
    </p>
  );
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
    <section className="lexmind-card overflow-hidden">
      <div className="border-b border-[#dddcd3] px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <SectionEyebrow>Processing State</SectionEyebrow>

            <h3 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
              Analysis Pipeline
            </h3>
          </div>

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
              isProcessing
                ? "border-[#9caf88]/40 bg-[#e5eadf] text-[#526344]"
                : isCompleted
                  ? "border-[#9caf88]/40 bg-[#e5eadf] text-[#526344]"
                  : isFailed
                    ? "border-[#e8412c]/25 bg-[#e8412c]/10 text-[#c93625]"
                    : "border-[#dddcd3] bg-[#f7f5ef] text-[#718060]"
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
      </div>

      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span
            className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${
              isProcessing
                ? "border-[#9caf88]/45 bg-[#e5eadf] text-[#526344]"
                : isCompleted
                  ? "border-[#9caf88]/45 bg-[#e5eadf] text-[#526344]"
                  : isFailed
                    ? "border-[#e8412c]/25 bg-[#e8412c]/10 text-[#c93625]"
                    : "border-[#dddcd3] bg-white text-[#687268]"
            }`}
          >
            {getJobStatusLabel(jobStatus)}
          </span>

          {isProcessing && (
            <span className="text-sm text-[#687268]">
              AI engine is processing the selected contract version.
            </span>
          )}

          {isCompleted && (
            <span className="text-sm text-[#687268]">
              Analysis completed successfully.
            </span>
          )}

          {isFailed && (
            <span className="text-sm text-[#c93625]">
              The analysis job did not complete successfully.
            </span>
          )}

          {!jobStatus && (
            <span className="text-sm text-[#687268]">
              Start an analysis to generate risk intelligence.
            </span>
          )}
        </div>
      </div>
    </section>
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
    <section className="lexmind-card overflow-hidden">
      <div className="border-b border-[#dddcd3] px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <SectionEyebrow>Risk Overview</SectionEyebrow>

            <h3 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
              Contract Risk Profile
            </h3>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f5ef] text-[#718060]">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
        <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef]/75 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#718060]">
            Overall Score
          </p>

          <div className="mt-3 flex items-end gap-1">
            <span
              className={`text-4xl font-semibold tracking-tight ${riskClasses.score}`}
            >
              {score ?? "—"}
            </span>

            {score !== null && score !== undefined && (
              <span className="mb-1.5 text-sm text-[#8b948c]">
                / 100
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-[#8b948c]">
            Overall contractual risk assessment
          </p>
        </div>

        <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef]/75 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#718060]">
            Risk Level
          </p>

          <div className="mt-4">
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

        <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef]/75 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#718060]">
            Analysis Status
          </p>

          <p className="mt-4 text-sm font-semibold text-[#243027]">
            {status || "Not analyzed"}
          </p>
        </div>
      </div>
    </section>
  );
}

function FindingMiniCard({
  finding,
}: {
  finding: RiskFinding;
}) {
  const riskClasses = getRiskClasses(finding.severity);

  return (
    <article className="group rounded-2xl border border-[#dddcd3] bg-white p-5 transition-shadow hover:shadow-[0_16px_36px_rgba(36,48,39,0.07)]">
      <div className="flex items-start justify-between gap-4">
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

            <span className="rounded-full border border-[#dddcd3] bg-[#f7f5ef] px-2.5 py-1 text-[11px] font-medium text-[#687268]">
              {finding.category}
            </span>
          </div>

          <h4 className="font-semibold leading-6 text-[#243027]">
            {finding.title}
          </h4>

          {finding.description && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#687268]">
              {finding.description}
            </p>
          )}
        </div>

        {finding.confidence_score !== null &&
          finding.confidence_score !== undefined && (
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8b948c]">
                Confidence
              </p>

              <p className="mt-1 text-sm font-semibold text-[#243027]">
                {Math.round(
                  finding.confidence_score * 100,
                )}
                %
              </p>
            </div>
          )}
      </div>

      {finding.evidence_text && (
        <div className="mt-4 rounded-xl border border-[#dddcd3] bg-[#f7f5ef]/70 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#718060]">
            Evidence
          </p>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#687268]">
            {finding.evidence_text}
          </p>
        </div>
      )}
    </article>
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
    <div className="lexmind-page min-h-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="lexmind-card relative overflow-hidden">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9caf88]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-[#e8412c]/5 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#9caf88]/40 bg-[#e5eadf] text-[#526344]">
                    <Bot className="h-5 w-5" />
                  </div>

                  <SectionEyebrow>
                    AI Contract Intelligence
                  </SectionEyebrow>
                </div>

                <h1 className="lexmind-display text-3xl font-medium tracking-tight text-[#243027] sm:text-4xl">
                  AI Analysis
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#687268] sm:text-[15px]">
                  Run the LexMind analysis engine against a
                  specific contract version and review its
                  risk intelligence, evidence, and
                  recommendations.
                </p>
              </div>

              <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-[#dddcd3] bg-[#f7f5ef]/80 p-4 lg:w-auto">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526344]">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#243027]">
                    AI Risk Engine
                  </p>

                  <p className="mt-0.5 text-xs text-[#718060]">
                    Evidence-backed analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration */}
        <section className="lexmind-card overflow-hidden">
          <div className="border-b border-[#dddcd3] px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <SectionEyebrow>
                  Analysis Configuration
                </SectionEyebrow>

                <h2 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
                  Select Contract Version
                </h2>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#f7f5ef] text-[#718060] sm:flex">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto]">
              {/* Contract */}
              <div>
                <label
                  htmlFor="analysis-contract"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#718060]"
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
                  className="w-full rounded-xl border border-[#d5d7cf] bg-white px-4 py-3 text-sm text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-4 focus:ring-[#9caf88]/10"
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
                  <p className="mt-2 text-xs text-[#8b948c]">
                    Loading contracts...
                  </p>
                )}

                {contractsQuery.isError && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#c93625]">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Unable to load contracts.
                  </p>
                )}
              </div>

              {/* Version */}
              <div>
                <label
                  htmlFor="analysis-version"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#718060]"
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
                  className="w-full rounded-xl border border-[#d5d7cf] bg-white px-4 py-3 text-sm text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-4 focus:ring-[#9caf88]/10 disabled:cursor-not-allowed disabled:bg-[#f7f5ef] disabled:text-[#9ca39c]"
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
                    <p className="mt-2 text-xs text-[#8b948c]">
                      Loading versions...
                    </p>
                  )}

                {contractDetailQuery
                  .versionsQuery.isError && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#c93625]">
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
                    <p className="mt-2 text-xs text-amber-700">
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8412c] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,65,44,0.18)] transition hover:bg-[#cf3826] disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto lg:min-w-[190px]"
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
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef]/70 px-4 py-3 text-xs text-[#687268]">
                  <span>
                    Contract:{" "}
                    <strong className="font-semibold text-[#243027]">
                      {selectedContract.title}
                    </strong>
                  </span>

                  <span>
                    Type:{" "}
                    <strong className="font-semibold text-[#243027]">
                      {selectedContract.contract_type}
                    </strong>
                  </span>

                  <span>
                    Version:{" "}
                    <strong className="font-semibold text-[#243027]">
                      {selectedVersion.version_number}
                    </strong>
                  </span>
                </div>
              )}

            {startAnalysisMutation.isError && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#e8412c]/20 bg-[#e8412c]/5 px-4 py-3 text-sm text-[#c93625]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <div>
                  <p className="font-semibold">
                    Unable to start analysis.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#c93625]/80">
                    Please verify that the selected
                    contract version is available and
                    that your account has analysis
                    permission.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Processing */}
        {(activeJobId ||
          latestAnalysisQuery.isFetching) && (
          <AnalysisStatusCard
            jobStatus={jobStatus}
          />
        )}

        {jobError && (
          <section className="rounded-2xl border border-[#e8412c]/20 bg-[#e8412c]/5 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8412c]/10 text-[#c93625]">
                <XCircle className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-[#243027]">
                  Analysis failed
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#c93625]">
                  {jobError}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Loading */}
        {selectedVersionId &&
          latestAnalysisQuery.isPending && (
            <section className="lexmind-card px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#526344]">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>

              <p className="mt-4 text-sm font-medium text-[#243027]">
                Loading latest analysis...
              </p>

              <p className="mt-1 text-xs text-[#8b948c]">
                Retrieving the latest risk intelligence.
              </p>
            </section>
          )}

        {/* Analysis error */}
        {selectedVersionId &&
          latestAnalysisQuery.isError &&
          !latestAnalysisQuery.isPending && (
            <section className="lexmind-card p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-[#243027]">
                    No completed analysis available
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#687268]">
                    This version has not produced a
                    readable analysis result yet. Start
                    an AI analysis to generate risk
                    intelligence.
                  </p>
                </div>
              </div>
            </section>
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
              <section className="lexmind-card overflow-hidden">
                <div className="border-b border-[#dddcd3] px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526344]">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div>
                      <SectionEyebrow>
                        AI Summary
                      </SectionEyebrow>

                      <h3 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
                        Contract Intelligence
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef]/70 p-5">
                    <p className="whitespace-pre-line text-sm leading-7 text-[#687268]">
                      {latestAnalysis.summary ||
                        "The AI engine did not return a summary for this analysis."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Distribution */}
              <section className="lexmind-card overflow-hidden">
                <div className="border-b border-[#dddcd3] px-5 py-5 sm:px-6">
                  <SectionEyebrow>
                    Risk Findings
                  </SectionEyebrow>

                  <h3 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
                    Severity Distribution
                  </h3>
                </div>

                <div className="space-y-3 p-5 sm:p-6">
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
                          className={`flex items-center justify-between rounded-xl border border-[#dddcd3] px-4 py-3.5 ${riskClasses.soft}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${riskClasses.dot}`}
                            />

                            <span className="text-sm font-medium text-[#243027]">
                              {label}
                            </span>
                          </div>

                          <span className="text-lg font-semibold text-[#243027]">
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
            <section className="lexmind-card overflow-hidden">
              <div className="border-b border-[#dddcd3] px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <SectionEyebrow>
                      AI Findings
                    </SectionEyebrow>

                    <h3 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
                      Identified Contract Risks
                    </h3>
                  </div>

                  <span className="w-fit rounded-full border border-[#dddcd3] bg-[#f7f5ef] px-3 py-1 text-xs font-semibold text-[#687268]">
                    {findingsQuery.data?.total ??
                      findings.length}{" "}
                    findings
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {findingsQuery.isPending ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526344]">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                ) : findings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#cfd4c9] bg-[#f7f5ef]/60 px-5 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#526344]">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-[#243027]">
                      No risk findings were returned.
                    </p>

                    <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#8b948c]">
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
              </div>
            </section>

            {/* Metadata */}
            <section className="lexmind-card overflow-hidden">
              <div className="border-b border-[#dddcd3] px-5 py-5 sm:px-6">
                <SectionEyebrow>
                  Analysis Metadata
                </SectionEyebrow>

                <h3 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
                  Model & Execution Details
                </h3>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef]/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#718060]">
                    Provider
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#243027]">
                    {latestAnalysis.model_provider ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef]/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#718060]">
                    Model
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-[#243027]">
                    {latestAnalysis.model_name ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef]/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#718060]">
                    Prompt Version
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#243027]">
                    {latestAnalysis.prompt_version ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef]/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#718060]">
                    Version
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#243027]">
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