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
    <div className="lexmind-page relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute right-[-120px] top-[-100px] h-[420px] w-[520px] rounded-full bg-[#9caf88]/[0.08] blur-3xl" />

      <div className="relative mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
            Contract Workspace
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="lexmind-display text-3xl font-medium tracking-[-0.035em] text-[#243027] sm:text-[38px]">
                Upload &amp; Process
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#687268]">
                Add a new contract or upload a new version to an existing
                contract. LexMind will create a processing job automatically.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-[#dddcd3] bg-[#fffefa] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#718060] shadow-[0_8px_24px_rgba(36,48,39,0.04)] sm:flex">
              <FileText size={13} />
              Document Intake
            </div>
          </div>
        </div>

        {/* Mode selector */}
        <div className="mb-6 rounded-2xl border border-[#dddcd3] bg-[#fffefa] p-2 shadow-[0_16px_40px_rgba(36,48,39,0.05)]">
          <div className="grid gap-2 md:grid-cols-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => switchMode("new-contract")}
              className={`group rounded-xl border px-5 py-5 text-left transition ${
                isNewContract
                  ? "border-[#9caf88] bg-[#e5eadf]"
                  : "border-transparent bg-transparent hover:border-[#dddcd3] hover:bg-[#f7f5ef]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    isNewContract
                      ? "border-[#9caf88] bg-[#fffefa] text-[#526047]"
                      : "border-[#dddcd3] bg-[#f7f5ef] text-[#7a8379]"
                  }`}
                >
                  <Plus size={17} />
                </div>

                <div>
                  <div
                    className={`text-sm font-semibold ${
                      isNewContract ? "text-[#243027]" : "text-[#526047]"
                    }`}
                  >
                    New Contract
                  </div>

                  <p className="mt-1.5 max-w-md text-xs leading-5 text-[#687268]">
                    Create a contract and upload its first document version.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => switchMode("new-version")}
              className={`group rounded-xl border px-5 py-5 text-left transition ${
                !isNewContract
                  ? "border-[#9caf88] bg-[#e5eadf]"
                  : "border-transparent bg-transparent hover:border-[#dddcd3] hover:bg-[#f7f5ef]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    !isNewContract
                      ? "border-[#9caf88] bg-[#fffefa] text-[#526047]"
                      : "border-[#dddcd3] bg-[#f7f5ef] text-[#7a8379]"
                  }`}
                >
                  <RefreshCw size={17} />
                </div>

                <div>
                  <div
                    className={`text-sm font-semibold ${
                      !isNewContract ? "text-[#243027]" : "text-[#526047]"
                    }`}
                  >
                    New Version
                  </div>

                  <p className="mt-1.5 max-w-md text-xs leading-5 text-[#687268]">
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
            <section className="lexmind-card p-5 sm:p-6">
              <div className="mb-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#718060]">
                  Step 01
                </div>

                <h2 className="lexmind-display mt-1.5 text-xl font-medium text-[#243027]">
                  Contract information
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-[#687268]">
                  Define the basic metadata for this contract.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#526047]">
                    Contract title
                  </label>

                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={isProcessing}
                    maxLength={255}
                    placeholder="Software Services Agreement"
                    className="h-11 w-full rounded-xl border border-[#dddcd3] bg-white px-3.5 text-sm text-[#243027] outline-none placeholder:text-[#a0a59f] transition focus:border-[#9caf88] focus:ring-4 focus:ring-[#9caf88]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#526047]">
                    Contract type
                  </label>

                  <select
                    value={contractType}
                    onChange={(event) => setContractType(event.target.value)}
                    disabled={isProcessing}
                    className="h-11 w-full rounded-xl border border-[#dddcd3] bg-white px-3.5 text-sm text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-4 focus:ring-[#9caf88]/10"
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

              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold text-[#526047]">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isProcessing}
                  rows={4}
                  maxLength={5000}
                  placeholder="Short description of the agreement..."
                  className="w-full resize-none rounded-xl border border-[#dddcd3] bg-white px-3.5 py-3 text-sm leading-6 text-[#243027] outline-none placeholder:text-[#a0a59f] transition focus:border-[#9caf88] focus:ring-4 focus:ring-[#9caf88]/10"
                />
              </div>
            </section>
          ) : (
            <section className="lexmind-card p-5 sm:p-6">
              <div className="mb-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#718060]">
                  Step 01
                </div>

                <h2 className="lexmind-display mt-1.5 text-xl font-medium text-[#243027]">
                  Existing contract
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-[#687268]">
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
                className="h-11 w-full rounded-xl border border-[#dddcd3] bg-white px-3.5 text-sm text-[#243027] outline-none transition focus:border-[#9caf88] focus:ring-4 focus:ring-[#9caf88]/10"
              >
                <option value="">Select an existing contract...</option>

                {contractsQuery.data?.items.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.title} —{" "}
                    {getContractTypeLabel(contract.contract_type)}
                  </option>
                ))}
              </select>

              {contractsQuery.isLoading ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#718060]">
                  <LoaderCircle size={13} className="animate-spin" />
                  Loading contracts...
                </div>
              ) : null}

              {contractsQuery.isError ? (
                <p className="mt-3 text-xs text-[#c93625]">
                  Unable to load existing contracts.
                </p>
              ) : null}

              {selectedContract ? (
                <div className="mt-4 rounded-xl border border-[#dddcd3] bg-[#f7f5ef] px-4 py-3.5">
                  <div className="text-sm font-semibold text-[#243027]">
                    {selectedContract.title}
                  </div>

                  <div className="mt-1 text-xs text-[#687268]">
                    {getContractTypeLabel(selectedContract.contract_type)}
                  </div>
                </div>
              ) : null}
            </section>
          )}

          {/* Document */}
          <section className="lexmind-card p-5 sm:p-6">
            <div className="mb-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#718060]">
                Step 02
              </div>

              <h2 className="lexmind-display mt-1.5 text-xl font-medium text-[#243027]">
                {isNewContract ? "Contract document" : "New document version"}
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[#687268]">
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
              className={`group flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition ${
                dragActive
                  ? "border-[#718060] bg-[#e5eadf]"
                  : "border-[#c9cec5] bg-[#f7f5ef] hover:border-[#9caf88] hover:bg-[#e5eadf]/60"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                disabled={isProcessing}
                onChange={handleFileInput}
              />

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition ${
                  dragActive
                    ? "border-[#9caf88] bg-white text-[#526047]"
                    : "border-[#dddcd3] bg-white text-[#718060] group-hover:border-[#9caf88]"
                }`}
              >
                <UploadCloud size={23} strokeWidth={1.7} />
              </div>

              <div className="mt-5 text-sm font-semibold text-[#243027]">
                Drag &amp; drop your contract here
              </div>

              <div className="mt-1.5 text-xs text-[#687268]">
                or click to browse files
              </div>

              <div className="mt-4 rounded-full border border-[#dddcd3] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#718060]">
                PDF / DOCX · Maximum 25 MB
              </div>
            </label>

            {file ? (
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-[#cfd7c8] bg-[#e5eadf]/60 px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c7d1bf] bg-white text-[#526047]">
                    <FileText size={17} />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[#243027]">
                      {file.name}
                    </div>

                    <div className="mt-1 text-xs text-[#687268]">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>

                {!isProcessing ? (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[#687268] transition hover:bg-white hover:text-[#e8412c]"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Change summary */}
          <section className="lexmind-card p-5 sm:p-6">
            <div className="mb-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#718060]">
                Step 03
              </div>

              <h2 className="lexmind-display mt-1.5 text-xl font-medium text-[#243027]">
                Version details
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[#687268]">
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
              className="w-full resize-none rounded-xl border border-[#dddcd3] bg-white px-3.5 py-3 text-sm leading-6 text-[#243027] outline-none placeholder:text-[#a0a59f] transition focus:border-[#9caf88] focus:ring-4 focus:ring-[#9caf88]/10"
            />
          </section>

          {/* Error */}
          {validationError || mutationError ? (
            <div className="flex items-start gap-3 rounded-xl border border-[#e8412c]/20 bg-[#e8412c]/[0.06] px-4 py-3.5">
              <XCircle
                size={18}
                className="mt-0.5 shrink-0 text-[#e8412c]"
              />

              <div className="text-xs font-medium leading-5 text-[#a92f22]">
                {validationError ?? mutationError}
              </div>
            </div>
          ) : null}

          {/* Processing status */}
          {jobQuery.data ? (
            <div className="lexmind-card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                {jobStatus === "SUCCEEDED" ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#9caf88] bg-[#e5eadf]">
                    <CheckCircle2 size={19} className="text-[#526047]" />
                  </div>
                ) : jobStatus === "FAILED" ||
                  jobStatus === "CANCELLED" ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8412c]/20 bg-[#e8412c]/[0.06]">
                    <XCircle size={19} className="text-[#e8412c]" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dddcd3] bg-[#f7f5ef]">
                    <LoaderCircle
                      size={19}
                      className="animate-spin text-[#718060]"
                    />
                  </div>
                )}

                <div>
                  <div className="text-sm font-semibold text-[#243027]">
                    Document processing
                  </div>

                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#718060]">
                    {jobStatus}
                  </div>
                </div>
              </div>

              {jobStatus === "SUCCEEDED" ? (
                <div className="mt-4 rounded-xl border border-[#cfd7c8] bg-[#e5eadf]/60 px-4 py-3">
                  <p className="text-xs leading-5 text-[#526047]">
                    Document processing completed successfully. Your contract
                    data will now be available across the workspace.
                  </p>
                </div>
              ) : null}

              {jobQuery.data.error_message ? (
                <div className="mt-4 rounded-xl border border-[#e8412c]/20 bg-[#e8412c]/[0.05] px-4 py-3">
                  <p className="text-xs leading-5 text-[#a92f22]">
                    {jobQuery.data.error_message}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Submit */}
          <div className="flex justify-end border-t border-[#dddcd3] pt-6">
            <button
              type="submit"
              disabled={
                isProcessing ||
                !file ||
                (!isNewContract && !contractId) ||
                (isNewContract && (!title.trim() || !contractType))
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#e8412c] bg-[#e8412c] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(232,65,44,0.16)] transition hover:bg-[#d73724] hover:shadow-[0_14px_30px_rgba(232,65,44,0.2)] disabled:cursor-not-allowed disabled:border-[#dddcd3] disabled:bg-[#dddcd3] disabled:text-[#8a9189] disabled:shadow-none"
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