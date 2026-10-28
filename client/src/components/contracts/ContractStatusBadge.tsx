interface ContractStatusBadgeProps {
  status: string;
}

function ContractStatusBadge({
  status,
}: ContractStatusBadgeProps) {
  const normalizedStatus =
    status.toLowerCase();

  const styles =
    normalizedStatus === "active"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : normalizedStatus === "draft"
        ? "border-slate-500/30 bg-slate-500/10 text-slate-300"
        : normalizedStatus === "expired"
          ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
          : normalizedStatus === "terminated"
            ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
            : "border-[#24446C] bg-[#0B1930] text-slate-400";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${styles}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default ContractStatusBadge;