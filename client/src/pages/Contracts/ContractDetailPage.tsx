import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FilePlus2,
  FileText,
  Filter,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useContractDetail,
} from "../../features/contracts/useContractDetail";

import {
  useAnalysisJob,
  useContractRiskTrend,
  useLatestContractAnalysis,
  useRiskFindings,
  useStartContractAnalysis,
} from "../../features/contracts/useContractAnalysis";

import RiskFindingCard from "../../components/findings/RiskFindingCard";
import ContractQaPanel from "../../components/qa/ContractQaPanel";
import RiskTrendCard from "../../components/contracts/RiskTrendCard";

function formatDate(
  value: string,
) {
  return new Date(value).toLocaleDateString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function formatDateTime(
  value: string,
) {
  return new Date(value).toLocaleString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function formatContractType(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function formatStatus(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getStatusClasses(
  status: string,
) {
  switch (status) {
    case "APPROVED":
      return "border-[#9caf88] bg-[#e5eadf] text-[#526047]";

    case "ANALYZED":
      return "border-[#9caf88]/70 bg-[#e5eadf]/70 text-[#526047]";

    case "UNDER_REVIEW":
      return "border-amber-300 bg-amber-50 text-amber-700";

    case "PROCESSING":
      return "border-[#c8d3be] bg-[#eef2ea] text-[#66745c]";

    case "REJECTED":
      return "border-[#e8412c]/25 bg-[#e8412c]/10 text-[#c93625]";

    case "ARCHIVED":
      return "border-[#dddcd3] bg-[#f0eee8] text-[#7a8179]";

    case "UPLOADED":
      return "border-[#c8d3be] bg-[#eef2ea] text-[#66745c]";

    default:
      return "border-[#dddcd3] bg-[#f0eee8] text-[#7a8179]";
  }
}

function getRiskClasses(
  riskLevel: string | null,
) {
  switch (riskLevel) {
    case "CRITICAL":
      return "border-[#e8412c]/25 bg-[#e8412c]/10 text-[#c93625]";

    case "HIGH":
      return "border-orange-300 bg-orange-50 text-orange-700";

    case "MEDIUM":
      return "border-amber-300 bg-amber-50 text-amber-700";

    case "LOW":
      return "border-[#9caf88] bg-[#e5eadf] text-[#526047]";

    default:
      return "border-[#dddcd3] bg-[#f0eee8] text-[#7a8179]";
  }
}

function ContractDetailPage() {
  const navigate = useNavigate();

  const {
    contractId = "",
  } = useParams<{
    contractId: string;
  }>();

  const {
    contractQuery,
    versionsQuery,
  } = useContractDetail(contractId);

  // NOTE: All hooks must run before any early return.
  const versions = useMemo(
    () =>
      [...(versionsQuery.data?.items ?? [])].sort(
        (a, b) =>
          b.version_number -
          a.version_number,
      ),
    [versionsQuery.data?.items],
  );

  const currentVersion =
    versions[0] ?? null;

  const [analysisJobId, setAnalysisJobId] =
    useState<string | null>(null);

  const [findingSeverity, setFindingSeverity] =
    useState("");

  const [findingCategory, setFindingCategory] =
    useState("");

  const [findingStatus, setFindingStatus] =
    useState("");

  const [findingPage, setFindingPage] =
    useState(1);

  const findingPageSize = 5;

  const startAnalysisMutation =
    useStartContractAnalysis();

  const analysisJobQuery =
    useAnalysisJob(analysisJobId);

  const analysisQuery =
    useLatestContractAnalysis(
      contractId ?? "",
      currentVersion?.id ?? null,
    );

  const riskFindingsQuery =
    useRiskFindings(
      contractId ?? "",
      currentVersion?.id ?? null,
      {
        severity:
          findingSeverity || undefined,
        category:
          findingCategory || undefined,
        status:
          findingStatus || undefined,
        page: findingPage,
        page_size: findingPageSize,
      },
    );

  const riskTrendQuery =
    useContractRiskTrend(
      contractId ?? "",
      currentVersion?.id ?? null,
    );

  const jobStatus =
    analysisJobQuery.data?.status;

  const isJobFinished =
    jobStatus === "SUCCEEDED" ||
    jobStatus === "FAILED" ||
    jobStatus === "CANCELLED";

  const isAnalyzing =
    Boolean(analysisJobId) &&
    !isJobFinished;

  const findingCategories = useMemo(() => {
    const values =
      analysisQuery.data?.findings
        .map((finding) => finding.category)
        .filter(Boolean) ?? [];

    return [...new Set(values)].sort();
  }, [analysisQuery.data?.findings]);

  const findingStatuses = useMemo(() => {
    const values =
      analysisQuery.data?.findings
        .map((finding) => finding.status)
        .filter(Boolean) ?? [];

    return [...new Set(values)].sort();
  }, [analysisQuery.data?.findings]);

  const hasFindingFilters =
    Boolean(findingSeverity) ||
    Boolean(findingCategory) ||
    Boolean(findingStatus);

  const clearFindingFilters = () => {
    setFindingSeverity("");
    setFindingCategory("");
    setFindingStatus("");
    setFindingPage(1);
  };

  const handleSeverityChange = (
    value: string,
  ) => {
    setFindingSeverity(value);
    setFindingPage(1);
  };

  const handleCategoryChange = (
    value: string,
  ) => {
    setFindingCategory(value);
    setFindingPage(1);
  };

  const handleFindingStatusChange = (
    value: string,
  ) => {
    setFindingStatus(value);
    setFindingPage(1);
  };

  const handleAnalyzeContract = async () => {
    const id = contractQuery.data?.id;

    if (!id || !currentVersion?.id) {
      return;
    }

    try {
      const result =
        await startAnalysisMutation.mutateAsync({
          contractId: id,
          versionId: currentVersion.id,
        });

      setAnalysisJobId(result.job_id);
      setFindingPage(1);
    } catch {
      // Error is exposed through startAnalysisMutation.error.
    }
  };

  // Refresh analysis, findings and risk trend once the analysis job succeeds.
  useEffect(() => {
    if (jobStatus === "SUCCEEDED") {
      analysisQuery.refetch();
      riskFindingsQuery.refetch();
      riskTrendQuery.refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobStatus]);

  if (
    contractQuery.isLoading ||
    versionsQuery.isLoading
  ) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f7f5ef]">
        <div className="flex items-center gap-3 text-sm text-[#687268]">
          <LoaderCircle
            size={18}
            className="animate-spin text-[#718060]"
          />

          Loading contract...
        </div>
      </div>
    );
  }

  if (
    contractQuery.isError ||
    !contractQuery.data
  ) {
    return (
      <div className="relative min-h-full overflow-hidden bg-[#f7f5ef]">
        <div className="relative mx-auto max-w-[1200px] px-4 py-7 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() =>
              navigate("/contracts")
            }
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#687268] transition hover:text-[#526047]"
          >
            <ArrowLeft size={15} />

            Back to Contracts
          </button>

          <div className="rounded-2xl border border-[#e8412c]/20 bg-[#fffefa] p-8 text-center shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8412c]/10">
              <ShieldAlert
                size={25}
                className="text-[#e8412c]"
              />
            </div>

            <h1 className="mt-4 text-sm font-semibold text-[#c93625]">
              Unable to load contract
            </h1>

            <p className="mt-2 text-xs text-[#687268]">
              {contractQuery.error instanceof Error
                ? contractQuery.error.message
                : "The requested contract could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() =>
                contractQuery.refetch()
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-2.5 text-xs font-semibold text-[#526047] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
            >
              <RefreshCw size={14} />

              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const contract =
    contractQuery.data;

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f7f5ef]">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[620px] rounded-full bg-[#9caf88]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() =>
              navigate("/contracts")
            }
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-[#687268] transition hover:text-[#526047]"
          >
            <ArrowLeft size={15} />

            Back to Contracts
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAnalyzeContract}
              disabled={
                !currentVersion ||
                startAnalysisMutation.isPending ||
                isAnalyzing
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#243027] px-4 text-xs font-semibold text-white transition hover:bg-[#344238] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {startAnalysisMutation.isPending ||
              isAnalyzing ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}

              {isAnalyzing
                ? "Analyzing..."
                : startAnalysisMutation.isPending
                  ? "Starting..."
                  : "Analyze Contract"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/upload?contractId=${contract.id}`,
                )
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#e8412c] px-4 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(232,65,44,0.12)] transition hover:bg-[#d83a27]"
            >
              <FilePlus2 size={16} />

              Upload New Version
            </button>
          </div>
        </div>

        {/* Contract header */}
        <section className="rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-5 shadow-[0_14px_36px_rgba(36,48,39,0.045)] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c8d3be] bg-[#e5eadf] text-[#526047]">
                <FileText size={21} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#718060]">
                  Contract Workspace
                </div>

                <h1 className="lexmind-display truncate text-xl font-medium tracking-tight text-[#243027] sm:text-2xl">
                  {contract.title}
                </h1>

                <p className="mt-1 text-xs text-[#8a9189]">
                  ID: {contract.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusClasses(
                  contract.status,
                )}`}
              >
                {formatStatus(
                  contract.status,
                )}
              </span>

              {contract.risk_level ? (
                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${getRiskClasses(
                    contract.risk_level,
                  )}`}
                >
                  Risk:{" "}
                  {contract.risk_level}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        {/* Metadata */}
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-5 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
              <FileText size={13} />

              Contract Type
            </div>

            <p className="mt-3 text-sm font-semibold text-[#243027]">
              {formatContractType(
                contract.contract_type,
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-5 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
              <CalendarDays size={13} />

              Created
            </div>

            <p className="mt-3 text-sm font-semibold text-[#243027]">
              {formatDate(
                contract.created_at,
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-5 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
              <Clock3 size={13} />

              Last Updated
            </div>

            <p className="mt-3 text-sm font-semibold text-[#243027]">
              {formatDate(
                contract.updated_at,
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-5 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
              <CheckCircle2 size={13} />

              Current Version
            </div>

            <p className="mt-3 text-sm font-semibold text-[#243027]">
              {currentVersion
                ? `Version ${currentVersion.version_number}`
                : "No versions"}
            </p>
          </div>
        </section>

        {/* Description */}
        {contract.description ? (
          <section className="mt-5 rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-5 shadow-[0_10px_28px_rgba(36,48,39,0.035)] sm:p-6">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
              Description
            </div>

            <p className="mt-3 max-w-4xl text-sm leading-6 text-[#687268]">
              {contract.description}
            </p>
          </section>
        ) : null}

        {/* Analysis errors */}
        {startAnalysisMutation.isError && (
          <section className="mt-5 rounded-2xl border border-[#e8412c]/20 bg-[#fffefa] p-6 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#e8412c]/10 p-3">
                <AlertCircle className="h-5 w-5 text-[#e8412c]" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#c93625]">
                  Analysis could not be started
                </h2>

                <p className="mt-1 text-sm text-[#687268]">
                  Please try again. If the problem continues, check the processing
                  service and backend logs.
                </p>
              </div>
            </div>
          </section>
        )}

        {analysisJobQuery.data?.status === "FAILED" && (
          <section className="mt-5 rounded-2xl border border-[#e8412c]/20 bg-[#fffefa] p-6 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#e8412c]/10 p-3">
                <AlertCircle className="h-5 w-5 text-[#e8412c]" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#c93625]">
                  Contract analysis failed
                </h2>

                <p className="mt-1 text-sm text-[#687268]">
                  {analysisJobQuery.data.error_message ??
                    "The AI analysis job failed. Please try again."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Analysis in progress */}
        {isAnalyzing && (
          <section className="mt-5 rounded-2xl border border-[#9caf88]/40 bg-[#e5eadf]/60 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#9caf88]/20 p-3">
                <LoaderCircle className="h-5 w-5 animate-spin text-[#526047]" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#243027]">
                  AI analysis in progress
                </h2>

                <p className="mt-1 text-sm text-[#687268]">
                  LexMind is analyzing the latest contract version for risks,
                  compliance issues, and important clauses.
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#526047]">
                  <span className="rounded-full bg-[#9caf88]/20 px-2.5 py-1 font-semibold">
                    {analysisJobQuery.data?.status ?? "QUEUED"}
                  </span>

                  <span className="text-[#8a9189]">
                    This page will update automatically.
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI analysis result */}
        {analysisQuery.data && (
          <section className="mt-5 rounded-2xl border border-[#dddcd3] bg-[#243027] p-6 text-white shadow-[0_16px_40px_rgba(36,48,39,0.12)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#9caf88]" />

                  <h2 className="text-lg font-semibold text-white">
                    AI Risk Analysis
                  </h2>
                </div>

                <p className="mt-1 text-sm text-white/60">
                  Automated analysis of the latest contract version.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center">
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Risk Score
                  </p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    {analysisQuery.data.overall_risk_score ?? "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center">
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Risk Level
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#9caf88]">
                    {analysisQuery.data.risk_level}
                  </p>
                </div>
              </div>
            </div>

            {analysisQuery.data.summary && (
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                  AI Summary
                </p>

                <p className="mt-3 text-sm leading-7 text-white/75">
                  {analysisQuery.data.summary}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-xs text-white/55">
              <CheckCircle2 className="h-4 w-4 text-[#9caf88]" />

              <span>
                Analysis status: {analysisQuery.data.status}
              </span>
            </div>
          </section>
        )}

        {/* Risk trend */}
        {riskTrendQuery.isLoading ? (
          <section className="mt-5 rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-6 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex min-h-[180px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-[#687268]">
                <LoaderCircle
                  size={18}
                  className="animate-spin text-[#718060]"
                />

                Loading risk trend...
              </div>
            </div>
          </section>
        ) : riskTrendQuery.isError ? (
          <section className="mt-5 rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-6 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-start gap-3">
              <ShieldAlert
                size={18}
                className="mt-0.5 text-[#9aa198]"
              />

              <div>
                <p className="text-sm font-medium text-[#687268]">
                  Risk trend unavailable
                </p>

                <p className="mt-1 text-xs leading-5 text-[#8a9189]">
                  Risk history could not be loaded for this contract version.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    riskTrendQuery.refetch()
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-3 py-2 text-xs font-semibold text-[#526047] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
                >
                  <RefreshCw size={13} />

                  Try again
                </button>
              </div>
            </div>
          </section>
        ) : riskTrendQuery.data ? (
          <div className="mt-5">
            <RiskTrendCard
              trend={riskTrendQuery.data}
            />
          </div>
        ) : null}

        {/* Risk findings */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#dddcd3] bg-[#fffefa] shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
          <div className="border-b border-[#ebe9e1] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#718060]">
                    AI Risk Intelligence
                  </div>

                  <h2 className="lexmind-display mt-1 text-lg font-medium text-[#243027]">
                    Risk Findings
                  </h2>

                  <p className="mt-1 text-xs text-[#8a9189]">
                    Identified contract risks from the latest available analysis.
                  </p>
                </div>

                {analysisQuery.data ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#e8412c]/20 bg-[#e8412c]/5 px-3 py-1.5 text-[10px] font-semibold text-[#c93625]">
                      {
                        analysisQuery.data.findings.filter(
                          (finding) =>
                            finding.severity === "CRITICAL",
                        ).length
                      }{" "}
                      Critical
                    </span>

                    <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-semibold text-orange-700">
                      {
                        analysisQuery.data.findings.filter(
                          (finding) =>
                            finding.severity === "HIGH",
                        ).length
                      }{" "}
                      High
                    </span>

                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-700">
                      {
                        analysisQuery.data.findings.filter(
                          (finding) =>
                            finding.severity === "MEDIUM",
                        ).length
                      }{" "}
                      Medium
                    </span>

                    <span className="rounded-full border border-[#c8d3be] bg-[#e5eadf] px-3 py-1.5 text-[10px] font-semibold text-[#526047]">
                      {riskFindingsQuery.data?.total ??
                        analysisQuery.data.findings.length}{" "}
                      Total
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Filters */}
              {analysisQuery.data ? (
                <div className="rounded-xl border border-[#dddcd3] bg-[#f7f5ef] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#526047]">
                      <Filter size={14} />

                      Filter findings
                    </div>

                    {hasFindingFilters ? (
                      <button
                        type="button"
                        onClick={clearFindingFilters}
                        className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#8a9189] transition hover:text-[#526047]"
                      >
                        <X size={12} />

                        Clear filters
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
                        Severity
                      </span>

                      <select
                        value={findingSeverity}
                        onChange={(event) =>
                          handleSeverityChange(
                            event.target.value,
                          )
                        }
                        className="h-9 w-full rounded-xl border border-[#dddcd3] bg-white px-3 text-xs text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/15"
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
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
                        Category
                      </span>

                      <select
                        value={findingCategory}
                        onChange={(event) =>
                          handleCategoryChange(
                            event.target.value,
                          )
                        }
                        className="h-9 w-full rounded-xl border border-[#dddcd3] bg-white px-3 text-xs text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/15"
                      >
                        <option value="">
                          All categories
                        </option>

                        {findingCategories.map(
                          (category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {formatStatus(category)}
                            </option>
                          ),
                        )}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
                        Status
                      </span>

                      <select
                        value={findingStatus}
                        onChange={(event) =>
                          handleFindingStatusChange(
                            event.target.value,
                          )
                        }
                        className="h-9 w-full rounded-xl border border-[#dddcd3] bg-white px-3 text-xs text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/15"
                      >
                        <option value="">
                          All statuses
                        </option>

                        {findingStatuses.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {formatStatus(status)}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {analysisQuery.isLoading ||
          riskFindingsQuery.isLoading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-[#687268]">
                <LoaderCircle
                  size={18}
                  className="animate-spin text-[#718060]"
                />

                Loading risk findings...
              </div>
            </div>
          ) : analysisQuery.isError ? (
            <div className="p-6">
              <div className="flex items-start gap-3 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] p-5">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-[#9aa198]"
                />

                <div>
                  <p className="text-sm font-medium text-[#687268]">
                    No completed analysis available
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8a9189]">
                    Run AI analysis on this contract version to generate
                    risk findings.
                  </p>
                </div>
              </div>
            </div>
          ) : riskFindingsQuery.isError ? (
            <div className="p-6">
              <div className="rounded-xl border border-[#e8412c]/20 bg-[#e8412c]/5 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 text-[#e8412c]"
                  />

                  <div>
                    <p className="text-sm font-medium text-[#c93625]">
                      Unable to load risk findings
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#687268]">
                      The findings service could not return the requested
                      results.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        riskFindingsQuery.refetch()
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-3 py-2 text-xs font-semibold text-[#526047] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
                    >
                      <RefreshCw size={13} />

                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !riskFindingsQuery.data ||
            riskFindingsQuery.data.items.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[#c8d3be] bg-[#e5eadf]">
                  <CheckCircle2
                    size={18}
                    className="text-[#526047]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#243027]">
                  {hasFindingFilters
                    ? "No matching findings"
                    : "No risk findings"}
                </h3>

                <p className="mt-1 max-w-md text-xs leading-5 text-[#8a9189]">
                  {hasFindingFilters
                    ? "No findings match the selected filters. Try changing or clearing the filters."
                    : "No risk findings are currently available for the latest contract version."}
                </p>

                {hasFindingFilters ? (
                  <button
                    type="button"
                    onClick={clearFindingFilters}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-3 py-2 text-xs font-semibold text-[#526047] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
                  >
                    <X size={13} />

                    Clear filters
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 p-5 sm:p-6">
                {riskFindingsQuery.data.items.map(
                  (finding) => (
                    <RiskFindingCard
                      key={finding.id}
                      finding={finding}
                    />
                  ),
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-[#ebe9e1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="text-[11px] text-[#8a9189]">
                  Showing{" "}
                  <span className="font-semibold text-[#526047]">
                    {Math.min(
                      (riskFindingsQuery.data.page - 1) *
                        riskFindingsQuery.data.page_size +
                        1,
                      riskFindingsQuery.data.total,
                    )}
                  </span>
                  {" "}–{" "}
                  <span className="font-semibold text-[#526047]">
                    {Math.min(
                      riskFindingsQuery.data.page *
                        riskFindingsQuery.data.page_size,
                      riskFindingsQuery.data.total,
                    )}
                  </span>
                  {" "}of{" "}
                  <span className="font-semibold text-[#526047]">
                    {riskFindingsQuery.data.total}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      !riskFindingsQuery.data.has_previous
                    }
                    onClick={() =>
                      setFindingPage(
                        (page) =>
                          Math.max(page - 1, 1),
                      )
                    }
                    className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3 text-[10px] font-semibold text-[#687268] transition hover:border-[#9caf88] hover:bg-[#e5eadf] hover:text-[#526047] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={13} />

                    Previous
                  </button>

                  <span className="rounded-xl bg-[#243027] px-3 py-1.5 text-[10px] font-semibold text-white">
                    Page{" "}
                    {riskFindingsQuery.data.page}
                    {" "}of{" "}
                    {Math.max(
                      riskFindingsQuery.data.total_pages,
                      1,
                    )}
                  </span>

                  <button
                    type="button"
                    disabled={
                      !riskFindingsQuery.data.has_next
                    }
                    onClick={() =>
                      setFindingPage(
                        (page) =>
                          page + 1,
                      )
                    }
                    className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3 text-[10px] font-semibold text-[#687268] transition hover:border-[#9caf88] hover:bg-[#e5eadf] hover:text-[#526047] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next

                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Contract Q&A */}
        {currentVersion ? (
          <div className="mt-5">
            <ContractQaPanel
              contractId={contract.id}
              versionId={currentVersion.id}
            />
          </div>
        ) : null}

        {/* Version history */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#dddcd3] bg-[#fffefa] shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
          <div className="flex flex-col gap-3 border-b border-[#ebe9e1] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#718060]">
                Document Lifecycle
              </div>

              <h2 className="lexmind-display mt-1 text-lg font-medium text-[#243027]">
                Version History
              </h2>
            </div>

            <span className="text-[11px] text-[#8a9189]">
              {versions.length}{" "}
              {versions.length === 1
                ? "version"
                : "versions"}
            </span>
          </div>

          {versionsQuery.isError ? (
            <div className="p-6">
              <div className="rounded-xl border border-[#e8412c]/20 bg-[#e8412c]/5 p-4 text-xs text-[#c93625]">
                Unable to load version
                history.
              </div>
            </div>
          ) : versions.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[#dddcd3] bg-[#e5eadf]">
                  <FileText
                    size={18}
                    className="text-[#526047]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#243027]">
                  No document versions
                </h3>

                <p className="mt-1 text-xs text-[#8a9189]">
                  Upload a document to create
                  the first version.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#ebe9e1]">
              {versions.map(
                (
                  version,
                  index,
                ) => {
                  const isCurrent =
                    index === 0;

                  return (
                    <div
                      key={version.id}
                      className={`relative px-5 py-5 transition sm:px-6 ${
                        isCurrent
                          ? "bg-[#e5eadf]/45"
                          : "hover:bg-[#f7f5ef]/70"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                            isCurrent
                              ? "border-[#9caf88] bg-[#e5eadf] text-[#526047]"
                              : "border-[#dddcd3] bg-[#f7f5ef] text-[#8a9189]"
                          }`}
                        >
                          v
                          {
                            version.version_number
                          }
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-[#243027]">
                                Version{" "}
                                {
                                  version.version_number
                                }
                              </span>

                              {isCurrent ? (
                                <span className="rounded-full border border-[#9caf88] bg-[#e5eadf] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#526047]">
                                  Current
                                </span>
                              ) : null}
                            </div>

                            <span className="text-[10px] text-[#8a9189]">
                              {formatDateTime(
                                version.created_at,
                              )}
                            </span>
                          </div>

                          <p className="mt-2 text-xs leading-5 text-[#687268]">
                            {version.change_summary ||
                              "No change summary provided."}
                          </p>

                          <p className="mt-2 text-[10px] text-[#9aa198]">
                            Uploaded by{" "}
                            {version.uploaded_by}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ContractDetailPage;