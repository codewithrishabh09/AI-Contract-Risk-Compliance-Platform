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
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-[12px]
          border border-[#9caf88]
          bg-[#e5eadf]
          shadow-[0_8px_20px_rgba(36,48,39,0.08)]
        "
      >
        <Scale
          size={18}
          strokeWidth={1.8}
          className="text-[#526047]"
        />
      </div>

      {!compact && (
        <div className="leading-none">
          <div className="text-[17px] font-semibold tracking-[-0.03em] text-[#243027]">
            LexMind
          </div>

          <div className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.19em] text-[#7a8379]">
            Contract Intelligence
          </div>
        </div>
      )}
    </div>
  );

  if (href === "") return content;

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