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
    <div className="relative min-h-full overflow-hidden bg-[#f7f5ef]">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[620px] rounded-full bg-[#9caf88]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#718060]">
                Contract Intelligence
              </div>

              <h1 className="lexmind-display mt-2 text-3xl font-medium tracking-[-0.025em] text-[#243027] sm:text-4xl">
                Contracts
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#687268]">
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
              className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-[#e8412c] px-5 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(232,65,44,0.16)] transition hover:bg-[#d83a27] hover:shadow-[0_12px_28px_rgba(232,65,44,0.2)]"
            >
              <FilePlus2 size={16} />

              Upload Contract
            </button>
          </div>
        </section>

        {/* Search + filters */}
        <section className="mb-6 rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-4 shadow-[0_14px_36px_rgba(36,48,39,0.045)] sm:p-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa198]"
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
                  className="h-11 w-full rounded-xl border border-[#dddcd3] bg-[#f7f5ef] pl-9 pr-3 text-xs text-[#243027] outline-none transition placeholder:text-[#9aa198] focus:border-[#9caf88] focus:bg-white focus:ring-2 focus:ring-[#9caf88]/15"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#243027] px-5 text-xs font-semibold text-white transition hover:bg-[#344238]"
              >
                <Search size={14} />

                Search
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#526047]">
              <Filter
                size={14}
              />

              Filters
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
                  Status
                </span>

                <select
                  value={status}
                  onChange={(event) =>
                    handleStatusChange(
                      event.target.value,
                    )
                  }
                  className="h-10 w-full rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-3 text-xs text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/15"
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
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
                  Contract Type
                </span>

                <select
                  value={contractType}
                  onChange={(event) =>
                    handleContractTypeChange(
                      event.target.value,
                    )
                  }
                  className="h-10 w-full rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-3 text-xs text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/15"
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
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8a9189]">
                  Risk Level
                </span>

                <select
                  value={riskLevel}
                  onChange={(event) =>
                    handleRiskLevelChange(
                      event.target.value,
                    )
                  }
                  className="h-10 w-full rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-3 text-xs text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-2 focus:ring-[#9caf88]/15"
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
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-3 text-xs font-semibold text-[#687268] transition hover:border-[#9caf88] hover:bg-[#e5eadf] hover:text-[#526047]"
                  >
                    <X size={14} />

                    Clear Filters
                  </button>
                ) : (
                  <div className="hidden h-10 w-full rounded-xl border border-transparent sm:block" />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Loading */}
        {contractsQuery.isLoading ? (
          <section className="rounded-2xl border border-[#dddcd3] bg-[#fffefa] shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-[#687268]">
                <LoaderCircle
                  size={18}
                  className="animate-spin text-[#718060]"
                />

                Loading contracts...
              </div>
            </div>
          </section>
        ) : contractsQuery.isError ? (
          /* Error */
          <section className="rounded-2xl border border-[#e8412c]/20 bg-[#fffefa] p-8 text-center shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8412c]/10">
              <ShieldAlert
                size={25}
                className="text-[#e8412c]"
              />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-[#c93625]">
              Unable to load contracts
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#687268]">
              {contractsQuery.error instanceof Error
                ? contractsQuery.error.message
                : "The contracts could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() =>
                contractsQuery.refetch()
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-2.5 text-xs font-semibold text-[#526047] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
            >
              <RefreshCw size={14} />

              Try Again
            </button>
          </section>
        ) : contracts.length === 0 ? (
          /* Empty */
          <section className="rounded-2xl border border-[#dddcd3] bg-[#fffefa] shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
            <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#dddcd3] bg-[#e5eadf]">
                  <FileText
                    size={20}
                    className="text-[#526047]"
                  />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-[#243027]">
                  {hasFilters
                    ? "No matching contracts"
                    : "No contracts yet"}
                </h2>

                <p className="mt-2 max-w-md text-xs leading-5 text-[#687268]">
                  {hasFilters
                    ? "No contracts match the current filters. Try changing or clearing your filters."
                    : "Create or upload a contract to start using the LexMind contract intelligence workspace."}
                </p>

                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-2.5 text-xs font-semibold text-[#526047] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
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
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#e8412c] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#d83a27]"
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
              <div className="text-xs text-[#8a9189]">
                Showing{" "}
                <span className="font-semibold text-[#526047]">
                  {Math.min(
                    (page - 1) *
                      pageSize +
                      1,
                    total,
                  )}
                </span>
                {" "}–{" "}
                <span className="font-semibold text-[#526047]">
                  {Math.min(
                    page * pageSize,
                    total,
                  )}
                </span>
                {" "}of{" "}
                <span className="font-semibold text-[#526047]">
                  {total}
                </span>{" "}
                contracts
              </div>

              {hasFilters ? (
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#718060]">
                  Filters applied
                </div>
              ) : null}
            </div>

            {/* Contract cards */}
            <section className="overflow-hidden rounded-2xl border border-[#dddcd3] bg-[#fffefa] shadow-[0_14px_36px_rgba(36,48,39,0.045)]">
              <div className="divide-y divide-[#ebe9e1]">
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
                      className="group block w-full text-left transition hover:bg-[#f7f5ef]/70 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[#9caf88]"
                    >
                      <div className="px-5 py-5 sm:px-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c8d3be] bg-[#e5eadf] text-[#526047] transition group-hover:bg-[#dce5d3]">
                              <FileText size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="truncate text-sm font-semibold text-[#243027] transition group-hover:text-[#526047]">
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

                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#8a9189]">
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
                              <div className="text-[9px] font-semibold uppercase tracking-wider text-[#9aa198]">
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
                                  <span className="text-xs text-[#9aa198]">
                                    Not analyzed
                                  </span>
                                )}

                                {contract.risk_score !==
                                null &&
                                contract.risk_score !==
                                  undefined ? (
                                  <span className="text-xs font-semibold text-[#243027]">
                                    {contract.risk_score}
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <div className="hidden h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[#9aa198] transition group-hover:border-[#dddcd3] group-hover:bg-[#f7f5ef] group-hover:text-[#526047] sm:flex">
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
                <div className="text-[11px] text-[#8a9189]">
                  Page{" "}
                  <span className="font-semibold text-[#526047]">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#526047]">
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
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3 text-[10px] font-semibold text-[#687268] transition hover:border-[#9caf88] hover:bg-[#e5eadf] hover:text-[#526047] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={13} />

                    Previous
                  </button>

                  <span className="rounded-xl bg-[#243027] px-3 py-1.5 text-[10px] font-semibold text-white">
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
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3 text-[10px] font-semibold text-[#687268] transition hover:border-[#9caf88] hover:bg-[#e5eadf] hover:text-[#526047] disabled:cursor-not-allowed disabled:opacity-30"
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