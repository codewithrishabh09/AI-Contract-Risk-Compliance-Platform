import {
  AlertTriangle,
  Clock3,
  FileText,
  ShieldAlert,
} from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  description?: string;
}

function MetricIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();

  const iconProps = {
    size: 21,
    strokeWidth: 1.8,
    className: "text-[#718060]",
  };

  if (normalized.includes("high risk")) {
    return <ShieldAlert {...iconProps} />;
  }

  if (normalized.includes("critical")) {
    return <AlertTriangle {...iconProps} />;
  }

  if (normalized.includes("pending")) {
    return <Clock3 {...iconProps} />;
  }

  return <FileText {...iconProps} />;
}

function MetricCard({
  label,
  value,
  change,
  description,
}: MetricCardProps) {
  const positive = change !== undefined && change >= 0;

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-[18px]
        border border-[#dddcd3]
        bg-[#fffefa]
        p-5
        shadow-[0_10px_30px_rgba(36,48,39,0.045)]
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-[#c9cfbf]
        hover:shadow-[0_16px_34px_rgba(36,48,39,0.07)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex h-12 w-12 shrink-0 items-center justify-center
            rounded-full
            border border-[#d7dfce]
            bg-[#e8eee1]
          "
        >
          <MetricIcon label={label} />
        </div>

        {change !== undefined ? (
          <span
            className={`
              inline-flex items-center
              rounded-full
              px-2.5 py-1
              text-[10px]
              font-semibold
              ${
                positive
                  ? "bg-[#e5eadf] text-[#557046]"
                  : "bg-[#fbe4df] text-[#d74430]"
              }
            `}
          >
            {positive ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7a8379]">
          {label}
        </p>

        <p className="mt-1.5 font-['Playfair_Display'] text-[30px] font-semibold leading-none tracking-[-0.035em] text-[#182019]">
          {value}
        </p>

        {description ? (
          <p className="mt-2 text-[11px] leading-5 text-[#7a8379]">
            {description}
          </p>
        ) : null}
      </div>

      <div
        className="
          pointer-events-none absolute
          -bottom-8 -right-8
          h-24 w-24
          rounded-full
          bg-[#9caf88]/[0.08]
          blur-2xl
          transition-opacity
          group-hover:opacity-100
        "
      />
    </div>
  );
}

export default MetricCard;