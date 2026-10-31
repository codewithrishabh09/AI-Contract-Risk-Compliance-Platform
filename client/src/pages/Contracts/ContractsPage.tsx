import {
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  FileText,
  Filter,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useContracts,
} from "../../features/contracts/useContracts";

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
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

    case "ANALYZED":
      return "border-indigo-500/20 bg-indigo-500/10 text-indigo-300";

    case "UNDER_REVIEW":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";

    case "PROCESSING":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";

    case "REJECTED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";

    case "ARCHIVED":
      return "border-slate-500/20 bg-slate-500/10 text-slate-400";

    case "UPLOADED":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";

    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-400";
  }
}

function getRiskClasses(
  riskLevel: string | null,
) {
  switch (riskLevel) {
    case "CRITICAL":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";

    case "HIGH":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";

    case "MEDIUM":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";

    case "LOW":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-500";
  }
}

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

function ContractsPage() {
  const navigate = useNavigate();

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    contractType,
    setContractType,
  ] = useState("");

  const [
    riskLevel,
    setRiskLevel,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const pageSize = 10;

  const contractsQuery =
    useContracts({
      page,
      page_size: pageSize,
      search: search || undefined,
      status: status || undefined,
      contract_type:
        contractType || undefined,
      risk_level:
        riskLevel || undefined,
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contracts =
    contractsQuery.data?.items ?? [];

  const total =
    contractsQuery.data?.total ?? 0;

  const totalPages =
    contractsQuery.data?.total_pages ??
    0;

  const hasFilters =
    Boolean(search) ||
    Boolean(status) ||
    Boolean(contractType) ||
    Boolean(riskLevel);

  const contractTypeOptions =
    useMemo(() => {
      const values = contracts
        .map(
          (contract) =>
            contract.contract_type,
        )
        .filter(Boolean);

      return [
        ...new Set(values),
      ].sort();
    }, [contracts]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setContractType("");
    setRiskLevel("");
    setPage(1);
  };

  const handleSearch = () => {
    setSearch(
      searchInput.trim(),
    );
    setPage(1);
  };

  const handleStatusChange = (
    value: string,
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handleContractTypeChange = (
    value: string,
  ) => {
    setContractType(value);
    setPage(1);
  };

  const handleRiskLevelChange = (
    value: string,
  ) => {
    setRiskLevel(value);
    setPage(1);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleOpenContract = (
    contractId: string,
  ) => {
    navigate(
      `/contracts/${encodeURIComponent(contractId)}`,
    );
  };

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[620px] rounded-full bg-indigo-600/[0.05] blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-400">
                Contract Intelligence
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Contracts
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage contracts, versions,
                risk analysis, and compliance
                intelligence from one workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/upload")
              }
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 text-xs font-semibold text-indigo-300 transition hover:border-indigo-400/50 hover:bg-indigo-500/15 hover:text-indigo-200"
            >
              <FilePlus2 size={16} />

              Upload Contract
            </button>
          </div>
        </section>

        {/* Search + filters */}
        <section className="mb-5 rounded-xl border border-[#173052] bg-[#071426]/80 p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(
                      event.target.value,
                    )
                  }
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  placeholder="Search contracts..."
                  className="h-10 w-full rounded-lg border border-[#173052] bg-[#0B1930] pl-9 pr-3 text-xs text-slate-300 outline-none transition placeholder:text-slate-700 focus:border-indigo-500/50"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/15"
              >
                <Search size={14} />

                Search
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Filter
                size={14}
                className="text-indigo-400"
              />

              Filters
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Status
                </span>

                <select
                  value={status}
                  onChange={(event) =>
                    handleStatusChange(
                      event.target.value,
                    )
                  }
                  className="h-10 w-full rounded-lg border border-[#173052] bg-[#0B1930] px-3 text-xs text-slate-300 outline-none transition focus:border-indigo-500/50"
                >
                  <option value="">
                    All statuses
                  </option>

                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="UPLOADED">
                    Uploaded
                  </option>

                  <option value="PROCESSING">
                    Processing
                  </option>

                  <option value="ANALYZED">
                    Analyzed
                  </option>

                  <option value="UNDER_REVIEW">
                    Under Review
                  </option>

                  <option value="APPROVED">
                    Approved
                  </option>

                  <option value="REJECTED">
                    Rejected
                  </option>

                  <option value="ARCHIVED">
                    Archived
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Contract Type
                </span>

                <select
                  value={contractType}
                  onChange={(event) =>
                    handleContractTypeChange(
                      event.target.value,
                    )
                  }
                  className="h-10 w-full rounded-lg border border-[#173052] bg-[#0B1930] px-3 text-xs text-slate-300 outline-none transition focus:border-indigo-500/50"
                >
                  <option value="">
                    All contract types
                  </option>

                  {contractTypeOptions.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {formatContractType(
                          type,
                        )}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Risk Level
                </span>

                <select
                  value={riskLevel}
                  onChange={(event) =>
                    handleRiskLevelChange(
                      event.target.value,
                    )
                  }
                  className="h-10 w-full rounded-lg border border-[#173052] bg-[#0B1930] px-3 text-xs text-slate-300 outline-none transition focus:border-indigo-500/50"
                >
                  <option value="">
                    All risk levels
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

              <div className="flex items-end">
                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#173052] bg-[#0B1930] px-3 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
                  >
                    <X size={14} />

                    Clear Filters
                  </button>
                ) : (
                  <div className="hidden h-10 w-full rounded-lg border border-transparent sm:block" />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Loading */}
        {contractsQuery.isLoading ? (
          <section className="rounded-xl border border-[#173052] bg-[#071426]/80">
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <LoaderCircle
                  size={18}
                  className="animate-spin text-indigo-400"
                />

                Loading contracts...
              </div>
            </div>
          </section>
        ) : contractsQuery.isError ? (
          /* Error */
          <section className="rounded-xl border border-rose-500/20 bg-[#071426]/80 p-8 text-center">
            <ShieldAlert
              size={28}
              className="mx-auto text-rose-400"
            />

            <h2 className="mt-4 text-sm font-semibold text-rose-300">
              Unable to load contracts
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-600">
              {contractsQuery.error instanceof Error
                ? contractsQuery.error.message
                : "The contracts could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() =>
                contractsQuery.refetch()
              }
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#173052] bg-[#0B1930] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
            >
              <RefreshCw size={14} />

              Try Again
            </button>
          </section>
        ) : contracts.length === 0 ? (
          /* Empty */
          <section className="rounded-xl border border-[#173052] bg-[#071426]/80">
            <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#173052] bg-[#0B1930]">
                  <FileText
                    size={20}
                    className="text-slate-600"
                  />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-slate-300">
                  {hasFilters
                    ? "No matching contracts"
                    : "No contracts yet"}
                </h2>

                <p className="mt-2 max-w-md text-xs leading-5 text-slate-600">
                  {hasFilters
                    ? "No contracts match the current filters. Try changing or clearing your filters."
                    : "Create or upload a contract to start using the LexMind contract intelligence workspace."}
                </p>

                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#173052] bg-[#0B1930] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
                  >
                    <X size={14} />

                    Clear Filters
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/upload")
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/15"
                  >
                    <FilePlus2 size={14} />

                    Upload Contract
                  </button>
                )}
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Results header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs text-slate-600">
                Showing{" "}
                <span className="font-medium text-slate-400">
                  {Math.min(
                    (page - 1) *
                      pageSize +
                      1,
                    total,
                  )}
                </span>
                {" "}–{" "}
                <span className="font-medium text-slate-400">
                  {Math.min(
                    page * pageSize,
                    total,
                  )}
                </span>
                {" "}of{" "}
                <span className="font-medium text-slate-400">
                  {total}
                </span>{" "}
                contracts
              </div>

              {hasFilters ? (
                <div className="text-[10px] font-medium uppercase tracking-wider text-indigo-400">
                  Filters applied
                </div>
              ) : null}
            </div>

            {/* Contract cards */}
            <section className="overflow-hidden rounded-xl border border-[#173052] bg-[#071426]/80">
              <div className="divide-y divide-[#102744]">
                {contracts.map(
                  (contract) => (
                    <button
                      key={contract.id}
                      type="button"
                      onClick={() =>
                        handleOpenContract(
                          contract.id,
                        )
                      }
                      className="group block w-full text-left transition hover:bg-white/[0.015] focus:outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-500/40"
                    >
                      <div className="px-5 py-5 sm:px-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition group-hover:border-indigo-400/30 group-hover:bg-indigo-500/15">
                              <FileText size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="truncate text-sm font-semibold text-slate-200 transition group-hover:text-white">
                                  {contract.title}
                                </h2>

                                <span
                                  className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${getStatusClasses(
                                    contract.status,
                                  )}`}
                                >
                                  {formatStatus(
                                    contract.status,
                                  )}
                                </span>
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-600">
                                <span>
                                  {formatContractType(
                                    contract.contract_type,
                                  )}
                                </span>

                                <span>
                                  Created{" "}
                                  {formatDate(
                                    contract.created_at,
                                  )}
                                </span>

                                <span className="hidden md:inline">
                                  Updated{" "}
                                  {formatDate(
                                    contract.updated_at,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <div className="text-right">
                              <div className="text-[9px] font-medium uppercase tracking-wider text-slate-700">
                                Risk
                              </div>

                              <div className="mt-1 flex items-center justify-end gap-2">
                                {contract.risk_level ? (
                                  <span
                                    className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${getRiskClasses(
                                      contract.risk_level,
                                    )}`}
                                  >
                                    {contract.risk_level}
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-700">
                                    Not analyzed
                                  </span>
                                )}

                                {contract.risk_score !==
                                null &&
                                contract.risk_score !==
                                  undefined ? (
                                  <span className="text-xs font-semibold text-slate-300">
                                    {contract.risk_score}
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <div className="hidden h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-700 transition group-hover:border-[#173052] group-hover:bg-[#0B1930] group-hover:text-indigo-300 sm:flex">
                              <ChevronRight
                                size={16}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </section>

            {/* Pagination */}
            {totalPages > 1 ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[11px] text-slate-600">
                  Page{" "}
                  <span className="font-medium text-slate-400">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-400">
                    {totalPages}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage(
                        (currentPage) =>
                          Math.max(
                            currentPage - 1,
                            1,
                          ),
                      )
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#173052] bg-[#0B1930] px-3 text-[10px] font-semibold text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={13} />

                    Previous
                  </button>

                  <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-semibold text-indigo-300">
                    {page}
                  </span>

                  <button
                    type="button"
                    disabled={
                      page >= totalPages
                    }
                    onClick={() =>
                      setPage(
                        (currentPage) =>
                          Math.min(
                            currentPage + 1,
                            totalPages,
                          ),
                      )
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#173052] bg-[#0B1930] px-3 text-[10px] font-semibold text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next

                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default ContractsPage;