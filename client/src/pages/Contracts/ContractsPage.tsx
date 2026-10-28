import {
  FilePlus2,
  FileText,
  LoaderCircle,
  Search,
} from "lucide-react";

import {
  useState,
} from "react";

import ContractStatusBadge from "../../components/contracts/ContractStatusBadge";
import RiskBadge from "../../components/contracts/RiskBadge";

import {
  useContracts,
} from "../../features/contracts/useContracts";

function ContractsPage() {
  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useContracts({
    page,
    page_size: 10,
    search,
  });

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[520px] rounded-full bg-indigo-600/[0.05] blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-400">
              Contract Workspace
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Contracts
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Manage, review, and monitor your organization&apos;s contracts.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 text-xs font-semibold text-indigo-300 transition hover:border-indigo-400/50 hover:bg-indigo-500/15 hover:text-indigo-200"
          >
            <FilePlus2 size={16} />

            Upload Contract
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-[#173052] bg-[#071426]/80 p-4">
          <div className="relative max-w-xl">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search contracts..."
              className="h-10 w-full rounded-lg border border-[#173052] bg-[#050E1D] pl-10 pr-4 text-xs text-slate-200 outline-none placeholder:text-slate-600 transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-5 overflow-hidden rounded-xl border border-[#173052] bg-[#071426]/80">
          {isLoading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <LoaderCircle
                  size={18}
                  className="animate-spin text-indigo-400"
                />

                Loading contracts...
              </div>
            </div>
          ) : isError ? (
            <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
              <div>
                <h2 className="text-sm font-semibold text-rose-300">
                  Unable to load contracts
                </h2>

                <p className="mt-2 text-xs text-slate-600">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong while loading contracts."}
                </p>
              </div>
            </div>
          ) : data?.items.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#173052] bg-[#0B1930]">
                  <FileText
                    size={20}
                    className="text-slate-600"
                  />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-slate-300">
                  No contracts found
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Try changing your search or upload a new contract.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#173052] text-left">
                      <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                        Contract
                      </th>

                      <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                        Type
                      </th>

                      <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                        Risk
                      </th>

                      <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                        Status
                      </th>

                      <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                        Updated
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data?.items.map((contract) => (
                      <tr
                        key={contract.id}
                        className="border-b border-[#102744] last:border-0 transition hover:bg-white/[0.015]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                              <FileText size={16} />
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-xs font-medium text-slate-200">
                                {contract.title}
                              </div>

                              <div className="mt-1 text-[10px] text-slate-600">
                                {contract.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs text-slate-500">
                          {contract.contract_type.replaceAll(
                            "_",
                            " ",
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <RiskBadge
                            level={contract.risk_level}
                            score={contract.risk_score}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <ContractStatusBadge
                            status={contract.status}
                          />
                        </td>

                        <td className="px-5 py-4 text-xs text-slate-600">
                          {new Date(
                            contract.updated_at,
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data && data.total_pages > 1 ? (
                <div className="flex items-center justify-between border-t border-[#173052] px-5 py-4">
                  <span className="text-[11px] text-slate-600">
                    Page {data.page} of{" "}
                    {data.total_pages}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() =>
                        setPage((current) =>
                          Math.max(1, current - 1),
                        )
                      }
                      className="rounded-lg border border-[#173052] px-3 py-1.5 text-[10px] text-slate-500 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={
                        page >= data.total_pages
                      }
                      onClick={() =>
                        setPage((current) =>
                          Math.min(
                            data.total_pages,
                            current + 1,
                          ),
                        )
                      }
                      className="rounded-lg border border-[#173052] px-3 py-1.5 text-[10px] text-slate-400 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractsPage;