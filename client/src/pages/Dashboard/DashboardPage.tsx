import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import RiskTrendChart from "../../components/dashboard/RiskTrendChart";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../features/dashboard/useDashboard";

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getFirstName(fullName?: string): string {
  if (!fullName?.trim()) {
    return "there";
  }

  return fullName.trim().split(/\s+/)[0];
}

function formatContractType(value: string): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function formatRiskScore(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return Number(value).toFixed(1);
}

function getRiskBadgeClass(
  riskLevel: string | null,
): string {
  switch (riskLevel?.toUpperCase()) {
    case "CRITICAL":
      return "border-[#e8412c]/20 bg-[#fbe4df] text-[#d74430]";

    case "HIGH":
      return "border-[#e8412c]/20 bg-[#fbe4df] text-[#d74430]";

    case "MEDIUM":
      return "border-[#e9b36d]/30 bg-[#fff0dc] text-[#c27624]";

    case "LOW":
      return "border-[#9caf88]/30 bg-[#e5eadf] text-[#557046]";

    default:
      return "border-[#dddcd3] bg-[#f4f3ed] text-[#687268]";
  }
}

function getStatusLabel(status: string): string {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

interface DashboardMetricCardProps {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  tone: "sage" | "tomato" | "amber" | "neutral";
}

function DashboardMetricCard({
  label,
  value,
  description,
  icon,
  tone,
}: DashboardMetricCardProps) {
  const toneClasses = {
    sage: {
      icon:
        "border-[#d1ddc9] bg-[#e5eadf] text-[#718060]",
      value: "text-[#243027]",
    },
    tomato: {
      icon:
        "border-[#f0d0c9] bg-[#fbe4df] text-[#e8412c]",
      value: "text-[#243027]",
    },
    amber: {
      icon:
        "border-[#ecdcc6] bg-[#fff0dc] text-[#c27624]",
      value: "text-[#243027]",
    },
    neutral: {
      icon:
        "border-[#dddcd3] bg-[#f1f1eb] text-[#687268]",
      value: "text-[#243027]",
    },
  };

  return (
    <article
      className="
        group min-w-0
        rounded-[20px]
        border border-[#dddcd3]
        bg-[#fffefa]
        px-5 py-5
        shadow-[0_10px_28px_rgba(36,48,39,0.045)]
        transition
        hover:-translate-y-0.5
        hover:shadow-[0_14px_32px_rgba(36,48,39,0.07)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`
            flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-2xl border
            ${toneClasses[tone].icon}
          `}
        >
          {icon}
        </div>

        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a0a69e]">
          Workspace
        </span>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#858d84]">
          {label}
        </p>

        <div className="mt-1 flex items-end gap-2">
          <span
            className={`
              font-['Playfair_Display']
              text-[30px]
              font-semibold
              leading-none
              ${toneClasses[tone].value}
            `}
          >
            {value}
          </span>
        </div>

        <p className="mt-2 text-[10px] leading-5 text-[#90978f]">
          {description}
        </p>
      </div>
    </article>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  tone: "sage" | "tomato";
}

function QuickAction({
  icon,
  title,
  description,
  onClick,
  tone,
}: QuickActionProps) {
  const classes =
    tone === "tomato"
      ? {
          wrapper:
            "border-[#f0d7d1] bg-[#fff8f5] hover:border-[#e8412c]/30 hover:bg-[#fff4f0]",
          icon:
            "bg-[#fbe4df] text-[#e8412c]",
        }
      : {
          wrapper:
            "border-[#dce4d7] bg-[#f7f9f4] hover:border-[#c4d2bb] hover:bg-[#f0f5ec]",
          icon:
            "bg-[#e5eadf] text-[#718060]",
        };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        flex min-h-[118px]
        flex-col items-start
        justify-between
        rounded-[18px]
        border
        p-4
        text-left
        transition
        ${classes.wrapper}
      `}
    >
      <div
        className={`
          flex h-10 w-10
          items-center justify-center
          rounded-xl
          ${classes.icon}
        `}
      >
        {icon}
      </div>

      <div className="mt-4 w-full">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#334036]">
            {title}
          </span>

          <ArrowRight
            size={13}
            className="text-[#a0a69e] transition group-hover:translate-x-0.5 group-hover:text-[#718060]"
          />
        </div>

        <p className="mt-1 text-[10px] leading-4 text-[#8a9188]">
          {description}
        </p>
      </div>
    </button>
  );
}

function DashboardPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useDashboard();

  /*
   * Initial loading state.
   */
  if (isLoading && !data) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f7f5ef]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5eadf]">
            <LoaderCircle
              size={21}
              className="animate-spin text-[#718060]"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#243027]">
              Loading contract intelligence
            </p>

            <p className="mt-1 text-xs text-[#7a8379]">
              Preparing your workspace insights...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error state.
   */
  if (isError && !data) {
    return (
      <div className="relative min-h-full overflow-hidden bg-[#f7f5ef]">
        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[900px] items-center justify-center px-4 py-8 sm:px-6">
          <div
            className="
              w-full
              rounded-[24px]
              border border-[#dddcd3]
              bg-[#fffefa]
              p-8 text-center
              shadow-[0_18px_45px_rgba(36,48,39,0.07)]
            "
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fbe4df]">
              <AlertTriangle
                size={21}
                className="text-[#e8412c]"
              />
            </div>

            <h1 className="mt-5 font-['Playfair_Display'] text-xl font-semibold text-[#243027]">
              Unable to load dashboard
            </h1>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#7a8379]">
              We couldn&apos;t retrieve the latest contract
              intelligence data. Your contracts are not affected.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="
                mt-6 inline-flex items-center gap-2
                rounded-full
                bg-[#e8412c]
                px-5 py-2.5
                text-xs font-semibold text-white
                shadow-[0_8px_20px_rgba(232,65,44,0.18)]
                transition
                hover:bg-[#d83b28]
              "
            >
              <RefreshCw size={14} />
              Try again
            </button>

            {error instanceof Error ? (
              <p className="mx-auto mt-4 max-w-lg truncate text-[10px] text-[#a0a69f]">
                {error.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const firstName = getFirstName(user?.full_name);

  const hasRiskTrend = data.risk_trend.length > 0;

  const hasRiskDistribution =
    data.risk_distribution.low > 0 ||
    data.risk_distribution.medium > 0 ||
    data.risk_distribution.high > 0 ||
    data.risk_distribution.critical > 0;

  return (
    <div className="min-h-full bg-[#f7f5ef]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[700px] rounded-full bg-[#9caf88]/[0.07] blur-3xl" />

        <main className="relative mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-7 xl:px-9">
          {/* =========================================================
              HERO
          ========================================================== */}
          <section
            className="
              relative
              min-h-[250px]
              overflow-hidden
              rounded-[22px]
              border border-[#d8d9cc]
              bg-[#e8e7d9]
              shadow-[0_14px_38px_rgba(36,48,39,0.06)]
            "
          >
            {/* Legal image */}
            <div
              className="
                absolute inset-0
                bg-cover bg-center
              "
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1649653084130-06638e40ca25?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=88&w=1800')",
              }}
            />

            {/* Image treatment */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#eeede1] via-[#eeede1]/[0.94] via-[58%] to-[#eeede1]/[0.18]" />

            <div className="absolute inset-y-0 right-0 w-[52%] bg-gradient-to-l from-[#9caf88]/[0.10] to-transparent" />

            {/* Decorative tomato accent */}
            <div
              className="
                pointer-events-none
                absolute bottom-[-42px] right-[-40px]
                h-[105px] w-[270px]
                rotate-[-14deg]
                bg-[#e8412c]
              "
            />

            <div className="relative z-10 flex min-h-[250px] items-center px-6 py-8 sm:px-9 lg:px-10">
              <div className="max-w-[690px]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#526047]">
                    Contract Intelligence
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#9caf88]" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#718060]">
                    Workspace Overview
                  </span>
                </div>

                <h1
                  className="
                    font-['Playfair_Display']
                    text-[34px]
                    font-semibold
                    leading-[1.05]
                    tracking-[-0.035em]
                    text-[#182019]
                    sm:text-[40px]
                    lg:text-[44px]
                  "
                >
                  {getGreeting()}, {firstName} 👋
                </h1>

                <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#4f594f] sm:text-[15px]">
                  Here&apos;s what&apos;s happening with your
                  contracts today.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/upload")}
                    className="
                      inline-flex items-center gap-2
                      rounded-full
                      bg-[#e8412c]
                      px-5 py-2.5
                      text-xs font-semibold text-white
                      shadow-[0_9px_24px_rgba(232,65,44,0.20)]
                      transition
                      hover:bg-[#d83b28]
                      hover:shadow-[0_12px_28px_rgba(232,65,44,0.24)]
                    "
                  >
                    Analyze New Contract
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/contracts")}
                    className="
                      inline-flex items-center gap-2
                      rounded-full
                      border border-[#d5d4c9]
                      bg-[#fffefa]/80
                      px-5 py-2.5
                      text-xs font-semibold text-[#243027]
                      backdrop-blur-sm
                      transition
                      hover:border-[#bfc5b8]
                      hover:bg-[#fffefa]
                    "
                  >
                    View All Contracts
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              KPI METRICS
          ========================================================== */}
          <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardMetricCard
              label="Total Contracts"
              value={data.total_contracts}
              description="Contracts in workspace"
              tone="sage"
              icon={<FileText size={20} />}
            />

            <DashboardMetricCard
              label="High Risk Contracts"
              value={data.high_risk_contracts}
              description="Contracts requiring attention"
              tone="tomato"
              icon={<ShieldAlert size={20} />}
            />

            <DashboardMetricCard
              label="Critical Findings"
              value={data.critical_findings}
              description="Open critical issues"
              tone="tomato"
              icon={<AlertTriangle size={20} />}
            />

            <DashboardMetricCard
              label="Pending Analysis"
              value={data.pending_analysis}
              description="Currently being processed"
              tone="amber"
              icon={<Clock3 size={20} />}
            />
          </section>

          {/* =========================================================
              RISK OVERVIEW + DISTRIBUTION
          ========================================================== */}
          <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(310px,0.75fr)]">
            {/* Risk Overview */}
            <section
              className="
                min-w-0
                rounded-[22px]
                border border-[#dddcd3]
                bg-[#fffefa]
                p-5
                shadow-[0_12px_32px_rgba(36,48,39,0.045)]
                sm:p-6
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#718060]">
                    <BarChart3 size={18} />
                  </div>

                  <div>
                    <h2 className="font-['Playfair_Display'] text-[19px] font-semibold text-[#243027]">
                      Risk Overview
                    </h2>

                    <p className="mt-1 text-[11px] text-[#7a8379]">
                      Contract risk activity across analyzed versions
                    </p>
                  </div>
                </div>

                {isFetching ? (
                  <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#dce4d7] bg-[#f3f6ef] px-2.5 py-1.5 text-[9px] font-semibold text-[#718060]">
                    <LoaderCircle
                      size={11}
                      className="animate-spin"
                    />
                    Syncing
                  </div>
                ) : null}
              </div>

              <div className="mt-6">
                {hasRiskTrend ? (
                  <div className="rounded-[16px] border border-[#e8e7df] bg-[#faf9f5] px-3 py-4 sm:px-4">
                    <RiskTrendChart
                      data={data.risk_trend}
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[250px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[#d8d9d0] bg-[#faf9f5] px-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#718060]">
                      <BarChart3 size={21} />
                    </div>

                    <p className="mt-4 text-xs font-semibold text-[#687268]">
                      No risk trend available yet
                    </p>

                    <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#8a9188]">
                      Risk activity will appear here once
                      contracts have completed analysis.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-[9px] text-[#9aa197]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#718060]" />
                  Average risk score
                </span>

                <span>Scale: 0–100</span>
              </div>
            </section>

            {/* Risk Distribution */}
            <section
              className="
                rounded-[22px]
                border border-[#dddcd3]
                bg-[#fffefa]
                p-5
                shadow-[0_12px_32px_rgba(36,48,39,0.045)]
                sm:p-6
              "
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#718060]">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h2 className="font-['Playfair_Display'] text-[19px] font-semibold text-[#243027]">
                    Risk Distribution
                  </h2>

                  <p className="mt-1 text-[11px] text-[#7a8379]">
                    Latest analyzed contract risk
                  </p>
                </div>
              </div>

              {hasRiskDistribution ? (
                <div className="mt-7 space-y-5">
                  {[
                    {
                      label: "Low",
                      value: data.risk_distribution.low,
                      dot: "bg-[#718060]",
                      bg: "bg-[#e5eadf]",
                    },
                    {
                      label: "Medium",
                      value: data.risk_distribution.medium,
                      dot: "bg-[#e9a15a]",
                      bg: "bg-[#fff0dc]",
                    },
                    {
                      label: "High",
                      value: data.risk_distribution.high,
                      dot: "bg-[#e8412c]",
                      bg: "bg-[#fbe4df]",
                    },
                    {
                      label: "Critical",
                      value: data.risk_distribution.critical,
                      dot: "bg-[#b83225]",
                      bg: "bg-[#f6dfdb]",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${item.dot}`}
                          />

                          <span className="text-xs font-medium text-[#687268]">
                            {item.label}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-[#243027]">
                          {item.value}
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eeece5]">
                        {data.total_contracts > 0 ? (
                          <div
                            className={`h-full rounded-full ${item.dot} transition-all duration-500`}
                            style={{
                              width: `${Math.max(
                                item.value > 0 ? 5 : 0,
                                Math.min(
                                  100,
                                  (item.value /
                                    Math.max(
                                      data.total_contracts,
                                      1,
                                    )) *
                                    100,
                                ),
                              )}%`,
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-7 rounded-[16px] border border-dashed border-[#d8d9d0] bg-[#faf9f5] px-4 py-10 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eadf] text-[#718060]">
                    <ShieldCheck size={18} />
                  </div>

                  <p className="mt-4 text-xs font-semibold text-[#687268]">
                    No analyzed contracts yet
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#8a9188]">
                    Risk distribution will appear after
                    analysis completes.
                  </p>
                </div>
              )}

              <div className="mt-7 rounded-[15px] border border-[#e4e6de] bg-[#f7f9f4] px-4 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#718060]">
                  Risk Intelligence
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#7a8379]">
                  Monitor how contract risk is distributed across
                  your latest analyzed documents.
                </p>
              </div>
            </section>
          </section>

          {/* =========================================================
              RECENT CONTRACTS + QUICK ACTIONS
          ========================================================== */}
          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.7fr)]">
            {/* Recent Contracts */}
            <section
              className="
                min-w-0
                overflow-hidden
                rounded-[22px]
                border border-[#dddcd3]
                bg-[#fffefa]
                shadow-[0_12px_32px_rgba(36,48,39,0.045)]
              "
            >
              <div className="flex items-center justify-between border-b border-[#e7e5dc] px-5 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#718060]">
                    <FileCheck2 size={18} />
                  </div>

                  <div>
                    <h2 className="font-['Playfair_Display'] text-[19px] font-semibold text-[#243027]">
                      Recent Contracts
                    </h2>

                    <p className="mt-1 text-[11px] text-[#7a8379]">
                      Latest activity in your organization
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/contracts")}
                  className="
                    hidden items-center gap-1.5
                    rounded-full
                    border border-[#e1e0d7]
                    bg-[#faf9f5]
                    px-3 py-2
                    text-[10px] font-semibold text-[#687268]
                    transition
                    hover:border-[#cfd6c9]
                    hover:bg-[#f3f6ef]
                    hover:text-[#526047]
                    sm:inline-flex
                  "
                >
                  View All
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#e9e7df] text-left">
                      <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#929990] sm:px-6">
                        Contract
                      </th>

                      <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#929990]">
                        Type
                      </th>

                      <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#929990]">
                        Score
                      </th>

                      <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#929990]">
                        Risk
                      </th>

                      <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#929990]">
                        Updated
                      </th>

                      <th className="w-10 px-3 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {data.recent_contracts.length > 0 ? (
                      data.recent_contracts.map(
                        (contract) => (
                          <tr
                            key={contract.id}
                            onClick={() =>
                              navigate(
                                `/contracts/${contract.id}`,
                              )
                            }
                            className="
                              group cursor-pointer
                              border-b border-[#eeece4]
                              last:border-0
                              transition-colors
                              hover:bg-[#f8f9f5]
                            "
                          >
                            <td className="px-5 py-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className="
                                    flex h-10 w-10 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    border border-[#dce3d5]
                                    bg-[#edf1e9]
                                    text-[#718060]
                                    transition
                                    group-hover:bg-[#e5eadf]
                                  "
                                >
                                  <FileText size={16} />
                                </div>

                                <div className="min-w-0">
                                  <span className="block max-w-[260px] truncate text-xs font-semibold text-[#334036]">
                                    {contract.title}
                                  </span>

                                  {contract.risk_score ===
                                  null ? (
                                    <span className="mt-0.5 block text-[10px] text-[#9aa196]">
                                      Awaiting analysis
                                    </span>
                                  ) : (
                                    <span className="mt-0.5 block text-[10px] text-[#9aa196]">
                                      Contract workspace
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-[11px] text-[#7a8379]">
                              {formatContractType(
                                contract.contract_type,
                              )}
                            </td>

                            <td className="px-5 py-4">
                              {contract.risk_score !==
                              null ? (
                                <span className="text-xs font-bold text-[#334036]">
                                  {formatRiskScore(
                                    contract.risk_score,
                                  )}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[10px] text-[#9aa196]">
                                  <Clock3 size={11} />
                                  Pending
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`
                                  inline-flex rounded-full
                                  border px-2.5 py-1
                                  text-[9px] font-bold
                                  uppercase tracking-[0.05em]
                                  ${getRiskBadgeClass(
                                    contract.risk_level,
                                  )}
                                `}
                              >
                                {contract.risk_level
                                  ? contract.risk_level
                                  : getStatusLabel(
                                      contract.status,
                                    )}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-[10px] text-[#8a9188]">
                              {new Date(
                                contract.updated_at,
                              ).toLocaleDateString(
                                undefined,
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>

                            <td className="px-3 py-4">
                              <ChevronRight
                                size={15}
                                className="
                                  text-[#b0b5ac]
                                  transition
                                  group-hover:translate-x-0.5
                                  group-hover:text-[#e8412c]
                                "
                              />
                            </td>
                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-12"
                        >
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eadf] text-[#718060]">
                              <FileText size={20} />
                            </div>

                            <p className="mt-4 text-xs font-semibold text-[#687268]">
                              No contracts yet
                            </p>

                            <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#8a9188]">
                              Upload your first contract to
                              start analyzing risk, findings,
                              and compliance signals.
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                navigate("/upload")
                              }
                              className="
                                mt-4 inline-flex items-center gap-2
                                rounded-full
                                bg-[#e8412c]
                                px-4 py-2
                                text-[11px] font-semibold text-white
                                shadow-[0_7px_18px_rgba(232,65,44,0.16)]
                                transition
                                hover:bg-[#d83b28]
                              "
                            >
                              <Upload size={13} />
                              Upload Contract
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick Actions */}
            <section
              className="
                rounded-[22px]
                border border-[#dddcd3]
                bg-[#fffefa]
                p-5
                shadow-[0_12px_32px_rgba(36,48,39,0.045)]
                sm:p-6
              "
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fbe4df] text-[#e8412c]">
                  <Plus size={18} />
                </div>

                <div>
                  <h2 className="font-['Playfair_Display'] text-[19px] font-semibold text-[#243027]">
                    Quick Actions
                  </h2>

                  <p className="mt-1 text-[11px] text-[#7a8379]">
                    Common workspace actions
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <QuickAction
                  title="Upload Contract"
                  description="Add a new document"
                  icon={<Upload size={18} />}
                  tone="sage"
                  onClick={() => navigate("/upload")}
                />

                <QuickAction
                  title="Run Analysis"
                  description="Review contract risk"
                  icon={<SearchCheck size={18} />}
                  tone="tomato"
                  onClick={() => navigate("/analysis")}
                />

                <QuickAction
                  title="Check Compliance"
                  description="Review obligations"
                  icon={<ShieldCheck size={18} />}
                  tone="sage"
                  onClick={() =>
                    navigate("/compliance")
                  }
                />

                <QuickAction
                  title="View Reports"
                  description="Explore risk findings"
                  icon={<BarChart3 size={18} />}
                  tone="tomato"
                  onClick={() =>
                    navigate("/findings")
                  }
                />
              </div>
            </section>
          </section>

          {/* =========================================================
              WORKSPACE STATUS
          ========================================================== */}
          <section
            className="
              mt-5 flex items-start gap-3
              rounded-[18px]
              border border-[#dce4d7]
              bg-[#eef2e9]
              px-5 py-4
            "
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dce5d4] text-[#718060]">
              <CheckCircle2 size={16} />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#586258]">
                AI-powered contract review is active for this
                workspace.
              </p>

              {data.pending_analysis > 0 ? (
                <p className="mt-1 text-[10px] text-[#a46d2e]">
                  {data.pending_analysis} contract
                  {data.pending_analysis === 1
                    ? ""
                    : "s"} currently being analyzed.
                </p>
              ) : (
                <p className="mt-1 text-[10px] text-[#7a8379]">
                  Your workspace is ready for contract analysis.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;