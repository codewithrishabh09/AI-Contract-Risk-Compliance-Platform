interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  description?: string;
}

function MetricCard({
  label,
  value,
  change,
  description,
}: MetricCardProps) {
  const positive = change !== undefined && change >= 0;

  return (
    <div className="rounded-xl border border-[#173052] bg-[#071426]/80 p-5 transition-colors hover:border-[#24446C]">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>

        {change !== undefined && (
          <span
            className={
              positive
                ? "text-xs font-medium text-emerald-400"
                : "text-xs font-medium text-rose-400"
            }
          >
            {positive ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-[11px] text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}

export default MetricCard;