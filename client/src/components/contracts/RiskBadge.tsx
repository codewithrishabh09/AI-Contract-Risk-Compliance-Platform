interface RiskBadgeProps {
  level: string | null;
  score?: number | null;
}

function RiskBadge({
  level,
  score,
}: RiskBadgeProps) {
  const normalizedLevel =
    level?.toLowerCase();

  if (!normalizedLevel) {
    return (
      <span className="inline-flex items-center rounded-full border border-[#24446C] bg-[#0B1930] px-2.5 py-1 text-[10px] font-medium text-slate-500">
        Not analyzed
      </span>
    );
  }

  const styles =
    normalizedLevel === "critical"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
      : normalizedLevel === "high"
        ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
        : normalizedLevel === "medium"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${styles}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
      />

      {level}

      {score !== null &&
      score !== undefined ? (
        <span className="opacity-70">
          {score}
        </span>
      ) : null}
    </span>
  );
}

export default RiskBadge;