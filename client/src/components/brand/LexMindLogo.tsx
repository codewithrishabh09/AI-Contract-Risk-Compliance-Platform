import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

interface LexMindLogoProps {
  href?: string;
  compact?: boolean;
  className?: string;
}

function LexMindLogo({
  href = "/",
  compact = false,
  className = "",
}: LexMindLogoProps) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="
          flex h-9 w-9 shrink-0 items-center justify-center
          rounded-[10px]
          border border-violet-400/30
          bg-violet-500/10
          shadow-[0_0_24px_rgba(139,92,246,0.10)]
        "
      >
        <Scale
          size={17}
          strokeWidth={1.7}
          className="text-violet-300"
        />
      </div>

      {!compact && (
        <div className="leading-none">
          <div className="text-[16px] font-semibold tracking-[-0.025em] text-white">
            LexMind
          </div>

          <div className="mt-1 text-[8px] font-medium uppercase tracking-[0.19em] text-slate-600">
            Contract Intelligence
          </div>
        </div>
      )}
    </div>
  );

  if (href === "") {
    return content;
  }

  return (
    <Link
      to={href}
      aria-label="LexMind home"
      className="inline-flex"
    >
      {content}
    </Link>
  );
}

export default LexMindLogo;