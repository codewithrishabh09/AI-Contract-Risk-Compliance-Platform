import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  UploadCloud,
  XCircle,
} from "lucide-react";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  useContracts,
} from "../../features/contracts/useContracts";

import {
  useContractUpload,
  useNewContractUpload,
  useProcessingJob,
} from "../../features/contracts/useContractUpload";


function formatFileSize(
  bytes: number,
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}


function UploadPage() {
  const [searchParams] =
    useSearchParams();

  const contractIdFromUrl =
    searchParams.get(
      "contractId",
    );

  const isNewContract =
    !contractIdFromUrl;

  const [contractId] =
    useState(
      contractIdFromUrl ?? "",
    );

  const [title, setTitle] =
    useState("");

  const [contractType, setContractType] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [changeSummary, setChangeSummary] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [dragActive, setDragActive] =
    useState(false);

  const [jobId, setJobId] =
    useState<string | null>(null);

  const [validationError, setValidationError] =
    useState<string | null>(null);

  const contractsQuery =
    useContracts({
      page: 1,
      page_size: 100,
    });

  const uploadMutation =
    useContractUpload();

  const newContractMutation =
    useNewContractUpload();

  const jobQuery =
    useProcessingJob(jobId);

  const selectedContract =
    useMemo(
      () =>
        contractsQuery.data?.items.find(
          (contract) =>
            contract.id ===
            contractId,
        ),
      [
        contractsQuery.data,
        contractId,
      ],
    );

  const activeMutation =
    isNewContract
      ? newContractMutation
      : uploadMutation;

  const isProcessing =
    activeMutation.isPending ||
    (
      Boolean(jobId) &&
      jobQuery.data?.status !==
        "SUCCEEDED" &&
      jobQuery.data?.status !==
        "FAILED" &&
      jobQuery.data?.status !==
        "CANCELLED"
    );


  function validateFile(
    selectedFile: File,
  ) {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [
      ".pdf",
      ".docx",
    ];

    const lowerName =
      selectedFile.name.toLowerCase();

    const validType =
      allowedTypes.includes(
        selectedFile.type,
      ) ||
      allowedExtensions.some(
        (extension) =>
          lowerName.endsWith(
            extension,
          ),
      );

    if (!validType) {
      return "Only PDF and DOCX files are supported.";
    }

    if (
      selectedFile.size >
      25 * 1024 * 1024
    ) {
      return "File size must be 25 MB or smaller.";
    }

    if (selectedFile.size === 0) {
      return "The selected file is empty.";
    }

    return null;
  }


  function handleFile(
    selectedFile: File | null,
  ) {
    if (!selectedFile) {
      return;
    }

    const error =
      validateFile(
        selectedFile,
      );

    setValidationError(
      error,
    );

    if (!error) {
      setFile(
        selectedFile,
      );

      setJobId(null);
    }
  }


  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    setValidationError(null);

    if (
      isNewContract &&
      !title.trim()
    ) {
      setValidationError(
        "Enter a contract title.",
      );
      return;
    }

    if (
      isNewContract &&
      !contractType
    ) {
      setValidationError(
        "Select a contract type.",
      );
      return;
    }

    if (
      !isNewContract &&
      !contractId
    ) {
      setValidationError(
        "Contract ID is missing.",
      );
      return;
    }

    if (!file) {
      setValidationError(
        "Select a PDF or DOCX file.",
      );
      return;
    }

    const fileError =
      validateFile(file);

    if (fileError) {
      setValidationError(
        fileError,
      );
      return;
    }

    try {
      const response =
        isNewContract
          ? await newContractMutation.mutateAsync(
              {
                title:
                  title.trim(),
                contractType,
                description,
                file,
                changeSummary,
              },
            )
          : await uploadMutation.mutateAsync(
              {
                contractId,
                file,
                changeSummary,
              },
            );

      setJobId(
        response.processing_job.id,
      );

      setFile(null);
      setChangeSummary("");

    } catch {
      // Mutation error is rendered below.
    }
  }


  const jobStatus =
    jobQuery.data?.status;


  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[600px] rounded-full bg-indigo-600/[0.05] blur-3xl" />

      <div className="relative mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-7">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-400">
            Contract Workspace
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {isNewContract
              ? "Upload New Contract"
              : "Upload New Version"}
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            {isNewContract
              ? "Create a contract, upload its first document version, and start processing."
              : "Upload a new document version and continue the contract lifecycle."}
          </p>
        </div>


        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >

          {isNewContract ? (
            <>
              <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
                <div className="mb-5">
                  <h2 className="text-sm font-semibold text-slate-200">
                    1. Contract information
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Basic metadata for the new contract.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-[11px] font-medium text-slate-500">
                      Contract title
                    </label>

                    <input
                      value={title}
                      onChange={(event) =>
                        setTitle(
                          event.target.value,
                        )
                      }
                      disabled={
                        isProcessing
                      }
                      placeholder="Software Services Agreement"
                      className="h-11 w-full rounded-lg border border-[#173052] bg-[#050E1D] px-3 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>


                  <div>
                    <label className="mb-2 block text-[11px] font-medium text-slate-500">
                      Contract type
                    </label>

                    <select
                      value={
                        contractType
                      }
                      onChange={(event) =>
                        setContractType(
                          event.target.value,
                        )
                      }
                      disabled={
                        isProcessing
                      }
                      className="h-11 w-full rounded-lg border border-[#173052] bg-[#050E1D] px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                    >
                      <option value="">
                        Select contract type...
                      </option>

                      <option value="SERVICE_AGREEMENT">
                        Service Agreement
                      </option>

                      <option value="MASTER_SERVICE_AGREEMENT">
                        Master Service Agreement
                      </option>

                      <option value="NDA">
                        Non-Disclosure Agreement
                      </option>

                      <option value="EMPLOYMENT_AGREEMENT">
                        Employment Agreement
                      </option>

                      <option value="VENDOR_AGREEMENT">
                        Vendor Agreement
                      </option>

                      <option value="LICENSE_AGREEMENT">
                        License Agreement
                      </option>

                      <option value="DATA_PROCESSING_AGREEMENT">
                        Data Processing Agreement
                      </option>

                      <option value="OTHER">
                        Other
                      </option>
                    </select>
                  </div>

                </div>


                <div className="mt-4">
                  <label className="mb-2 block text-[11px] font-medium text-slate-500">
                    Description
                  </label>

                  <textarea
                    value={
                      description
                    }
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    disabled={
                      isProcessing
                    }
                    rows={3}
                    maxLength={5000}
                    placeholder="Short description of the agreement..."
                    className="w-full resize-none rounded-lg border border-[#173052] bg-[#050E1D] px-3 py-3 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">

              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-200">
                  1. Existing contract
                </h2>

                <p className="mt-1 text-[11px] text-slate-600">
                  This document will become a new version of the selected contract.
                </p>
              </div>

              <div className="rounded-lg border border-[#173052] bg-[#050E1D] px-4 py-3">
                <div className="text-xs font-semibold text-slate-300">
                  {selectedContract?.title ??
                    "Loading contract..."}
                </div>

                <div className="mt-1 text-[10px] text-slate-600">
                  {selectedContract?.contract_type ??
                    contractId}
                </div>
              </div>
            </section>
          )}


          <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">

            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-200">
                {isNewContract
                  ? "2. Contract document"
                  : "2. New document version"}
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                PDF and DOCX files up to 25 MB are supported.
              </p>
            </div>


            <label
              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragActive(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);

                handleFile(
                  event.dataTransfer.files?.[0] ??
                    null,
                );
              }}
              className={`flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition ${
                dragActive
                  ? "border-indigo-400 bg-indigo-500/10"
                  : "border-[#24446C] bg-[#050E1D]/50 hover:border-indigo-500/40 hover:bg-indigo-500/[0.03]"
              }`}
            >

              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                disabled={
                  isProcessing
                }
                onChange={(event) => {
                  handleFile(
                    event.target.files?.[0] ??
                      null,
                  );

                  event.currentTarget.value =
                    "";
                }}
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#24446C] bg-[#0B1930]">
                <UploadCloud
                  size={21}
                  className="text-indigo-400"
                />
              </div>

              <div className="mt-4 text-sm font-medium text-slate-300">
                Drag & drop your contract here
              </div>

              <div className="mt-1 text-[11px] text-slate-600">
                or click to browse files
              </div>

              <div className="mt-3 text-[10px] text-slate-700">
                PDF / DOCX · Maximum 25 MB
              </div>

            </label>


            {file ? (
              <div className="mt-4 flex items-center justify-between rounded-lg border border-[#173052] bg-[#050E1D] px-4 py-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <FileText
                      size={16}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-slate-300">
                      {file.name}
                    </div>

                    <div className="mt-1 text-[10px] text-slate-600">
                      {formatFileSize(
                        file.size,
                      )}
                    </div>
                  </div>

                </div>

                {!isProcessing ? (
                  <button
                    type="button"
                    onClick={() =>
                      setFile(
                        null,
                      )
                    }
                    className="text-[10px] text-slate-600 transition hover:text-rose-300"
                  >
                    Remove
                  </button>
                ) : null}

              </div>
            ) : null}

          </section>


          <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">

            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-200">
                {isNewContract
                  ? "3. Version details"
                  : "3. Change summary"}
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                Optional context for this document version.
              </p>
            </div>

            <textarea
              value={
                changeSummary
              }
              onChange={(event) =>
                setChangeSummary(
                  event.target.value,
                )
              }
              maxLength={2000}
              disabled={
                isProcessing
              }
              rows={4}
              placeholder="Example: Updated indemnification and limitation of liability clauses."
              className="w-full resize-none rounded-lg border border-[#173052] bg-[#050E1D] px-3 py-3 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            />

          </section>


          {validationError ||
          activeMutation.isError ? (
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">

              <XCircle
                size={17}
                className="mt-0.5 shrink-0 text-rose-400"
              />

              <div className="text-xs text-rose-300">
                {validationError ??
                  (
                    activeMutation.error instanceof
                    Error
                      ? activeMutation.error.message
                      : "Unable to upload the contract."
                  )}
              </div>

            </div>
          ) : null}


          {jobQuery.data ? (
            <div className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">

              <div className="flex items-center gap-3">

                {jobStatus ===
                "SUCCEEDED" ? (
                  <CheckCircle2
                    size={19}
                    className="text-emerald-400"
                  />
                ) : jobStatus ===
                      "FAILED" ||
                    jobStatus ===
                      "CANCELLED" ? (
                  <XCircle
                    size={19}
                    className="text-rose-400"
                  />
                ) : (
                  <LoaderCircle
                    size={19}
                    className="animate-spin text-indigo-400"
                  />
                )}

                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Document processing
                  </div>

                  <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">
                    {jobStatus}
                  </div>
                </div>

              </div>

              {jobQuery.data.error_message ? (
                <p className="mt-3 text-xs text-rose-300">
                  {
                    jobQuery.data
                      .error_message
                  }
                </p>
              ) : null}

            </div>
          ) : null}


          <div className="flex justify-end">

            <button
              type="submit"
              disabled={
                isProcessing ||
                !file ||
                (
                  isNewContract &&
                  (
                    !title.trim() ||
                    !contractType
                  )
                )
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-5 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-40"
            >

              {isProcessing ? (
                <>
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />

                  Processing...
                </>
              ) : (
                <>
                  <UploadCloud
                    size={16}
                  />

                  {isNewContract
                    ? "Create & Upload Contract"
                    : "Upload New Version"}
                </>
              )}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}


export default UploadPage;