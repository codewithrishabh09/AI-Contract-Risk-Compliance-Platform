import {
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileClock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { useAuditLogs } from "../../features/audit/useAudit";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatResourceType(resourceType: string) {
  return resourceType
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatMetadata(
  metadata: Record<string, unknown> | null,
) {
  if (!metadata) {
    return "—";
  }

  const entries = Object.entries(metadata).filter(
    ([key]) => key !== "request_id",
  );

  if (entries.length === 0) {
    return "—";
  }

  return entries
    .map(([key, value]) => {
      const formattedKey = key
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

      return `${formattedKey}: ${String(value)}`;
    })
    .join(" • ");
}

export default function AuditPage() {
  const [action, setAction] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      action: action || undefined,
      resource_type: resourceType || undefined,
      date_from: dateFrom
        ? new Date(`${dateFrom}T00:00:00`).toISOString()
        : undefined,
      date_to: dateTo
        ? new Date(`${dateTo}T23:59:59`).toISOString()
        : undefined,
      page,
      page_size: 25,
    }),
    [
      action,
      resourceType,
      dateFrom,
      dateTo,
      page,
    ],
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuditLogs(filters);

  function handleFilterChange(
    setter: (value: string) => void,
    value: string,
  ) {
    setter(value);
    setPage(1);
  }

  function clearFilters() {
    setAction("");
    setResourceType("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  const hasFilters =
    Boolean(action) ||
    Boolean(resourceType) ||
    Boolean(dateFrom) ||
    Boolean(dateTo);

  return (
    <div className="lexmind-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[28px] border border-[#dddcd3] bg-[#fffefa] px-6 py-7 shadow-[0_18px_45px_rgba(36,48,39,0.06)] sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9caf88]/15 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526347]">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                  Governance & Security
                </span>
              </div>

              <h1 className="lexmind-display mt-5 text-4xl leading-tight text-[#243027] sm:text-5xl">
                Audit Workspace
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#687268] sm:text-base">
                Review organization activity, contract
                events, analysis actions, and
                security-related events from a centralized
                audit trail.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#9caf88]/40 bg-[#e5eadf] px-4 py-2 text-xs font-medium text-[#526347]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#718060] opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#718060]" />
              </span>

              Audit monitoring active
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="lexmind-card p-5">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                Total Events
              </span>

              <Activity className="h-4 w-4 text-[#718060]" />
            </div>

            <strong className="mt-5 block text-3xl font-semibold tracking-tight text-[#243027]">
              {data?.summary.total_events ?? 0}
            </strong>

            <span className="mt-2 block text-xs text-[#7a8279]">
              Organization activity
            </span>
          </div>

          <div className="lexmind-card p-5">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                Authentication
              </span>

              <ShieldCheck className="h-4 w-4 text-[#718060]" />
            </div>

            <strong className="mt-5 block text-3xl font-semibold tracking-tight text-[#243027]">
              {data?.summary.authentication_events ?? 0}
            </strong>

            <span className="mt-2 block text-xs text-[#7a8279]">
              Identity-related events
            </span>
          </div>

          <div className="lexmind-card p-5">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                Contract Events
              </span>

              <FileClock className="h-4 w-4 text-[#718060]" />
            </div>

            <strong className="mt-5 block text-3xl font-semibold tracking-tight text-[#243027]">
              {data?.summary.contract_events ?? 0}
            </strong>

            <span className="mt-2 block text-xs text-[#7a8279]">
              Contract lifecycle activity
            </span>
          </div>

          <div className="lexmind-card p-5">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                Analysis Events
              </span>

              <Clock3 className="h-4 w-4 text-[#718060]" />
            </div>

            <strong className="mt-5 block text-3xl font-semibold tracking-tight text-[#243027]">
              {data?.summary.analysis_events ?? 0}
            </strong>

            <span className="mt-2 block text-xs text-[#7a8279]">
              AI analysis activity
            </span>
          </div>

          <div className="rounded-[24px] border border-[#e8412c]/20 bg-[#fffaf8] p-5 shadow-[0_12px_35px_rgba(36,48,39,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c52f20]">
                Security Events
              </span>

              <AlertCircle className="h-4 w-4 text-[#e8412c]" />
            </div>

            <strong className="mt-5 block text-3xl font-semibold tracking-tight text-[#c52f20]">
              {data?.summary.security_events ?? 0}
            </strong>

            <span className="mt-2 block text-xs text-[#9a756f]">
              Security-sensitive activity
            </span>
          </div>
        </section>

        {/* Filters */}
        <section className="lexmind-card overflow-hidden">
          <div className="border-b border-[#ebe9e1] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                  Audit Controls
                </div>

                <h2 className="lexmind-display mt-2 text-2xl text-[#243027]">
                  Audit Filters
                </h2>

                <p className="mt-1 text-sm text-[#7a8279]">
                  Narrow the audit trail by action,
                  resource, or date range.
                </p>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex w-fit items-center rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-2.5 text-xs font-semibold text-[#526347] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                Action
              </span>

              <input
                type="text"
                value={action}
                onChange={(event) =>
                  handleFilterChange(
                    setAction,
                    event.target.value,
                  )
                }
                placeholder="e.g. ANALYSIS_REQUESTED"
                className="w-full rounded-2xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-3 text-sm text-[#243027] placeholder:text-[#9aa198] outline-none transition focus:border-[#9caf88] focus:bg-[#fffefa] focus:ring-4 focus:ring-[#9caf88]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                Resource Type
              </span>

              <input
                type="text"
                value={resourceType}
                onChange={(event) =>
                  handleFilterChange(
                    setResourceType,
                    event.target.value,
                  )
                }
                placeholder="e.g. PROCESSING_JOB"
                className="w-full rounded-2xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-3 text-sm text-[#243027] placeholder:text-[#9aa198] outline-none transition focus:border-[#9caf88] focus:bg-[#fffefa] focus:ring-4 focus:ring-[#9caf88]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                From
              </span>

              <input
                type="date"
                value={dateFrom}
                onChange={(event) =>
                  handleFilterChange(
                    setDateFrom,
                    event.target.value,
                  )
                }
                className="w-full rounded-2xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-3 text-sm text-[#243027] outline-none transition focus:border-[#9caf88] focus:bg-[#fffefa] focus:ring-4 focus:ring-[#9caf88]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8279]">
                To
              </span>

              <input
                type="date"
                value={dateTo}
                onChange={(event) =>
                  handleFilterChange(
                    setDateTo,
                    event.target.value,
                  )
                }
                className="w-full rounded-2xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-3 text-sm text-[#243027] outline-none transition focus:border-[#9caf88] focus:bg-[#fffefa] focus:ring-4 focus:ring-[#9caf88]/10"
              />
            </label>
          </div>
        </section>

        {/* Timeline */}
        <section className="lexmind-card overflow-hidden">
          <div className="border-b border-[#ebe9e1] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                  Activity Log
                </div>

                <h2 className="lexmind-display mt-2 text-2xl text-[#243027]">
                  Audit Timeline
                </h2>

                <p className="mt-1 text-sm text-[#7a8279]">
                  {data
                    ? `${data.total} event${
                        data.total === 1 ? "" : "s"
                      } found`
                    : "Organization activity"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isLoading}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-2.5 text-xs font-semibold text-[#526347] transition hover:border-[#9caf88] hover:bg-[#e5eadf] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />

                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#526347]">
                <RefreshCw className="h-5 w-5 animate-spin" />
              </div>

              <p className="mt-5 text-sm font-medium text-[#243027]">
                Loading audit events...
              </p>

              <p className="mt-1 text-xs text-[#7a8279]">
                Retrieving the latest organization activity.
              </p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#e8412c]">
                <AlertCircle className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-base font-semibold text-[#243027]">
                Unable to load audit events
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#7a8279]">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#243027] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#344238]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading &&
            !isError &&
            data &&
            data.items.length === 0 && (
              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#526347]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-[#243027]">
                  No audit events found
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#7a8279]">
                  There are no events matching the
                  current filters.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-2.5 text-xs font-semibold text-[#526347] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

          {/* Table */}
          {!isLoading &&
            !isError &&
            data &&
            data.items.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-[1200px] w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#dddcd3] bg-[#f4f3ed]">
                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                          Timestamp
                        </th>

                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                          Action
                        </th>

                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                          Resource
                        </th>

                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                          Description
                        </th>

                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                          IP Address
                        </th>

                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a8279]">
                          Metadata
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.items.map((event) => (
                        <tr
                          key={event.id}
                          className="border-b border-[#ebe9e1] last:border-b-0 transition hover:bg-[#faf9f4]"
                        >
                          <td className="px-5 py-5 align-top">
                            <div className="flex items-start gap-2">
                              <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9aa198]" />

                              <span className="whitespace-nowrap text-xs font-medium text-[#526347]">
                                {formatDate(
                                  event.created_at,
                                )}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <span className="inline-flex rounded-full border border-[#9caf88]/40 bg-[#e5eadf] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#526347]">
                              {formatAction(
                                event.action,
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <div className="space-y-1">
                              <strong className="block text-sm font-semibold text-[#243027]">
                                {formatResourceType(
                                  event.resource_type,
                                )}
                              </strong>

                              {event.resource_id && (
                                <span className="block font-mono text-[10px] text-[#9aa198]">
                                  {event.resource_id.slice(
                                    0,
                                    8,
                                  )}
                                  ...
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="max-w-[340px] px-5 py-5 align-top">
                            <span className="text-sm leading-6 text-[#687268]">
                              {event.description ?? "—"}
                            </span>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <span className="font-mono text-xs text-[#687268]">
                              {event.ip_address ?? "—"}
                            </span>
                          </td>

                          <td className="max-w-[360px] px-5 py-5 align-top">
                            <span className="text-xs leading-5 text-[#7a8279]">
                              {formatMetadata(
                                event.metadata_json,
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-4 border-t border-[#ebe9e1] bg-[#faf9f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <span className="text-xs font-medium text-[#7a8279]">
                    Page {data.page}
                    {data.total_pages > 0
                      ? ` of ${data.total_pages}`
                      : ""}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!data.has_previous}
                      onClick={() =>
                        setPage((current) =>
                          Math.max(
                            1,
                            current - 1,
                          ),
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3.5 py-2 text-xs font-semibold text-[#526347] transition hover:border-[#9caf88] hover:bg-[#e5eadf] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={!data.has_next}
                      onClick={() =>
                        setPage((current) =>
                          current + 1,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3.5 py-2 text-xs font-semibold text-[#526347] transition hover:border-[#9caf88] hover:bg-[#e5eadf] disabled:cursor-not-allowed disabled:opacity-40"
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