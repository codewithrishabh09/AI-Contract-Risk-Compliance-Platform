import { useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useContracts } from "../../features/contracts/useContracts";
import { useContractDetail } from "../../features/contracts/useContractDetail";
import { useContractRiskTrend } from "../../features/contracts/useContractAnalysis";

import RiskTrendCard from "../../components/contracts/RiskTrendCard";

import type {
  Contract,
  ContractVersion,
} from "../../types/contracts";

export default function RiskTrendsPage() {
  const [selectedContractId, setSelectedContractId] =
    useState("");

  const [selectedVersionId, setSelectedVersionId] =
    useState("");

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

  const trendQuery = useContractRiskTrend(
    selectedContractId,
    selectedVersionId || null,
  );

  const handleContractChange = (
    contractId: string,
  ) => {
    setSelectedContractId(contractId);
    setSelectedVersionId("");
  };

  const handleVersionChange = (
    versionId: string,
  ) => {
    setSelectedVersionId(versionId);
  };

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                  Contract Risk Intelligence
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Risk Trends
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Track how contractual risk changes across
                analyzed versions and identify whether the
                overall risk profile is improving or
                worsening.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
              <BarChart3 className="h-5 w-5 text-indigo-400" />

              <div>
                <p className="text-xs font-semibold text-slate-300">
                  Version Analysis
                </p>

                <p className="text-[11px] text-slate-500">
                  Compare risk over time
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scope */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl shadow-black/10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400">
              <FileText className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Analysis Scope
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Select Contract Version
              </h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Contract */}
            <div>
              <label
                htmlFor="risk-trends-contract"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Contract
              </label>

              <select
                id="risk-trends-contract"
                value={selectedContractId}
                onChange={(event) =>
                  handleContractChange(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
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
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
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
                htmlFor="risk-trends-version"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Contract Version
              </label>

              <select
                id="risk-trends-version"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
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
                    No contract versions are available.
                  </p>
                )}
            </div>
          </div>

          {selectedContract &&
            selectedVersion && (
              <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-500">
                <span>
                  Contract:
                </span>

                <span className="font-medium text-slate-300">
                  {selectedContract.title}
                </span>

                <span className="text-slate-700">
                  /
                </span>

                <span>
                  Version:
                </span>

                <span className="font-medium text-indigo-300">
                  {selectedVersion.version_number}
                </span>
              </div>
            )}
        </section>

        {/* Empty state */}
        {!selectedVersionId && (
          <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 px-6 py-16 text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-slate-700" />

            <h3 className="mt-4 text-base font-semibold text-slate-300">
              Select a contract version
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Choose a contract and version above to
              view its historical risk profile and
              version-to-version changes.
            </p>
          </section>
        )}

        {/* Loading */}
        {selectedVersionId &&
          trendQuery.isPending && (
            <section className="rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-16 text-center">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-indigo-400" />

              <p className="mt-4 text-sm font-medium text-slate-400">
                Loading risk trend...
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Comparing analyzed contract versions.
              </p>
            </section>
          )}

        {/* Error */}
        {selectedVersionId &&
          trendQuery.isError && (
            <section className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-400" />

              <h3 className="mt-4 text-base font-semibold text-red-300">
                Unable to load risk trend
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-400/70">
                The risk trend could not be loaded for
                this contract version. Make sure the
                selected version has been processed by
                the analysis pipeline.
              </p>

              <button
                type="button"
                onClick={() =>
                  trendQuery.refetch()
                }
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </section>
          )}

        {/* Trend */}
        {selectedVersionId &&
          trendQuery.data &&
          !trendQuery.isPending && (
            <RiskTrendCard
              trend={trendQuery.data}
            />
          )}
      </div>
    </div>
  );
}