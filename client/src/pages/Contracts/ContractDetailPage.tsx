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
  Upload,
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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatContractType(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusClasses(status: string) {
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

function getRiskClasses(riskLevel: string | null) {
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

function getRiskScoreClass(score: number | null | undefined) {
  if (score === null || score === undefined) {
    return "text-[#687268]";
  }

  if (score >= 80) {
    return "text-[#e8412c]";
  }

  if (score >= 50) {
    return "text-amber-600";
  }

  return "text-[#718060]";
}

function OverviewItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e3da] bg-[#faf9f5] px-4 py-4">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a9189]">
        <Icon size={13} strokeWidth={1.8} />
        {label}
      </div>

      <p className="mt-2 text-sm font-semibold text-[#243027]">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#ebe9e1] px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#718060]">
          {eyebrow}
        </p>

        <h2 className="lexmind-display mt-1 text-xl font-medium tracking-[-0.02em] text-[#243027]">
          {title}
        </h2>

        {description ? (
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#8a9189]">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="shrink-0">
          {action}
        </div>
      ) : null}
    </div>
  );
}

function ContractDetailPage() {
  const navigate = useNavigate();

  const { contractId = "" } = useParams<{
    contractId: string;
  }>();

  const {
    contractQuery,
    versionsQuery,
  } = useContractDetail(contractId);

  const versions = useMemo(
    () =>
      [...(versionsQuery.data?.items ?? [])].sort(
        (a, b) => b.version_number - a.version_number,
      ),
    [versionsQuery.data?.items],
  );

  const currentVersion = versions[0] ?? null;

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
      <div className="min-h-full bg-[#f7f5ef]">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/contracts")}
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#687268] transition hover:text-[#526047]"
          >
            <ArrowLeft size={15} />

            Back to Contracts
          </button>

          <div className="rounded-[24px] border border-[#e8412c]/20 bg-[#fffefa] p-10 text-center shadow-[0_16px_40px_rgba(36,48,39,0.05)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8412c]/10">
              <ShieldAlert
                size={25}
                className="text-[#e8412c]"
              />
            </div>

            <h1 className="mt-5 font-['Playfair_Display'] text-2xl text-[#243027]">
              Unable to load contract
            </h1>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#687268]">
              {contractQuery.error instanceof Error
                ? contractQuery.error.message
                : "The requested contract could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() => contractQuery.refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-2.5 text-xs font-semibold text-[#526047] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
            >
              <RefreshCw size={14} />

              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const contract = contractQuery.data;

  const criticalCount =
    analysisQuery.data?.findings.filter(
      (finding) => finding.severity === "CRITICAL",
    ).length ?? 0;

  const highCount =
    analysisQuery.data?.findings.filter(
      (finding) => finding.severity === "HIGH",
    ).length ?? 0;

  const mediumCount =
    analysisQuery.data?.findings.filter(
      (finding) => finding.severity === "MEDIUM",
    ).length ?? 0;

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f7f5ef]">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[700px] rounded-full bg-[#9caf88]/8 blur-3xl" />

      <div className="relative mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb + actions */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/contracts")}
            className="inline-flex w-fit items-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold text-[#687268] transition hover:bg-[#fffefa] hover:text-[#526047]"
          >
            <ArrowLeft size={15} />

            Back to Contracts
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAnalyzeContract}
              disabled={
                !currentVersion ||
                startAnalysisMutation.isPending ||
                isAnalyzing
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#243027] bg-[#243027] px-4 text-xs font-semibold text-white transition hover:bg-[#344238] disabled:cursor-not-allowed disabled:opacity-50"
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
              <Upload size={15} />

              Upload New Version
            </button>
          </div>
        </div>

        {/* Contract hero */}
        <section className="overflow-hidden rounded-[26px] border border-[#dddcd3] bg-[#fffefa] shadow-[0_18px_45px_rgba(36,48,39,0.055)]">
          <div className="relative px-5 py-6 sm:px-7 sm:py-7">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#e5eadf]/70 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#c8d3be] bg-[#e5eadf] text-[#526047]">
                  <FileText size={23} strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#718060]">
                      Contract Workspace
                    </span>

                    <span className="text-[#c3c8c0]">
                      /
                    </span>

                    <span className="text-[10px] font-medium text-[#9aa198]">
                      {formatContractType(
                        contract.contract_type,
                      )}
                    </span>
                  </div>

                  <h1 className="lexmind-display mt-2 max-w-3xl text-2xl font-medium leading-tight tracking-[-0.03em] text-[#243027] sm:text-3xl">
                    {contract.title}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-[#8a9189]">
                    <span>
                      Contract ID:{" "}
                      <span className="font-medium text-[#687268]">
                        {contract.id}
                      </span>
                    </span>

                    {currentVersion ? (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#c4c9c0]" />

                        <span>
                          Version{" "}
                          <span className="font-semibold text-[#526047]">
                            {currentVersion.version_number}
                          </span>
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusClasses(
                    contract.status,
                  )}`}
                >
                  {formatStatus(contract.status)}
                </span>

                {contract.risk_level ? (
                  <span
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${getRiskClasses(
                      contract.risk_level,
                    )}`}
                  >
                    {contract.risk_level} Risk
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="border-t border-[#ebe9e1] bg-[#faf9f5] px-5 py-5 sm:px-7">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <OverviewItem
                icon={FileText}
                label="Contract Type"
                value={formatContractType(
                  contract.contract_type,
                )}
              />

              <OverviewItem
                icon={CheckCircle2}
                label="Current Version"
                value={
                  currentVersion
                    ? `Version ${currentVersion.version_number}`
                    : "No versions"
                }
              />

              <OverviewItem
                icon={CalendarDays}
                label="Created"
                value={formatDate(
                  contract.created_at,
                )}
              />

              <OverviewItem
                icon={Clock3}
                label="Last Updated"
                value={formatDate(
                  contract.updated_at,
                )}
              />
            </div>
          </div>
        </section>

        {/* Description */}
        {contract.description ? (
          <section className="mt-5 rounded-[22px] border border-[#dddcd3] bg-[#fffefa] px-5 py-5 shadow-[0_10px_28px_rgba(36,48,39,0.035)] sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526047]">
                <FileText size={16} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718060]">
                  Contract Description
                </p>

                <p className="mt-2 max-w-5xl text-sm leading-6 text-[#687268]">
                  {contract.description}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* Analysis errors */}
        {startAnalysisMutation.isError ? (
          <section className="mt-5 rounded-[22px] border border-[#e8412c]/20 bg-[#fffefa] p-5 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8412c]/10">
                <AlertCircle
                  size={18}
                  className="text-[#e8412c]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#c93625]">
                  Analysis could not be started
                </p>

                <p className="mt-1 text-xs leading-5 text-[#687268]">
                  Please try again. If the problem continues,
                  check the processing service and backend logs.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {analysisJobQuery.data?.status === "FAILED" ? (
          <section className="mt-5 rounded-[22px] border border-[#e8412c]/20 bg-[#fffefa] p-5 shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8412c]/10">
                <AlertCircle
                  size={18}
                  className="text-[#e8412c]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#c93625]">
                  Contract analysis failed
                </p>

                <p className="mt-1 text-xs leading-5 text-[#687268]">
                  {analysisJobQuery.data.error_message ??
                    "The AI analysis job failed. Please try again."}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* Analysis progress */}
        {isAnalyzing ? (
          <section className="mt-5 overflow-hidden rounded-[22px] border border-[#9caf88]/40 bg-[#eef2ea] shadow-[0_10px_28px_rgba(36,48,39,0.035)]">
            <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#9caf88]/20">
                <LoaderCircle
                  size={20}
                  className="animate-spin text-[#526047]"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-[#243027]">
                    AI analysis in progress
                  </h2>

                  <span className="rounded-full bg-[#dce5d4] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#526047]">
                    {analysisJobQuery.data?.status ??
                      "QUEUED"}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-[#687268]">
                  LexMind is analyzing the latest contract
                  version for risks, compliance issues, and
                  important clauses.
                </p>
              </div>
            </div>

            <div className="h-1 bg-[#dce5d4]">
              <div className="h-full w-2/3 rounded-r-full bg-[#9caf88]" />
            </div>
          </section>
        ) : null}

        {/* AI Analysis */}
        {analysisQuery.data ? (
          <section className="mt-5 overflow-hidden rounded-[24px] border border-[#2e3d33] bg-[#243027] shadow-[0_18px_45px_rgba(36,48,39,0.12)]">
            <div className="px-5 py-6 sm:px-7">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9caf88]/15 text-[#9caf88]">
                      <Sparkles size={17} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9caf88]">
                        AI Risk Intelligence
                      </p>

                      <h2 className="mt-1 text-lg font-semibold text-white">
                        Contract Risk Analysis
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-6 text-white/55">
                    Automated analysis of the latest contract
                    version across risk, compliance, obligations,
                    and important contractual clauses.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <div className="min-w-[120px] rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                      Risk Score
                    </p>

                    <p
                      className={`mt-1 text-3xl font-semibold tracking-[-0.04em] ${getRiskScoreClass(
                        analysisQuery.data.overall_risk_score,
                      )}`}
                    >
                      {analysisQuery.data.overall_risk_score ??
                        "—"}
                    </p>

                    <p className="mt-0.5 text-[9px] text-white/35">
                      out of 100
                    </p>
                  </div>

                  <div className="min-w-[120px] rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                      Risk Level
                    </p>

                    <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[#9caf88]">
                      {analysisQuery.data.risk_level}
                    </p>

                    <div className="mt-2 flex justify-center">
                      <span className="h-1.5 w-12 rounded-full bg-[#9caf88]/25">
                        <span
                          className="block h-full rounded-full bg-[#9caf88]"
                          style={{
                            width:
                              analysisQuery.data.risk_level ===
                              "CRITICAL"
                                ? "100%"
                                : analysisQuery.data.risk_level ===
                                    "HIGH"
                                  ? "80%"
                                  : analysisQuery.data.risk_level ===
                                      "MEDIUM"
                                    ? "55%"
                                    : "30%",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {analysisQuery.data.summary ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                    AI Summary
                  </p>

                  <p className="mt-3 max-w-5xl text-sm leading-7 text-white/72">
                    {analysisQuery.data.summary}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-white/45">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-[#9caf88]"
                  />

                  Analysis status:
                  <span className="font-semibold text-white/65">
                    {formatStatus(
                      analysisQuery.data.status,
                    )}
                  </span>
                </div>

                {currentVersion ? (
                  <div>
                    Analyzed version:
                    <span className="ml-1 font-semibold text-white/65">
                      v{currentVersion.version_number}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* Risk trend */}
        <section className="mt-5 overflow-hidden rounded-[24px] border border-[#dddcd3] bg-[#fffefa] shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
          <SectionHeading
            eyebrow="Risk Monitoring"
            title="Risk Trend"
            description="Track how the contract's risk profile changes across analyzed versions."
          />

          <div className="p-4 sm:p-5">
            {riskTrendQuery.isLoading ? (
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-[#687268]">
                  <LoaderCircle
                    size={18}
                    className="animate-spin text-[#718060]"
                  />

                  Loading risk trend...
                </div>
              </div>
            ) : riskTrendQuery.isError ? (
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="max-w-md text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0eee8]">
                    <ShieldAlert
                      size={18}
                      className="text-[#8a9189]"
                    />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#526047]">
                    Risk trend unavailable
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8a9189]">
                    Risk history could not be loaded for this
                    contract version.
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
            ) : riskTrendQuery.data ? (
              <RiskTrendCard
                trend={riskTrendQuery.data}
              />
            ) : (
              <div className="flex min-h-[180px] items-center justify-center text-center">
                <div>
                  <p className="text-sm font-semibold text-[#526047]">
                    No risk history yet
                  </p>

                  <p className="mt-1 text-xs text-[#8a9189]">
                    Run an analysis to start tracking risk
                    over time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Risk findings */}
        <section className="mt-5 overflow-hidden rounded-[24px] border border-[#dddcd3] bg-[#fffefa] shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
          <SectionHeading
            eyebrow="AI Risk Intelligence"
            title="Risk Findings"
            description="Review identified risks, supporting evidence, and recommendations from the latest analysis."
            action={
              analysisQuery.data ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#e8412c]/20 bg-[#e8412c]/5 px-2.5 py-1.5 text-[9px] font-bold text-[#c93625]">
                    {criticalCount} Critical
                  </span>

                  <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-[9px] font-bold text-orange-700">
                    {highCount} High
                  </span>

                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[9px] font-bold text-amber-700">
                    {mediumCount} Medium
                  </span>

                  <span className="rounded-full border border-[#c8d3be] bg-[#e5eadf] px-2.5 py-1.5 text-[9px] font-bold text-[#526047]">
                    {riskFindingsQuery.data?.total ??
                      analysisQuery.data.findings.length}{" "}
                    Total
                  </span>
                </div>
              ) : undefined
            }
          />

          {analysisQuery.data ? (
            <div className="border-b border-[#ebe9e1] px-5 py-4 sm:px-6">
              <div className="rounded-2xl border border-[#dddcd3] bg-[#f7f5ef] p-4">
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

                <div className="grid gap-3 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#8a9189]">
                      Severity
                    </span>

                    <select
                      value={findingSeverity}
                      onChange={(event) =>
                        handleSeverityChange(
                          event.target.value,
                        )
                      }
                      className="h-10 w-full rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3 text-xs text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/15"
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
                    <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#8a9189]">
                      Category
                    </span>

                    <select
                      value={findingCategory}
                      onChange={(event) =>
                        handleCategoryChange(
                          event.target.value,
                        )
                      }
                      className="h-10 w-full rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3 text-xs text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/15"
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
                    <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#8a9189]">
                      Status
                    </span>

                    <select
                      value={findingStatus}
                      onChange={(event) =>
                        handleFindingStatusChange(
                          event.target.value,
                        )
                      }
                      className="h-10 w-full rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3 text-xs text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/15"
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
            </div>
          ) : null}

          {analysisQuery.isLoading ||
          riskFindingsQuery.isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center">
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
              <div className="flex items-start gap-3 rounded-2xl border border-[#dddcd3] bg-[#f7f5ef] p-5">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-[#9aa198]"
                />

                <div>
                  <p className="text-sm font-semibold text-[#526047]">
                    No completed analysis available
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8a9189]">
                    Run AI analysis on this contract version
                    to generate risk findings.
                  </p>
                </div>
              </div>
            </div>
          ) : riskFindingsQuery.isError ? (
            <div className="p-6">
              <div className="rounded-2xl border border-[#e8412c]/20 bg-[#e8412c]/5 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 text-[#e8412c]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#c93625]">
                      Unable to load risk findings
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#687268]">
                      The findings service could not return
                      the requested results.
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
            <div className="flex min-h-[240px] items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c8d3be] bg-[#e5eadf]">
                  <CheckCircle2
                    size={19}
                    className="text-[#526047]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#243027]">
                  {hasFindingFilters
                    ? "No matching findings"
                    : "No risk findings"}
                </h3>

                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#8a9189]">
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
                  </span>{" "}
                  –{" "}
                  <span className="font-semibold text-[#526047]">
                    {Math.min(
                      riskFindingsQuery.data.page *
                        riskFindingsQuery.data.page_size,
                      riskFindingsQuery.data.total,
                    )}
                  </span>{" "}
                  of{" "}
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
                    {riskFindingsQuery.data.page}{" "}
                    of{" "}
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
                        (page) => page + 1,
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
          <section className="mt-5 overflow-hidden rounded-[24px] border border-[#dddcd3] bg-[#fffefa] shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
            <SectionHeading
              eyebrow="Contract Intelligence"
              title="Ask about this contract"
              description="Ask follow-up questions and explore the contract using grounded answers with source citations."
            />

            <div className="p-4 sm:p-5">
              <ContractQaPanel
                contractId={contract.id}
                versionId={currentVersion.id}
              />
            </div>
          </section>
        ) : null}

        {/* Version history */}
        <section className="mt-5 overflow-hidden rounded-[24px] border border-[#dddcd3] bg-[#fffefa] shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
          <SectionHeading
            eyebrow="Document Lifecycle"
            title="Version History"
            description="Track every uploaded version of this contract and its processing history."
            action={
              <span className="rounded-full bg-[#e5eadf] px-3 py-1.5 text-[10px] font-semibold text-[#526047]">
                {versions.length}{" "}
                {versions.length === 1
                  ? "version"
                  : "versions"}
              </span>
            }
          />

          {versionsQuery.isError ? (
            <div className="p-6">
              <div className="rounded-2xl border border-[#e8412c]/20 bg-[#e8412c]/5 p-4 text-xs text-[#c93625]">
                Unable to load version history.
              </div>
            </div>
          ) : versions.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dddcd3] bg-[#e5eadf]">
                  <FileText
                    size={19}
                    className="text-[#526047]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#243027]">
                  No document versions
                </h3>

                <p className="mt-1 text-xs text-[#8a9189]">
                  Upload a document to create the first
                  version.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/upload?contractId=${contract.id}`,
                    )
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#e8412c] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#d83a27]"
                >
                  <FilePlus2 size={14} />

                  Upload Version
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#ebe9e1]">
              {versions.map(
                (version, index) => {
                  const isCurrent =
                    index === 0;

                  return (
                    <div
                      key={version.id}
                      className={`relative px-5 py-5 transition sm:px-6 ${
                        isCurrent
                          ? "bg-[#e5eadf]/35"
                          : "hover:bg-[#f7f5ef]/60"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-[10px] font-bold ${
                            isCurrent
                              ? "border-[#9caf88] bg-[#e5eadf] text-[#526047]"
                              : "border-[#dddcd3] bg-[#f7f5ef] text-[#8a9189]"
                          }`}
                        >
                          v{version.version_number}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-[#243027]">
                                Version{" "}
                                {version.version_number}
                              </span>

                              {isCurrent ? (
                                <span className="rounded-full border border-[#9caf88] bg-[#e5eadf] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#526047]">
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

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#9aa198]">
                            <span>
                              Uploaded by{" "}
                              <span className="font-medium text-[#687268]">
                                {version.uploaded_by}
                              </span>
                            </span>

                            {isCurrent ? (
                              <span className="flex items-center gap-1.5 text-[#718060]">
                                <CheckCircle2 size={12} />

                                Active contract version
                              </span>
                            ) : null}
                          </div>
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