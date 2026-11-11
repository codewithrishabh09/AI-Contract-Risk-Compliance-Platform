import { useMemo, useState } from "react";

import { useAuditLogs } from "../../features/audit/useAudit";

import "./AuditPage.css";


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
    <div className="audit-page">
      <section className="audit-header">
        <div>
          <span className="audit-eyebrow">
            GOVERNANCE & SECURITY
          </span>

          <h1>Audit Workspace</h1>

          <p>
            Review organization activity, contract events,
            analysis actions, and security-related events
            from a centralized audit trail.
          </p>
        </div>

        <div className="audit-header-status">
          <span className="audit-status-dot" />
          Audit monitoring active
        </div>
      </section>


      <section className="audit-summary-grid">
        <div className="audit-summary-card">
          <span className="audit-summary-label">
            Total Events
          </span>

          <strong>
            {data?.summary.total_events ?? 0}
          </strong>

          <span className="audit-summary-description">
            Organization activity
          </span>
        </div>


        <div className="audit-summary-card">
          <span className="audit-summary-label">
            Authentication
          </span>

          <strong>
            {data?.summary.authentication_events ?? 0}
          </strong>

          <span className="audit-summary-description">
            Identity-related events
          </span>
        </div>


        <div className="audit-summary-card">
          <span className="audit-summary-label">
            Contract Events
          </span>

          <strong>
            {data?.summary.contract_events ?? 0}
          </strong>

          <span className="audit-summary-description">
            Contract lifecycle activity
          </span>
        </div>


        <div className="audit-summary-card">
          <span className="audit-summary-label">
            Analysis Events
          </span>

          <strong>
            {data?.summary.analysis_events ?? 0}
          </strong>

          <span className="audit-summary-description">
            AI analysis activity
          </span>
        </div>


        <div className="audit-summary-card audit-security-card">
          <span className="audit-summary-label">
            Security Events
          </span>

          <strong>
            {data?.summary.security_events ?? 0}
          </strong>

          <span className="audit-summary-description">
            Security-sensitive activity
          </span>
        </div>
      </section>


      <section className="audit-panel">
        <div className="audit-panel-header">
          <div>
            <h2>Audit Filters</h2>

            <p>
              Narrow the audit trail by action, resource,
              or date range.
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              className="audit-clear-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>


        <div className="audit-filter-grid">
          <label className="audit-field">
            <span>Action</span>

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
            />
          </label>


          <label className="audit-field">
            <span>Resource Type</span>

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
            />
          </label>


          <label className="audit-field">
            <span>From</span>

            <input
              type="date"
              value={dateFrom}
              onChange={(event) =>
                handleFilterChange(
                  setDateFrom,
                  event.target.value,
                )
              }
            />
          </label>


          <label className="audit-field">
            <span>To</span>

            <input
              type="date"
              value={dateTo}
              onChange={(event) =>
                handleFilterChange(
                  setDateTo,
                  event.target.value,
                )
              }
            />
          </label>
        </div>
      </section>


      <section className="audit-panel">
        <div className="audit-panel-header">
          <div>
            <h2>Audit Timeline</h2>

            <p>
              {data
                ? `${data.total} event${data.total === 1 ? "" : "s"} found`
                : "Organization activity"}
            </p>
          </div>

          <button
            type="button"
            className="audit-refresh-button"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>


        {isLoading && (
          <div className="audit-state">
            <div className="audit-spinner" />
            <span>Loading audit events...</span>
          </div>
        )}


        {isError && (
          <div className="audit-state audit-error-state">
            <strong>
              Unable to load audit events.
            </strong>

            <span>
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred."}
            </span>

            <button
              type="button"
              onClick={() => refetch()}
            >
              Try again
            </button>
          </div>
        )}


        {!isLoading &&
          !isError &&
          data &&
          data.items.length === 0 && (
            <div className="audit-empty-state">
              <div className="audit-empty-icon">
                ✓
              </div>

              <h3>No audit events found</h3>

              <p>
                There are no events matching the current
                filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}


        {!isLoading &&
          !isError &&
          data &&
          data.items.length > 0 && (
            <>
              <div className="audit-table-wrapper">
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>Description</th>
                      <th>IP Address</th>
                      <th>Metadata</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.items.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <span className="audit-timestamp">
                            {formatDate(event.created_at)}
                          </span>
                        </td>

                        <td>
                          <span className="audit-action">
                            {formatAction(event.action)}
                          </span>
                        </td>

                        <td>
                          <div className="audit-resource">
                            <strong>
                              {formatResourceType(
                                event.resource_type,
                              )}
                            </strong>

                            {event.resource_id && (
                              <span>
                                {event.resource_id.slice(0, 8)}
                                ...
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="audit-description">
                            {event.description ?? "—"}
                          </span>
                        </td>

                        <td>
                          <span className="audit-ip">
                            {event.ip_address ?? "—"}
                          </span>
                        </td>

                        <td>
                          <span className="audit-metadata">
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


              <div className="audit-pagination">
                <span>
                  Page {data.page}
                  {data.total_pages > 0
                    ? ` of ${data.total_pages}`
                    : ""}
                </span>

                <div className="audit-pagination-actions">
                  <button
                    type="button"
                    disabled={!data.has_previous}
                    onClick={() =>
                      setPage((current) =>
                        Math.max(1, current - 1),
                      )
                    }
                  >
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
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
      </section>
    </div>
  );
}