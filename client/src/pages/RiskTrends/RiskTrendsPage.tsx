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
    <div className="lexmind-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="lexmind-card relative overflow-hidden px-6 py-7 sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9CAF88]/10 blur-3xl" />

          <div className="pointer-events-none absolute bottom-0 right-0 h-px w-2/3 bg-gradient-to-l from-[#9CAF88]/40 to-transparent" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#9CAF88]/35 bg-[#E5EADF] text-[#5F6E52]">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#718060]">
                  Contract Risk Intelligence
                </span>
              </div>

              <h1 className="lexmind-display text-3xl font-medium tracking-tight text-[#243027] sm:text-4xl">
                Risk Trends
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687268]">
                Track how contractual risk changes across
                analyzed versions and identify whether the
                overall risk profile is improving or
                worsening.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-[#DDDCD3] bg-[#F7F5EF] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5EADF] text-[#5F6E52]">
                <BarChart3 className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#243027]">
                  Version Analysis
                </p>

                <p className="mt-0.5 text-[11px] text-[#8A9189]">
                  Compare risk over time
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scope */}
        <section className="lexmind-card p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F0EA] text-[#718060]">
              <FileText className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9189]">
                Analysis Scope
              </p>

              <h2 className="lexmind-display mt-1 text-xl font-medium text-[#243027]">
                Select Contract Version
              </h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Contract */}
            <div>
              <label
                htmlFor="risk-trends-contract"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A9189]"
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
                className="w-full rounded-xl border border-[#D8D8CF] bg-[#FFFEFA] px-4 py-3 text-sm text-[#243027] outline-none transition focus:border-[#9CAF88] focus:ring-2 focus:ring-[#9CAF88]/15"
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
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#8A9189]">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading contracts...
                </p>
              )}

              {contractsQuery.isError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#C93422]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Unable to load contracts.
                </p>
              )}
            </div>

            {/* Version */}
            <div>
              <label
                htmlFor="risk-trends-version"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A9189]"
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
                className="w-full rounded-xl border border-[#D8D8CF] bg-[#FFFEFA] px-4 py-3 text-sm text-[#243027] outline-none transition focus:border-[#9CAF88] focus:ring-2 focus:ring-[#9CAF88]/15 disabled:cursor-not-allowed disabled:bg-[#F1F0EA] disabled:opacity-60"
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
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#8A9189]">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading versions...
                  </p>
                )}

              {contractDetailQuery
                .versionsQuery.isError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#C93422]">
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
                  <p className="mt-2 text-xs text-[#92751E]">
                    No contract versions are available.
                  </p>
                )}
            </div>
          </div>

          {selectedContract &&
            selectedVersion && (
              <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-[#DDDCD3] bg-[#F7F5EF] px-4 py-3 text-xs text-[#687268]">
                <span>Contract:</span>

                <span className="font-semibold text-[#243027]">
                  {selectedContract.title}
                </span>

                <span className="text-[#B4B8B2]">
                  /
                </span>

                <span>Version:</span>

                <span className="font-semibold text-[#5F6E52]">
                  {selectedVersion.version_number}
                </span>
              </div>
            )}
        </section>

        {/* Empty state */}
        {!selectedVersionId && (
          <section className="lexmind-card border-dashed px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F0EA] text-[#8A9189]">
              <BarChart3 className="h-7 w-7" />
            </div>

            <h3 className="lexmind-display mt-5 text-xl font-medium text-[#243027]">
              Select a contract version
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A9189]">
              Choose a contract and version above to
              view its historical risk profile and
              version-to-version changes.
            </p>
          </section>
        )}

        {/* Loading */}
        {selectedVersionId &&
          trendQuery.isPending && (
            <section className="lexmind-card px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5EADF] text-[#718060]">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>

              <p className="mt-4 text-sm font-semibold text-[#687268]">
                Loading risk trend...
              </p>

              <p className="mt-1 text-xs text-[#8A9189]">
                Comparing analyzed contract versions.
              </p>
            </section>
          )}

        {/* Error */}
        {selectedVersionId &&
          trendQuery.isError && (
            <section className="rounded-[22px] border border-[#E8412C]/20 bg-[#E8412C]/5 px-6 py-12 text-center shadow-[0_14px_40px_rgba(36,48,39,0.04)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8412C]/10 text-[#C93422]">
                <AlertCircle className="h-6 w-6" />
              </div>

              <h3 className="lexmind-display mt-4 text-xl font-medium text-[#243027]">
                Unable to load risk trend
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#8A9189]">
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
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#243027] px-4 py-2.5 text-xs font-semibold text-[#F7F5EF] transition hover:bg-[#344239]"
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