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
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[520px] rounded-full bg-indigo-600/[0.05] blur-3xl" />

      <div className="relative mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-5 inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-slate-200"
          >
            <ArrowLeft size={14} />

            Back to Dashboard
          </button>

          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-400">
              Account
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Profile
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              View your account and organization information.
            </p>
          </div>
        </div>

        {/* Profile hero */}
        <div className="overflow-hidden rounded-2xl border border-[#173052] bg-[#071426]/85">
          <div className="h-24 bg-gradient-to-r from-indigo-600/[0.16] via-blue-500/[0.08] to-transparent" />

          <div className="-mt-10 px-5 pb-6 sm:px-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-[#071426] bg-gradient-to-br from-indigo-500 to-blue-600 text-xl font-bold text-white shadow-xl shadow-black/20">
                  {initials}
                </div>

                <div className="pb-1">
                  <h2 className="text-lg font-semibold text-white">
                    {fullName}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 sm:self-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[10px] font-medium text-emerald-300">
                  {formatStatus(user.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Information grid */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Personal information */}
          <section className="rounded-2xl border border-[#173052] bg-[#071426]/80 p-5">
            <div className="flex items-center gap-3 border-b border-[#173052] pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                <UserRound
                  size={17}
                  className="text-indigo-400"
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-200">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  Your account details
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Full Name
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <UserRound
                    size={14}
                    className="text-slate-600"
                  />

                  <p className="text-sm text-slate-300">
                    {fullName}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Email Address
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <Mail
                    size={14}
                    className="text-slate-600"
                  />

                  <p className="break-all text-sm text-slate-300">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Organization information */}
          <section className="rounded-2xl border border-[#173052] bg-[#071426]/80 p-5">
            <div className="flex items-center gap-3 border-b border-[#173052] pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Building2
                  size={17}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-200">
                  Organization
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  Workspace membership
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Role
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <ShieldCheck
                    size={14}
                    className="text-slate-600"
                  />

                  <p className="text-sm text-slate-300">
                    {formatRole(user.role)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Organization ID
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <Building2
                    size={14}
                    className="text-slate-600"
                  />

                  <p className="break-all font-mono text-xs text-slate-400">
                    {user.organization_id}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Account status */}
        <section className="mt-5 rounded-2xl border border-[#173052] bg-[#071426]/80 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2
                size={17}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-200">
                Account Security
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your session is authenticated through LexMind
                secure access controls.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;