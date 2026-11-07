import { useMemo, useState } from "react";

import { useContracts } from "../../features/contracts/useContracts";
import { useContractDetail } from "../../features/contracts/useContractDetail";
import { useContractCompliance } from "../../features/contracts/useContractCompliance";

function formatCategory(category: string) {
  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getHealthLabel(
  riskLevel: string | null,
  analysisStatus: string | null,
) {
  if (!analysisStatus) {
    return {
      label: "Not Analyzed",
      description: "Run an analysis to evaluate compliance health.",
    };
  }

  if (analysisStatus !== "COMPLETED") {
    return {
      label: "Analysis Pending",
      description: "Compliance health is not available yet.",
    };
  }

  switch (riskLevel) {
    case "CRITICAL":
      return {
        label: "At Risk",
        description: "Critical compliance issues require immediate attention.",
      };

    case "HIGH":
      return {
        label: "Needs Review",
        description: "High-risk findings require legal or compliance review.",
      };

    case "MEDIUM":
      return {
        label: "Needs Review",
        description: "Some compliance issues should be reviewed.",
      };

    case "LOW":
      return {
        label: "Healthy",
        description: "No major risk indicators were detected.",
      };

    default:
      return {
        label: "Review Required",
        description: "Review the available findings.",
      };
  }
}

export default function CompliancePage() {
  const [selectedContractId, setSelectedContractId] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState("");

  const contractsQuery = useContracts({
    page: 1,
    page_size: 100,
  });

  const { contractQuery } = useContractDetail(selectedContractId);

  const complianceQuery = useContractCompliance(
    selectedContractId,
    selectedVersionId || null,
  );

  const contracts = contractsQuery.data?.items ?? [];

  const contractDetail = contractQuery.data;

  const versions = useMemo(
    () => contractDetail?.versions ?? [],
    [contractDetail],
  );

  const selectedVersion = useMemo(
    () =>
      versions.find(
        (version) => version.id === selectedVersionId,
      ) ?? null,
    [versions, selectedVersionId],
  );

  const dashboard = complianceQuery.data;

  const health = getHealthLabel(
    dashboard?.risk_level ?? null,
    dashboard?.analysis_status ?? null,
  );

  const handleContractChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const contractId = event.target.value;

    setSelectedContractId(contractId);
    setSelectedVersionId("");
  };

  const handleVersionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedVersionId(event.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Compliance
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-white">
          Compliance Workspace
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Review contract compliance health, risk indicators, and
          finding distribution across the selected contract version.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="compliance-contract"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Contract
            </label>

            <select
              id="compliance-contract"
              value={selectedContractId}
              onChange={handleContractChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-slate-500"
            >
              <option value="">
                Select a contract
              </option>

              {contracts.map((contract) => (
                <option
                  key={contract.id}
                  value={contract.id}
                >
                  {contract.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="compliance-version"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Version
            </label>

            <select
              id="compliance-version"
              value={selectedVersionId}
              onChange={handleVersionChange}
              disabled={
                !selectedContractId ||
                contractQuery.isLoading
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                Select a version
              </option>

              {versions.map((version) => (
                <option
                  key={version.id}
                  value={version.id}
                >
                  Version {version.version_number}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {contractsQuery.isLoading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-8 text-sm text-slate-400">
          Loading contracts...
        </div>
      )}

      {contractsQuery.isError && (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-300">
          Unable to load contracts.
        </div>
      )}

      {selectedContractId &&
        contractQuery.isError && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-300">
            Unable to load contract versions.
          </div>
        )}

      {selectedVersionId &&
        complianceQuery.isLoading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-8 text-sm text-slate-400">
            Loading compliance data...
          </div>
        )}

      {selectedVersionId &&
        complianceQuery.isError && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-300">
            Unable to load compliance data for this contract
            version.
          </div>
        )}

      {selectedVersionId && dashboard && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-500">
                Compliance Health
              </p>

              <p className="mt-3 text-2xl font-semibold text-white">
                {health.label}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {health.description}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-500">
                Overall Risk Score
              </p>

              <p className="mt-3 text-3xl font-semibold text-white">
                {dashboard.overall_risk_score ?? "—"}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Risk level:{" "}
                {dashboard.risk_level ?? "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-500">
                Open Findings
              </p>

              <p className="mt-3 text-3xl font-semibold text-white">
                {dashboard.open_findings}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Total findings: {dashboard.total_findings}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-500">
                High / Critical
              </p>

              <p className="mt-3 text-3xl font-semibold text-white">
                {dashboard.high_risk_findings +
                  dashboard.critical_findings}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Requires closer review
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
                  Assessment
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  {dashboard.contract_title}
                </h2>
              </div>

              <div className="text-sm text-slate-500">
                {selectedVersion
                  ? `Version ${selectedVersion.version_number}`
                  : "Selected version"}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-500">
                  Contract Type
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {dashboard.contract_type}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-500">
                  Contract Status
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {dashboard.contract_status}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-500">
                  Analysis Status
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {dashboard.analysis_status ?? "Not analyzed"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-500">
                  Critical Findings
                </p>
                <p className="mt-2 text-sm font-medium text-red-400">
                  {dashboard.critical_findings}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
                Risk Distribution
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Compliance Categories
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Finding distribution across the analyzed contract.
              </p>
            </div>

            {dashboard.categories.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
                No compliance findings are available for this
                version.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3">
                        Category
                      </th>

                      <th className="px-4 py-3">
                        Total
                      </th>

                      <th className="px-4 py-3 text-emerald-400">
                        Low
                      </th>

                      <th className="px-4 py-3 text-yellow-400">
                        Medium
                      </th>

                      <th className="px-4 py-3 text-orange-400">
                        High
                      </th>

                      <th className="px-4 py-3 text-red-400">
                        Critical
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {dashboard.categories.map(
                      (category) => (
                        <tr
                          key={category.category}
                          className="border-b border-slate-900 last:border-0"
                        >
                          <td className="px-4 py-4 font-medium text-white">
                            {formatCategory(
                              category.category,
                            )}
                          </td>

                          <td className="px-4 py-4 text-slate-300">
                            {category.total}
                          </td>

                          <td className="px-4 py-4 text-emerald-400">
                            {category.low}
                          </td>

                          <td className="px-4 py-4 text-yellow-400">
                            {category.medium}
                          </td>

                          <td className="px-4 py-4 text-orange-400">
                            {category.high}
                          </td>

                          <td className="px-4 py-4 text-red-400">
                            {category.critical}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
                Findings
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Compliance Findings
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Detailed finding information is available in the
                Risk Findings workspace.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-500">
                  Total
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {dashboard.total_findings}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-500">
                  Open
                </p>

                <p className="mt-2 text-2xl font-semibold text-yellow-400">
                  {dashboard.open_findings}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-500">
                  Critical
                </p>

                <p className="mt-2 text-2xl font-semibold text-red-400">
                  {dashboard.critical_findings}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedContractId && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-12 text-center">
          <p className="text-lg font-medium text-slate-300">
            Select a contract to begin
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Choose a contract and version to review its compliance
            health and risk distribution.
          </p>
        </div>
      )}
    </div>
  );
}