import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  UploadCloud,
  XCircle,
} from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

import { useContracts } from "../../features/contracts/useContracts";
import {
  useContractUpload,
  useNewContractUpload,
  useProcessingJob,
} from "../../features/contracts/useContractUpload";

type UploadMode = "new-contract" | "new-version";

const CONTRACT_TYPES = [
  {
    value: "NDA",
    label: "Non-Disclosure Agreement",
  },
  {
    value: "EMPLOYMENT",
    label: "Employment Agreement",
  },
  {
    value: "SERVICE_AGREEMENT",
    label: "Service Agreement",
  },
  {
    value: "VENDOR_AGREEMENT",
    label: "Vendor Agreement",
  },
  {
    value: "DATA_PROCESSING_AGREEMENT",
    label: "Data Processing Agreement",
  },
  {
    value: "PRIVACY_POLICY",
    label: "Privacy Policy",
  },
  {
    value: "OTHER",
    label: "Other",
  },
] as const;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getContractTypeLabel(value?: string): string {
  return (
    CONTRACT_TYPES.find((item) => item.value === value)?.label ??
    value ??
    "Unknown type"
  );
}

function UploadPage() {
  const [searchParams] = useSearchParams();

  const contractIdFromUrl = searchParams.get("contractId");

  const [mode, setMode] = useState<UploadMode>(
    contractIdFromUrl ? "new-version" : "new-contract",
  );

  const [contractId, setContractId] = useState(contractIdFromUrl ?? "");
  const [title, setTitle] = useState("");
  const [contractType, setContractType] = useState("");
  const [description, setDescription] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const contractsQuery = useContracts({
    page: 1,
    page_size: 100,
  });

  const uploadMutation = useContractUpload();
  const newContractMutation = useNewContractUpload();

  const jobQuery = useProcessingJob(jobId);

  const isNewContract = mode === "new-contract";

  const selectedContract = useMemo(
    () =>
      contractsQuery.data?.items.find(
        (contract) => contract.id === contractId,
      ),
    [contractsQuery.data, contractId],
  );

  const activeMutation = isNewContract
    ? newContractMutation
    : uploadMutation;

  const isProcessing =
    activeMutation.isPending ||
    (Boolean(jobId) &&
      jobQuery.data?.status !== "SUCCEEDED" &&
      jobQuery.data?.status !== "FAILED" &&
      jobQuery.data?.status !== "CANCELLED");

  const jobStatus = jobQuery.data?.status;

  useEffect(() => {
    if (contractIdFromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("new-version");
      setContractId(contractIdFromUrl);
    }
  }, [contractIdFromUrl]);

  function switchMode(nextMode: UploadMode) {
    if (isProcessing) {
      return;
    }

    setMode(nextMode);
    setValidationError(null);
    setJobId(null);
    setFile(null);
    setChangeSummary("");

    if (nextMode === "new-contract") {
      setContractId("");
    }
  }

  function validateFile(selectedFile: File): string | null {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".docx"];

    const lowerName = selectedFile.name.toLowerCase();

    const validType =
      allowedTypes.includes(selectedFile.type) ||
      allowedExtensions.some((extension) => lowerName.endsWith(extension));

    if (!validType) {
      return "Only PDF and DOCX files are supported.";
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      return "File size must be 25 MB or smaller.";
    }

    if (selectedFile.size === 0) {
      return "The selected file is empty.";
    }

    return null;
  }

  function handleFile(selectedFile: File | null) {
    if (!selectedFile) {
      return;
    }

    const error = validateFile(selectedFile);

    setValidationError(error);

    if (!error) {
      setFile(selectedFile);
      setJobId(null);
    }
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0] ?? null);

    event.currentTarget.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragActive(false);

    handleFile(event.dataTransfer.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setValidationError(null);

    if (isNewContract && !title.trim()) {
      setValidationError("Enter a contract title.");
      return;
    }

    if (isNewContract && !contractType) {
      setValidationError("Select a contract type.");
      return;
    }

    if (!isNewContract && !contractId) {
      setValidationError("Select an existing contract.");
      return;
    }

    if (!file) {
      setValidationError("Select a PDF or DOCX file.");
      return;
    }

    const fileError = validateFile(file);

    if (fileError) {
      setValidationError(fileError);
      return;
    }

    try {
      const response = isNewContract
        ? await newContractMutation.mutateAsync({
            title: title.trim(),
            contractType,
            description: description.trim(),
            file,
            changeSummary: changeSummary.trim(),
          })
        : await uploadMutation.mutateAsync({
            contractId,
            file,
            changeSummary: changeSummary.trim(),
          });

      setJobId(response.processing_job.id);
      setFile(null);
      setChangeSummary("");
    } catch {
      // Mutation error is displayed below.
    }
  }

  const mutationError =
    activeMutation.error instanceof Error
      ? activeMutation.error.message
      : activeMutation.isError
        ? "Unable to upload the contract."
        : null;

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[600px] rounded-full bg-indigo-600/[0.05] blur-3xl" />

      <div className="relative mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-400">
            Contract Workspace
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Upload &amp; Process
              </h1>

              <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
                Add a new contract or upload a new version to an existing
                contract. LexMind will create a processing job automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Mode selector */}
        <div className="mb-5 rounded-xl border border-[#173052] bg-[#071426]/80 p-2">
          <div className="grid gap-2 md:grid-cols-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => switchMode("new-contract")}
              className={`group rounded-lg border px-4 py-4 text-left transition ${
                isNewContract
                  ? "border-indigo-400/30 bg-indigo-500/10"
                  : "border-transparent bg-transparent hover:border-[#173052] hover:bg-[#0B1930]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                    isNewContract
                      ? "border-indigo-400/20 bg-indigo-500/10 text-indigo-300"
                      : "border-[#173052] bg-[#050E1D] text-slate-500"
                  }`}
                >
                  <Plus size={17} />
                </div>

                <div>
                  <div
                    className={`text-xs font-semibold ${
                      isNewContract ? "text-indigo-200" : "text-slate-300"
                    }`}
                  >
                    New Contract
                  </div>

                  <p className="mt-1 text-[10px] leading-4 text-slate-600">
                    Create a contract and upload its first document version.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => switchMode("new-version")}
              className={`group rounded-lg border px-4 py-4 text-left transition ${
                !isNewContract
                  ? "border-indigo-400/30 bg-indigo-500/10"
                  : "border-transparent bg-transparent hover:border-[#173052] hover:bg-[#0B1930]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                    !isNewContract
                      ? "border-indigo-400/20 bg-indigo-500/10 text-indigo-300"
                      : "border-[#173052] bg-[#050E1D] text-slate-500"
                  }`}
                >
                  <RefreshCw size={17} />
                </div>

                <div>
                  <div
                    className={`text-xs font-semibold ${
                      !isNewContract ? "text-indigo-200" : "text-slate-300"
                    }`}
                  >
                    New Version
                  </div>

                  <p className="mt-1 text-[10px] leading-4 text-slate-600">
                    Add a new document version to an existing contract.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contract information */}
          {isNewContract ? (
            <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
              <div className="mb-5">
                <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-indigo-400">
                  Step 01
                </div>

                <h2 className="mt-1 text-sm font-semibold text-slate-200">
                  Contract information
                </h2>

                <p className="mt-1 text-[11px] text-slate-600">
                  Define the basic metadata for this contract.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-medium text-slate-500">
                    Contract title
                  </label>

                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={isProcessing}
                    maxLength={255}
                    placeholder="Software Services Agreement"
                    className="h-11 w-full rounded-lg border border-[#173052] bg-[#050E1D] px-3 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium text-slate-500">
                    Contract type
                  </label>

                  <select
                    value={contractType}
                    onChange={(event) => setContractType(event.target.value)}
                    disabled={isProcessing}
                    className="h-11 w-full rounded-lg border border-[#173052] bg-[#050E1D] px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                  >
                    <option value="">Select contract type...</option>

                    {CONTRACT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[11px] font-medium text-slate-500">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isProcessing}
                  rows={3}
                  maxLength={5000}
                  placeholder="Short description of the agreement..."
                  className="w-full resize-none rounded-lg border border-[#173052] bg-[#050E1D] px-3 py-3 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </section>
          ) : (
            <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
              <div className="mb-5">
                <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-indigo-400">
                  Step 01
                </div>

                <h2 className="mt-1 text-sm font-semibold text-slate-200">
                  Existing contract
                </h2>

                <p className="mt-1 text-[11px] text-slate-600">
                  Select the contract that this document belongs to.
                </p>
              </div>

              <select
                value={contractId}
                onChange={(event) => {
                  setContractId(event.target.value);
                  setValidationError(null);
                }}
                disabled={isProcessing || Boolean(contractIdFromUrl)}
                className="h-11 w-full rounded-lg border border-[#173052] bg-[#050E1D] px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
              >
                <option value="">Select an existing contract...</option>

                {contractsQuery.data?.items.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.title} — {getContractTypeLabel(contract.contract_type)}
                  </option>
                ))}
              </select>

              {contractsQuery.isLoading ? (
                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-600">
                  <LoaderCircle size={13} className="animate-spin" />
                  Loading contracts...
                </div>
              ) : null}

              {contractsQuery.isError ? (
                <p className="mt-3 text-[10px] text-rose-300">
                  Unable to load existing contracts.
                </p>
              ) : null}

              {selectedContract ? (
                <div className="mt-4 rounded-lg border border-[#173052] bg-[#050E1D] px-4 py-3">
                  <div className="text-xs font-semibold text-slate-300">
                    {selectedContract.title}
                  </div>

                  <div className="mt-1 text-[10px] text-slate-600">
                    {getContractTypeLabel(selectedContract.contract_type)}
                  </div>
                </div>
              ) : null}
            </section>
          )}

          {/* Document */}
          <section className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
            <div className="mb-4">
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-indigo-400">
                Step {isNewContract ? "02" : "02"}
              </div>

              <h2 className="mt-1 text-sm font-semibold text-slate-200">
                {isNewContract ? "Contract document" : "New document version"}
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                Upload the source document. PDF and DOCX files up to 25 MB are
                supported.
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
              onDrop={handleDrop}
              className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition ${
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
                onChange={handleFileInput}
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#24446C] bg-[#0B1930]">
                <UploadCloud size={21} className="text-indigo-400" />
              </div>

              <div className="mt-4 text-sm font-medium text-slate-300">
                Drag &amp; drop your contract here
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
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>

                {!isProcessing ? (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
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
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-indigo-400">
                Step 03
              </div>

              <h2 className="mt-1 text-sm font-semibold text-slate-200">
                Version details
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                Add optional context that helps reviewers understand this
                document version.
              </p>
            </div>

            <textarea
              value={changeSummary}
              onChange={(event) => setChangeSummary(event.target.value)}
              maxLength={2000}
              disabled={isProcessing}
              rows={4}
              placeholder="Example: Updated indemnification and limitation of liability clauses."
              className="w-full resize-none rounded-lg border border-[#173052] bg-[#050E1D] px-3 py-3 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            />
          </section>

          {/* Error */}
          {validationError || mutationError ? (
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
              <XCircle
                size={17}
                className="mt-0.5 shrink-0 text-rose-400"
              />

              <div className="text-xs text-rose-300">
                {validationError ?? mutationError}
              </div>
            </div>
          ) : null}

          {/* Processing status */}
          {jobQuery.data ? (
            <div className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5">
              <div className="flex items-center gap-3">
                {jobStatus === "SUCCEEDED" ? (
                  <CheckCircle2 size={19} className="text-emerald-400" />
                ) : jobStatus === "FAILED" || jobStatus === "CANCELLED" ? (
                  <XCircle size={19} className="text-rose-400" />
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

              {jobStatus === "SUCCEEDED" ? (
                <p className="mt-3 text-xs text-emerald-300">
                  Document processing completed successfully. Your contract
                  data will now be available across the workspace.
                </p>
              ) : null}

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
                !file ||
                (!isNewContract && !contractId) ||
                (isNewContract && (!title.trim() || !contractType))
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-5 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isProcessing ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
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