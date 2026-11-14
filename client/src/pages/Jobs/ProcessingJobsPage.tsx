import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileClock,
  Filter,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  Timer,
  XCircle,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  useJobs,
} from "../../features/jobs/useJobs";

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortId(
  value: string,
): string {
  if (value.length <= 14) {
    return value;
  }

  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

function getStatusClasses(
  status: string,
): string {
  switch (status) {
    case "SUCCEEDED":
      return "border-[#9caf88]/45 bg-[#e5eadf] text-[#526347]";

    case "RUNNING":
      return "border-[#9caf88]/45 bg-[#f1f4ec] text-[#526347]";

    case "QUEUED":
      return "border-[#dddcd3] bg-[#f5f3ec] text-[#687268]";

    case "FAILED":
      return "border-[#e8412c]/30 bg-[#fff1ee] text-[#c93727]";

    case "CANCELLED":
      return "border-[#dddcd3] bg-[#f1f0eb] text-[#7a8279]";

    default:
      return "border-[#dddcd3] bg-[#f5f3ec] text-[#687268]";
  }
}

function getStatusIcon(
  status: string,
) {
  switch (status) {
    case "SUCCEEDED":
      return CheckCircle2;

    case "RUNNING":
      return LoaderCircle;

    case "QUEUED":
      return Clock3;

    case "FAILED":
      return XCircle;

    case "CANCELLED":
      return AlertCircle;

    default:
      return Timer;
  }
}

function getJobTypeDescription(
  jobType: string,
): string {
  switch (jobType) {
    case "TEXT_EXTRACTION":
      return "Extracting document text";

    case "CLAUSE_EXTRACTION":
      return "Extracting contract clauses";

    case "FULL_ANALYSIS":
      return "Complete contract analysis";

    case "REANALYSIS":
      return "Re-running contract analysis";

    default:
      return "Contract processing";
  }
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  danger = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Clock3;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border bg-[#fffefa] p-5 shadow-[0_14px_35px_rgba(36,48,39,0.045)] ${
        danger
          ? "border-[#e8412c]/30"
          : "border-[#dddcd3]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
            danger
              ? "text-[#e8412c]"
              : "text-[#7a8279]"
          }`}
        >
          {label}
        </p>

        <Icon
          className={`h-4 w-4 ${
            danger
              ? "text-[#e8412c]"
              : "text-[#718060]"
          }`}
        />
      </div>

      <p
        className={`mt-5 text-3xl font-semibold tracking-tight ${
          danger
            ? "text-[#c93727]"
            : "text-[#243027]"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-[#7a8279]">
        {description}
      </p>
    </div>
  );
}

function ProcessingJobsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [jobType, setJobType] = useState("");

  const pageSize = 20;

  const params = useMemo(
    () => ({
      page,
      page_size: pageSize,
      ...(status ? { status } : {}),
      ...(jobType ? { job_type: jobType } : {}),
    }),
    [page, status, jobType],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useJobs(params);

  const jobs = data?.items ?? [];
  const total = data?.total ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize),
  );

  const queuedCount = jobs.filter(
    (job) => job.status === "QUEUED",
  ).length;

  const runningCount = jobs.filter(
    (job) => job.status === "RUNNING",
  ).length;

  const succeededCount = jobs.filter(
    (job) => job.status === "SUCCEEDED",
  ).length;

  const failedCount = jobs.filter(
    (job) => job.status === "FAILED",
  ).length;

  const clearFilters = () => {
    setStatus("");
    setJobType("");
    setPage(1);
  };

  const handleStatusChange = (
    value: string,
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handleJobTypeChange = (
    value: string,
  ) => {
    setJobType(value);
    setPage(1);
  };

  return (
    <div className="lexmind-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* Header */}
        <section className="relative overflow-hidden rounded-[28px] border border-[#dddcd3] bg-[#fffefa] px-6 py-8 shadow-[0_18px_45px_rgba(36,48,39,0.06)] sm:px-9 sm:py-9">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-[#e5eadf]/60 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526347]">
                    <FileClock className="h-5 w-5" />
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                    Processing & Operations
                  </span>
                </div>

                <h1 className="lexmind-display mt-5 text-4xl leading-tight text-[#243027] sm:text-5xl">
                  Processing Jobs
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687268]">
                  Monitor document extraction, contract
                  analysis, and background processing
                  activity across your workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dddcd3] bg-[#fffefa] px-4 py-2.5 text-xs font-semibold text-[#526347] transition hover:border-[#9caf88]/60 hover:bg-[#f1f4ec] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    isFetching
                      ? "animate-spin"
                      : ""
                  }`}
                />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total Jobs"
            value={total}
            description="Workspace processing activity"
            icon={FileClock}
          />

          <StatCard
            label="Queued"
            value={queuedCount}
            description="Waiting for processing"
            icon={Clock3}
          />

          <StatCard
            label="Running"
            value={runningCount}
            description="Currently processing"
            icon={LoaderCircle}
          />

          <StatCard
            label="Succeeded"
            value={succeededCount}
            description="Completed successfully"
            icon={CheckCircle2}
          />

          <StatCard
            label="Failed"
            value={failedCount}
            description="Processing failures"
            icon={ShieldAlert}
            danger
          />
        </section>

        {/* Filters */}
        <section className="lexmind-card overflow-hidden">
          <div className="border-b border-[#ebe9e1] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#718060]" />

                  <h2 className="text-sm font-semibold text-[#243027]">
                    Job Filters
                  </h2>
                </div>

                <p className="mt-1.5 text-xs text-[#7a8279]">
                  Narrow processing activity by status or job type.
                </p>
              </div>

              {(status || jobType) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#718060] transition hover:text-[#243027]"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aa198]">
                Status
              </span>

              <select
                value={status}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#dddcd3] bg-[#f9f8f3] px-3.5 text-sm text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/20"
              >
                <option value="">
                  All statuses
                </option>
                <option value="QUEUED">
                  Queued
                </option>
                <option value="RUNNING">
                  Running
                </option>
                <option value="SUCCEEDED">
                  Succeeded
                </option>
                <option value="FAILED">
                  Failed
                </option>
                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aa198]">
                Job Type
              </span>

              <select
                value={jobType}
                onChange={(event) =>
                  handleJobTypeChange(
                    event.target.value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#dddcd3] bg-[#f9f8f3] px-3.5 text-sm text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/20"
              >
                <option value="">
                  All job types
                </option>
                <option value="TEXT_EXTRACTION">
                  Text Extraction
                </option>
                <option value="CLAUSE_EXTRACTION">
                  Clause Extraction
                </option>
                <option value="FULL_ANALYSIS">
                  Full Analysis
                </option>
                <option value="REANALYSIS">
                  Reanalysis
                </option>
              </select>
            </label>
          </div>
        </section>

        {/* Jobs table */}
        <section className="lexmind-card overflow-hidden">
          <div className="border-b border-[#ebe9e1] px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#718060]">
                  Activity
                </div>

                <h2 className="lexmind-display mt-1.5 text-2xl text-[#243027]">
                  Job Activity
                </h2>

                <p className="mt-1 text-xs text-[#7a8279]">
                  {total} total processing job
                  {total === 1 ? "" : "s"} found.
                </p>
              </div>

              {isFetching && !isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#7a8279]">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Updating
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <LoaderCircle className="h-6 w-6 animate-spin text-[#718060]" />

                <p className="text-xs text-[#7a8279]">
                  Loading processing jobs...
                </p>
              </div>
            </div>
          ) : isError ? (
            <div className="flex min-h-[280px] items-center justify-center px-6">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1ee] text-[#e8412c]">
                  <AlertCircle className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#243027]">
                  Unable to load processing jobs
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#7a8279]">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong while loading the processing queue."}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#243027] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#526347]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex min-h-[280px] items-center justify-center px-6">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#526347]">
                  <Search className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#243027]">
                  No processing jobs found
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#7a8279]">
                  There are no jobs matching the
                  selected filters.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr className="border-b border-[#ebe9e1] bg-[#faf9f4]">
                      <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9aa198]">
                        Job
                      </th>

                      <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9aa198]">
                        Type
                      </th>

                      <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9aa198]">
                        Status
                      </th>

                      <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9aa198]">
                        Attempts
                      </th>

                      <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9aa198]">
                        Created
                      </th>

                      <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9aa198]">
                        Completed
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.map((job) => {
                      const StatusIcon =
                        getStatusIcon(
                          job.status,
                        );

                      return (
                        <tr
                          key={job.id}
                          className="border-b border-[#f0eee7] last:border-b-0"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f2eb] text-[#526347]">
                                <FileClock className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="font-mono text-xs font-medium text-[#243027]">
                                  {formatShortId(
                                    job.id,
                                  )}
                                </p>

                                <p className="mt-1 font-mono text-[10px] text-[#9aa198]">
                                  Version{" "}
                                  {formatShortId(
                                    job.contract_version_id,
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-[#243027]">
                              {formatLabel(
                                job.job_type,
                              )}
                            </p>

                            <p className="mt-1 text-[11px] text-[#9aa198]">
                              {getJobTypeDescription(
                                job.job_type,
                              )}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <div
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${getStatusClasses(
                                job.status,
                              )}`}
                            >
                              <StatusIcon
                                className={`h-3.5 w-3.5 ${
                                  job.status ===
                                  "RUNNING"
                                    ? "animate-spin"
                                    : ""
                                }`}
                              />

                              <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">
                                {formatLabel(
                                  job.status,
                                )}
                              </span>
                            </div>

                            {job.error_message && (
                              <p className="mt-2 max-w-xs text-[11px] leading-4 text-[#c93727]">
                                {job.error_message}
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#243027]">
                                {job.attempt_count}
                              </span>

                              <span className="text-xs text-[#9aa198]">
                                / {job.max_attempts}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-xs text-[#687268]">
                              <Clock3 className="h-3.5 w-3.5 text-[#9aa198]" />
                              {formatDate(
                                job.created_at,
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-xs text-[#687268]">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#9aa198]" />
                              {formatDate(
                                job.completed_at,
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-4 border-t border-[#ebe9e1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-[#7a8279]">
                  Showing{" "}
                  <span className="font-semibold text-[#243027]">
                    {(page - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-[#243027]">
                    {Math.min(
                      page * pageSize,
                      total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#243027]">
                    {total}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((current) =>
                        Math.max(1, current - 1),
                      )
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dddcd3] bg-[#fffefa] px-3 text-xs font-semibold text-[#526347] transition hover:bg-[#f1f4ec] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </button>

                  <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#243027] px-3 text-xs font-semibold text-white">
                    {page}
                  </div>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((current) =>
                        Math.min(
                          totalPages,
                          current + 1,
                        ),
                      )
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dddcd3] bg-[#fffefa] px-3 text-xs font-semibold text-[#526347] transition hover:bg-[#f1f4ec] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProcessingJobsPage;