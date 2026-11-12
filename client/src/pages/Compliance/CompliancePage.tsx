import {
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

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
      return "compliance-severity-critical";

    case "HIGH":
      return "compliance-severity-high";

    case "MEDIUM":
      return "compliance-severity-medium";

    case "LOW":
      return "compliance-severity-low";

    default:
      return "compliance-severity-neutral";
  }
}

function getStatusClass(status: string) {
  switch (status.toUpperCase()) {
    case "OPEN":
      return "compliance-status-open";

    case "ACCEPTED":
      return "compliance-status-accepted";

    case "MITIGATED":
      return "compliance-status-mitigated";

    case "DISMISSED":
      return "compliance-status-dismissed";

    default:
      return "compliance-status-neutral";
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
      className={`compliance-overview-card ${
        danger ? "compliance-overview-card-danger" : ""
      }`}
    >
      <div className="compliance-card-label">
        {label}
      </div>

      <div className="compliance-card-value">
        {value}
      </div>

      <div className="compliance-card-description">
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
      className={`compliance-severity-badge ${getSeverityClass(
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
      className={`compliance-status-badge ${getStatusClass(
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
      <div className="compliance-empty-state">
        No compliance category data is available for this
        version.
      </div>
    );
  }

  return (
    <div className="compliance-table-container">
      <table className="compliance-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Total</th>
            <th>Critical</th>
            <th>High</th>
            <th>Medium</th>
            <th>Low</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.category}>
              <td>
                <span className="compliance-category-name">
                  {formatLabel(category.category)}
                </span>
              </td>

              <td>
                <span className="compliance-total-count">
                  {category.total}
                </span>
              </td>

              <td>
                <span className="compliance-count-critical">
                  {category.critical}
                </span>
              </td>

              <td>
                <span className="compliance-count-high">
                  {category.high}
                </span>
              </td>

              <td>
                <span className="compliance-count-medium">
                  {category.medium}
                </span>
              </td>

              <td>
                <span className="compliance-count-low">
                  {category.low}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      <div className="compliance-empty-state">
        No compliance findings were found for this version.
      </div>
    );
  }

  return (
    <div className="compliance-table-container">
      <table className="compliance-table compliance-findings-table">
        <thead>
          <tr>
            <th>Finding</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Recommendation</th>
          </tr>
        </thead>

        <tbody>
          {findings.map((finding) => (
            <tr key={finding.id}>
              <td>
                <div className="compliance-finding-title">
                  {finding.title}
                </div>

                <div className="compliance-finding-description">
                  {finding.description}
                </div>

                <div className="compliance-finding-category">
                  {formatLabel(finding.category)}
                </div>
              </td>

              <td>
                <SeverityBadge
                  severity={finding.severity}
                />
              </td>

              <td>
                <StatusBadge status={finding.status} />
              </td>

              <td>
                <div className="compliance-recommendation">
                  {finding.recommendation ||
                    "No recommendation provided."}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      <div className="compliance-page">
        <div className="compliance-state">
          Loading compliance workspace...
        </div>
      </div>
    );
  }

  if (contractsQuery.isError) {
    return (
      <div className="compliance-page">
        <div className="compliance-state compliance-state-error">
          Unable to load contracts. Please try again.
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="compliance-page">
        <div className="compliance-header">
          <div>
            <div className="compliance-eyebrow">
              COMPLIANCE
            </div>

            <h1>Compliance Workspace</h1>

            <p>
              Review contract compliance posture, risk
              categories, and outstanding findings.
            </p>
          </div>
        </div>

        <div className="compliance-state">
          No contracts are available for compliance review.
        </div>
      </div>
    );
  }

  return (
    <div className="compliance-page">
      <header className="compliance-header">
        <div className="compliance-header-content">
          <div className="compliance-eyebrow">
            COMPLIANCE
          </div>

          <h1>Compliance Workspace</h1>

          <p>
            Review contractual risk, compliance categories,
            and unresolved findings.
          </p>
        </div>

        <div className="compliance-selectors">
          <label className="compliance-selector">
            <span>Contract</span>

            <select
              value={effectiveContractId}
              onChange={handleContractChange}
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
          </label>

          <label className="compliance-selector">
            <span>Version</span>

            <select
              value={effectiveVersionId ?? ""}
              onChange={handleVersionChange}
              disabled={versionsQuery.isLoading}
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
          </label>
        </div>
      </header>

      {versionsQuery.isLoading && (
        <div className="compliance-state">
          Loading contract versions...
        </div>
      )}

      {!versionsQuery.isLoading &&
        versions.length === 0 && (
          <div className="compliance-state">
            No versions are available for this contract.
          </div>
        )}

      {complianceQuery.isLoading &&
        effectiveVersionId && (
          <div className="compliance-state">
            Loading compliance analysis...
          </div>
        )}

      {complianceQuery.isError && (
        <div className="compliance-state compliance-state-error">
          Unable to load compliance data for this contract
          version.
        </div>
      )}

      {compliance && (
        <>
          <section className="compliance-section">
            <div className="compliance-section-header">
              <div>
                <div className="compliance-section-eyebrow">
                  OVERVIEW
                </div>

                <h2>Compliance Overview</h2>
              </div>

              <div className="compliance-context">
                <strong>
                  {compliance.contract_title}
                </strong>

                <span>
                  {formatLabel(compliance.contract_type)}
                </span>
              </div>
            </div>

            <div className="compliance-overview-grid">
              <OverviewCard
                label="Compliance Score"
                value={formatScore(
                  compliance.overall_risk_score,
                )}
                description="Overall contract risk score"
              />

              <div className="compliance-overview-card">
                <div className="compliance-card-label">
                  Overall Status
                </div>

                <div className="compliance-status-value">
                  <span
                    className={`compliance-severity-badge ${getSeverityClass(
                      compliance.risk_level,
                    )}`}
                  >
                    {compliance.risk_level ||
                      "UNASSESSED"}
                  </span>
                </div>

                <div className="compliance-card-description">
                  Analysis:{" "}
                  {formatLabel(
                    compliance.analysis_status,
                  )}
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

          <section className="compliance-section">
            <div className="compliance-section-header">
              <div>
                <div className="compliance-section-eyebrow">
                  RISK DISTRIBUTION
                </div>

                <h2>Compliance Categories</h2>
              </div>

              <span className="compliance-section-meta">
                {compliance.total_findings} total findings
              </span>
            </div>

            <CategoryTable
              categories={compliance.categories}
            />
          </section>

          <section className="compliance-section">
            <div className="compliance-section-header">
              <div>
                <div className="compliance-section-eyebrow">
                  REVIEW QUEUE
                </div>

                <h2>Compliance Findings</h2>
              </div>

              <span className="compliance-section-meta">
                {findings.length} findings loaded
              </span>
            </div>

            {findingsQuery.isLoading ? (
              <div className="compliance-state">
                Loading findings...
              </div>
            ) : findingsQuery.isError ? (
              <div className="compliance-state compliance-state-error">
                Unable to load compliance findings.
              </div>
            ) : (
              <FindingsTable findings={findings} />
            )}
          </section>
        </>
      )}
    </div>
  );
}