import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Scale,
  UserRound,
} from "lucide-react";
import {
  useState,
} from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { ApiError } from "../../lib/api/api";
import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [organizationId, setOrganizationId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const normalizedName =
      fullName.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedOrganizationId =
      organizationId.trim();

    if (!normalizedName) {
      setError(
        "Please enter your full name.",
      );
      return;
    }

    if (!normalizedEmail) {
      setError(
        "Please enter your work email.",
      );
      return;
    }

    if (!normalizedOrganizationId) {
      setError(
        "Please enter your organization ID.",
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    if (!acceptedTerms) {
      setError(
        "Please accept the workspace terms to continue.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const user =
        await register({
          full_name:
            normalizedName,
          email: normalizedEmail,
          organization_id:
            normalizedOrganizationId,
          password,
        });

      /*
       * If backend returns a JWT during registration,
       * AuthProvider automatically creates the session.
       */
      if (user) {
        navigate(
          "/dashboard",
          { replace: true },
        );
        return;
      }

      /*
       * If backend registration succeeds without
       * returning a token, send the user to login.
       */
      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          email: normalizedEmail,
        },
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          "Unable to create your workspace. Please check your connection and try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Form */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-[430px]">
            <Link
              to="/"
              className="mb-9 inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-white"
            >
              ← Back to LexMind
            </Link>

            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10">
                <Scale
                  size={20}
                  strokeWidth={1.8}
                  className="text-violet-300"
                />
              </div>

              <div>
                <div className="text-[16px] font-semibold text-white">
                  LexMind
                </div>

                <div className="text-[8px] uppercase tracking-[0.18em] text-slate-600">
                  Contract Intelligence
                </div>
              </div>
            </div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300">
              Create your workspace
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Start with a smarter review workflow.
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create your organization workspace and start turning contracts into decisions.
            </p>

            {error && (
              <div className="mt-6 rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-xs leading-5 text-rose-300">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-[11px] font-medium text-slate-400"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(
                        event.target.value,
                      )
                    }
                    placeholder="Rishabh Dwivedi"
                    autoComplete="name"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-lg border border-white/[0.10] bg-[#080d18] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-medium text-slate-400"
                >
                  Work email
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value,
                      )
                    }
                    placeholder="you@company.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-lg border border-white/[0.10] bg-[#080d18] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="organizationId"
                  className="mb-2 block text-[11px] font-medium text-slate-400"
                >
                  Organization ID
                </label>

                <input
                  id="organizationId"
                  type="text"
                  value={organizationId}
                  onChange={(event) =>
                    setOrganizationId(
                      event.target.value,
                    )
                  }
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  autoComplete="off"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-lg border border-white/[0.10] bg-[#080d18] px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[11px] font-medium text-slate-400"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value,
                      )
                    }
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-lg border border-white/[0.10] bg-[#080d18] pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-slate-600">
                  Use at least 8 characters.
                </p>
              </div>

              <label className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(
                      event.target.checked,
                    )
                  }
                  disabled={isSubmitting}
                  className="mt-0.5 h-4 w-4 accent-violet-500"
                />

                <span className="text-[10px] leading-5 text-slate-600">
                  I agree to the workspace terms
                  and understand that contract
                  data is processed within my
                  organization&apos;s workspace.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-violet-500 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                    Creating workspace...
                  </>
                ) : (
                  <>
                    Create workspace
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-violet-300 transition hover:text-violet-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        {/* Brand panel */}
        <section className="relative hidden overflow-hidden border-l border-white/[0.07] bg-[#03050b] lg:flex lg:items-center lg:px-16">
          <div className="absolute right-[-100px] top-[-100px] h-[460px] w-[460px] rounded-full bg-violet-600/[0.07] blur-[130px]" />

          <div className="relative max-w-[560px]">
            <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-500/[0.08]">
              <Scale
                size={20}
                strokeWidth={1.8}
                className="text-violet-300"
              />
            </div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300">
              Built for high-stakes decisions
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white xl:text-5xl">
              One workspace for contracts, risk and compliance.
            </h2>

            <p className="mt-6 max-w-[500px] text-sm leading-7 text-slate-500">
              Give legal and compliance teams the intelligence they need without losing control over the underlying evidence.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Analyze contracts with contextual AI",
                "Track risks across contract versions",
                "Maintain an auditable review history",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-xs text-slate-400"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-400">
                    ✓
                  </span>

                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
