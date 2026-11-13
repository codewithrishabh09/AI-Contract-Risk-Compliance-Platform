import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function getInitials(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatRole(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const fullName =
    user.full_name?.trim() || "User";

  const initials = getInitials(fullName);

  return (
    <div className="lexmind-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <section>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-[#7a8279] transition hover:text-[#243027]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </button>

          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
            Account
          </div>

          <h1 className="lexmind-display mt-2 text-4xl leading-tight text-[#243027] sm:text-5xl">
            Profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687268]">
            View your account and organization
            information.
          </p>
        </section>

        {/* Profile hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-[#dddcd3] bg-[#fffefa] shadow-[0_18px_45px_rgba(36,48,39,0.06)]">
          <div className="h-28 bg-gradient-to-r from-[#e5eadf] via-[#f0f2eb] to-[#fffefa]" />

          <div className="relative px-5 pb-7 sm:px-8">
            <div className="-mt-11 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-22 w-22 shrink-0 items-center justify-center rounded-[22px] border-4 border-[#fffefa] bg-[#243027] text-xl font-semibold text-white shadow-[0_12px_30px_rgba(36,48,39,0.18)]">
                  {initials}
                </div>

                <div className="pb-1">
                  <h2 className="text-xl font-semibold tracking-tight text-[#243027]">
                    {fullName}
                  </h2>

                  <p className="mt-1 text-sm text-[#7a8279]">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-[#9caf88]/45 bg-[#e5eadf] px-3.5 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#718060]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#526347]">
                  {formatStatus(user.status)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Information grid */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Personal */}
          <section className="lexmind-card p-5 sm:p-6">
            <div className="flex items-center gap-3 border-b border-[#ebe9e1] pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526347]">
                <UserRound className="h-4.5 w-4.5" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#243027]">
                  Personal Information
                </h2>

                <p className="mt-1 text-[11px] text-[#7a8279]">
                  Your account details
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aa198]">
                  Full Name
                </p>

                <div className="mt-2 flex items-center gap-2.5">
                  <UserRound className="h-3.5 w-3.5 text-[#9aa198]" />

                  <p className="text-sm font-medium text-[#243027]">
                    {fullName}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aa198]">
                  Email Address
                </p>

                <div className="mt-2 flex items-center gap-2.5">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#9aa198]" />

                  <p className="break-all text-sm font-medium text-[#243027]">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Organization */}
          <section className="lexmind-card p-5 sm:p-6">
            <div className="flex items-center gap-3 border-b border-[#ebe9e1] pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526347]">
                <Building2 className="h-4.5 w-4.5" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#243027]">
                  Organization
                </h2>

                <p className="mt-1 text-[11px] text-[#7a8279]">
                  Workspace membership
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aa198]">
                  Role
                </p>

                <div className="mt-2 flex items-center gap-2.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#9aa198]" />

                  <p className="text-sm font-medium text-[#243027]">
                    {formatRole(user.role)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aa198]">
                  Organization ID
                </p>

                <div className="mt-2 flex items-start gap-2.5">
                  <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9aa198]" />

                  <p className="break-all font-mono text-xs leading-5 text-[#687268]">
                    {user.organization_id}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Account security */}
        <section className="rounded-[24px] border border-[#9caf88]/35 bg-[#f1f4ec] p-5 shadow-[0_12px_35px_rgba(36,48,39,0.04)] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526347]">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#243027]">
                Account Security
              </h2>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#687268]">
                Your session is authenticated through
                LexMind secure access controls.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;