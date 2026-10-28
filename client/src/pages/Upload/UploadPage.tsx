import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  UploadCloud,
  XCircle,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useContracts,
} from "../../features/contracts/useContracts";

import {
  useContractUpload,
  useProcessingJob,
} from "../../features/contracts/useContractUpload";

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function UploadPage() {
  const [contractId, setContractId] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [changeSummary, setChangeSummary] =
    useState("");

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

  const jobQuery =
    useProcessingJob(jobId);

  const isProcessing =
    uploadMutation.isPending ||
    (
      Boolean(jobId) &&
      jobQuery.data?.status !==
        "SUCCEEDED" &&
      jobQuery.data?.status !==
        "FAILED" &&
      jobQuery.data?.status !==
        "CANCELLED"
    );

  const selectedContract =
    useMemo(
      () =>
        contractsQuery.data?.items.find(
          (contract) =>
            contract.id === contractId,
        ),
      [
        contractsQuery.data,
        contractId,
      ],
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
          lowerName.endsWith(extension),
      );

    if (!validType) {
      return "Only PDF and DOCX files are supported.";
    }

    const maxSize =
      25 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
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
      validateFile(selectedFile);

    setValidationError(error);

    if (!error) {
      setFile(selectedFile);
      setJobId(null);
    }
  }

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    setValidationError(null);

    if (!contractId) {
      setValidationError(
        "Select a contract first.",
      );
      return;
    }

    if (!file) {
      setValidationError(
        "Select a PDF or DOCX file.",
      );
      return;
    }

    const error =
      validateFile(file);

    if (error) {
      setValidationError(error);
      return;
    }

    try {
      const response =
        await uploadMutation.mutateAsync({
          contractId,
          file,
          changeSummary,
        });

      setJobId(
        response.processing_job.id,
      );
    } catch {
      // Error is exposed through
      // uploadMutation.error.
    }
  }

  const jobStatus =
    jobQuery.data?.status;

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[380px] w-[520px] rounded-full bg-indigo-600/[0.05] blur-3xl" />

      <div className="relative mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-7">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-400">
            Contract Workspace
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Upload Contract
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Upload a new version of an existing contract and start document processing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Contract */}
          <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-200">
                1. Select contract
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                The uploaded document will become a new version of this contract.
              </p>
            </div>

            <select
              value={contractId}
              onChange={(event) =>
                setContractId(
                  event.target.value,
                )
              }
              disabled={
                contractsQuery.isLoading ||
                isProcessing
              }
              className="h-11 w-full rounded-lg border border-[#173052] bg-[#050E1D] px-3 text-xs text-slate-300 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            >
              <option value="">
                Select a contract...
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

            {selectedContract ? (
              <div className="mt-3 rounded-lg border border-[#173052] bg-[#050E1D]/70 px-3 py-2.5">
                <div className="text-xs font-medium text-slate-300">
                  {selectedContract.title}
                </div>

                <div className="mt-1 text-[10px] text-slate-600">
                  {selectedContract.contract_type}
                </div>
              </div>
            ) : null}
          </section>

          {/* File */}
          <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-200">
                2. Contract document
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
                disabled={isProcessing}
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
                    <FileText size={16} />
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
                      setFile(null)
                    }
                    className="text-[10px] text-slate-600 transition hover:text-rose-300"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Change summary */}
          <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-200">
                3. Version details
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                Optional context for this contract version.
              </p>
            </div>

            <textarea
              value={changeSummary}
              onChange={(event) =>
                setChangeSummary(
                  event.target.value,
                )
              }
              maxLength={2000}
              disabled={isProcessing}
              rows={4}
              placeholder="Example: Updated indemnification and limitation of liability clauses."
              className="w-full resize-none rounded-lg border border-[#173052] bg-[#050E1D] px-3 py-3 text-xs text-slate-300 outline-none placeholder:text-slate-700 transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            />
          </section>

          {/* Error */}
          {validationError ||
          uploadMutation.isError ? (
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
              <XCircle
                size={17}
                className="mt-0.5 shrink-0 text-rose-400"
              />

              <div className="text-xs text-rose-300">
                {validationError ??
                  (uploadMutation.error instanceof Error
                    ? uploadMutation.error.message
                    : "Unable to upload the contract.")}
              </div>
            </div>
          ) : null}

          {/* Processing */}
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
                  {jobQuery.data.error_message}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                isProcessing ||
                !contractId ||
                !file
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

                  Upload Contract
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