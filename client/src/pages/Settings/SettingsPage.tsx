import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  Fingerprint,
  Globe2,
  KeyRound,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { useSettings } from "../../features/settings/useSettings";

function formatStatus(value: string): string {
  return value
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join(" ");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: string }) {
  const isActive =
    status === "ACTIVE" ||
    status === "Authenticated";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
        "text-xs font-semibold",
        isActive
          ? "bg-[#E5EADF] text-[#516047]"
          : "bg-[#FBE7E3] text-[#B83222]",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-[#718060]" : "bg-[#E8412C]",
        ].join(" ")}
      />

      {formatStatus(status)}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  copyable = false,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-6 border-b border-[#E7E5DD] py-5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F2EC] text-[#718060]">
          <Icon size={18} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A9189]">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-[#243027]">
            {value}
          </p>
        </div>
      </div>

      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-[#DDDCD3] px-3 py-2 text-xs font-semibold text-[#687268] transition hover:border-[#9CAF88] hover:bg-[#F5F6F1] hover:text-[#516047]"
        >
          {copied ? (
            <>
              <CheckCircle2 size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useSettings();

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#F7F5EF]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-medium text-[#687268]">
              <LoaderCircle
                size={20}
                className="animate-spin text-[#718060]"
              />
              Loading workspace settings...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-full bg-[#F7F5EF]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="rounded-[28px] border border-[#E6C9C3] bg-[#FFFEFA] p-8 shadow-[0_12px_40px_rgba(36,48,39,0.05)]">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FBE7E3] text-[#E8412C]">
                <AlertCircle size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#243027]">
                  Unable to load workspace settings
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#687268]">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong while loading your workspace settings."}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-5 rounded-xl bg-[#243027] px-4 py-2.5 text-sm font-semibold text-[#F7F5EF] transition hover:bg-[#344438]"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { organization, security } = data;

  return (
    <div className="min-h-full bg-[#F7F5EF]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#718060]">
              Workspace configuration
            </p>

            <h1 className="font-['Playfair_Display'] text-4xl font-medium tracking-[-0.03em] text-[#243027] md:text-5xl">
              Settings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687268]">
              Manage and review your LexMind workspace configuration
              and security information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDDCD3] bg-[#FFFEFA] px-4 py-2.5 text-sm font-semibold text-[#243027] shadow-sm transition hover:border-[#9CAF88] hover:bg-[#F5F6F1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LoaderCircle
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>

        {/* Workspace overview */}
        <section className="mt-10">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            {/* Workspace card */}
            <div className="rounded-[28px] border border-[#DDDCD3] bg-[#FFFEFA] p-7 shadow-[0_12px_40px_rgba(36,48,39,0.05)]">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E5EADF] text-[#718060]">
                  <Building2 size={28} strokeWidth={1.6} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-['Playfair_Display'] text-2xl font-medium text-[#243027]">
                      {organization.name}
                    </h2>

                    <StatusBadge status={organization.status} />
                  </div>

                  <p className="mt-2 text-sm text-[#687268]">
                    {organization.slug}
                  </p>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-[#687268]">
                    This workspace contains your organization's contracts,
                    analysis results, risk findings, compliance data,
                    and processing activity.
                  </p>
                </div>
              </div>
            </div>

            {/* Security overview */}
            <div className="rounded-[28px] border border-[#243027] bg-[#243027] p-7 text-[#F7F5EF] shadow-[0_12px_40px_rgba(36,48,39,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9CAF88]/15 text-[#B8C8A8]">
                  <ShieldCheck size={19} />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B8C8A8]">
                  Workspace security
                </p>
              </div>

              <p className="mt-6 font-['Playfair_Display'] text-2xl font-medium">
                Protected
              </p>

              <p className="mt-2 text-sm leading-6 text-[#C9CEC8]">
                Your current workspace session is authenticated through
                LexMind's secured authentication layer.
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#B8C8A8]">
                <CheckCircle2 size={15} />
                {security.authentication}
              </div>
            </div>
          </div>
        </section>

        {/* Settings content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Organization */}
          <section className="rounded-[28px] border border-[#DDDCD3] bg-[#FFFEFA] p-7 shadow-[0_12px_40px_rgba(36,48,39,0.05)]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5EADF] text-[#718060]">
                <Building2 size={18} />
              </div>

              <div>
                <h2 className="font-['Playfair_Display'] text-2xl font-medium text-[#243027]">
                  Organization
                </h2>

                <p className="text-xs text-[#8A9189]">
                  Workspace identity and status
                </p>
              </div>
            </div>

            <div className="mt-2">
              <InfoRow
                icon={Building2}
                label="Organization name"
                value={organization.name}
              />

              <InfoRow
                icon={Globe2}
                label="Organization slug"
                value={organization.slug}
              />

              <InfoRow
                icon={Fingerprint}
                label="Organization ID"
                value={organization.id}
                copyable
              />

              <InfoRow
                icon={CheckCircle2}
                label="Organization status"
                value={formatStatus(organization.status)}
              />
            </div>
          </section>

          {/* Security */}
          <section className="rounded-[28px] border border-[#DDDCD3] bg-[#FFFEFA] p-7 shadow-[0_12px_40px_rgba(36,48,39,0.05)]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5EADF] text-[#718060]">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h2 className="font-['Playfair_Display'] text-2xl font-medium text-[#243027]">
                  Security
                </h2>

                <p className="text-xs text-[#8A9189]">
                  Authentication and active session
                </p>
              </div>
            </div>

            <div className="mt-2">
              <InfoRow
                icon={ShieldCheck}
                label="Authentication"
                value={security.authentication}
              />

              <InfoRow
                icon={KeyRound}
                label="Current session"
                value={security.session}
              />

              <InfoRow
                icon={Clock3}
                label="Account created"
                value={formatDate(security.account_created_at)}
              />
            </div>
          </section>

          {/* Workspace identity */}
          <section className="rounded-[28px] border border-[#243027] bg-[#243027] p-7 text-[#F7F5EF] shadow-[0_12px_40px_rgba(36,48,39,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B8C8A8]">
              Workspace identity
            </p>

            <h2 className="mt-4 font-['Playfair_Display'] text-3xl font-medium">
              {organization.name}
            </h2>

            <p className="mt-2 text-sm text-[#C9CEC8]">
              {organization.slug}
            </p>

            <div className="mt-8 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#C9CEC8]">
                  Workspace status
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-[#9CAF88]/15 px-3 py-1.5 text-xs font-semibold text-[#B8C8A8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9CAF88]" />
                  {formatStatus(organization.status)}
                </span>
              </div>
            </div>
          </section>

          {/* Security note */}
          <section className="rounded-[28px] border border-[#DDDCD3] bg-[#F1F2EC] p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5EADF] text-[#718060]">
              <ShieldCheck size={18} />
            </div>

            <h2 className="mt-5 font-['Playfair_Display'] text-2xl font-medium text-[#243027]">
              Secure by design
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#687268]">
              LexMind keeps authentication and workspace access protected
              through its secured API and session layer. Account identity
              details remain available from your Profile page.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#516047]">
              <CheckCircle2 size={15} />
              Authentication verified
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-8 rounded-2xl border border-[#DDDCD3] bg-[#FFFEFA] px-5 py-4 text-xs leading-5 text-[#687268]">
          Workspace settings currently reflect verified organization and
          security information from LexMind. Additional configuration
          controls will be introduced only when their corresponding
          backend capabilities are available.
        </div>
      </div>
    </div>
  );
}