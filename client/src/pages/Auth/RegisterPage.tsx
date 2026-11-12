import {
  Building2,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import LexMindLogo from "../../components/brand/LexMindLogo";
import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOrganizationId = organizationId.trim();

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedOrganizationId ||
      !password
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await register({
        full_name: normalizedName,
        email: normalizedEmail,
        organization_id: normalizedOrganizationId,
        password,
      });

      if (user) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", {
          replace: true,
          state: {
            registered: true,
            email: normalizedEmail,
          },
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to create your account. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        {/* Form panel */}
        <section className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[540px]">
            <div className="mb-8 lg:hidden">
              <LexMindLogo />
            </div>

            <div className="rounded-[28px] border border-[#dddcd3] bg-[#fffefa] p-6 shadow-[0_24px_70px_rgba(36,48,39,0.08)] sm:p-9">
              <div className="mb-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#718060]">
                  Get started
                </p>

                <h1 className="font-['Playfair_Display'] text-4xl font-medium tracking-[-0.03em] text-[#243027]">
                  Create your workspace
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#687268]">
                  Set up your LexMind account and start managing contract risk
                  with clarity.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-2xl border border-[#e8412c]/20 bg-[#e8412c]/8 px-4 py-3 text-sm leading-5 text-[#b93223]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-[#354136]"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9288]"
                    />

                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your full name"
                      className="h-12 w-full rounded-xl border border-[#d9dad1] bg-[#f9f8f3] pl-11 pr-4 text-sm text-[#243027] outline-none transition placeholder:text-[#9ba19a] focus:border-[#9caf88] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/12"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#354136]"
                  >
                    Work email
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9288]"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="h-12 w-full rounded-xl border border-[#d9dad1] bg-[#f9f8f3] pl-11 pr-4 text-sm text-[#243027] outline-none transition placeholder:text-[#9ba19a] focus:border-[#9caf88] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/12"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="organizationId"
                    className="mb-2 block text-sm font-semibold text-[#354136]"
                  >
                    Organization ID
                  </label>

                  <div className="relative">
                    <Building2
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9288]"
                    />

                    <input
                      id="organizationId"
                      type="text"
                      value={organizationId}
                      onChange={(event) =>
                        setOrganizationId(event.target.value)
                      }
                      placeholder="Your organization ID"
                      className="h-12 w-full rounded-xl border border-[#d9dad1] bg-[#f9f8f3] pl-11 pr-4 text-sm text-[#243027] outline-none transition placeholder:text-[#9ba19a] focus:border-[#9caf88] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/12"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-[#354136]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9288]"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      className="h-12 w-full rounded-xl border border-[#d9dad1] bg-[#f9f8f3] pl-11 pr-12 text-sm text-[#243027] outline-none transition placeholder:text-[#9ba19a] focus:border-[#9caf88] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/12"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#7b847a] transition hover:bg-[#e5eadf] hover:text-[#526047]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e5e3da] bg-[#faf9f5] p-3.5">
                  <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(event) =>
                        setAcceptedTerms(event.target.checked)
                      }
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#cfd2c9] bg-white checked:border-[#718060] checked:bg-[#9caf88] focus:outline-none focus:ring-4 focus:ring-[#9caf88]/15"
                    />

                    <Check
                      size={13}
                      strokeWidth={3}
                      className="pointer-events-none absolute hidden text-white peer-checked:block"
                    />
                  </span>

                  <span className="text-xs leading-5 text-[#687268]">
                    I agree to the LexMind terms of service and understand that
                    contract data will be processed within my organization
                    workspace.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#243027] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(36,48,39,0.14)] transition hover:bg-[#354638] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-[#687268]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#526047] transition hover:text-[#e8412c]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Brand panel */}
        <section className="relative hidden w-[44%] overflow-hidden bg-[#dfe6d7] px-12 py-10 lg:flex lg:flex-col">
          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-white/55 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#9caf88]/35 blur-3xl" />

          <div className="relative z-10">
            <LexMindLogo href="" />
          </div>

          <div className="relative z-10 my-auto">
            <div className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#718060]">
              Built for contract teams
            </div>

            <h2 className="max-w-lg font-['Playfair_Display'] text-5xl font-medium leading-[1.08] tracking-[-0.035em] text-[#243027] xl:text-6xl">
              From complex language
              <span className="text-[#718060]"> to clear decisions.</span>
            </h2>

            <div className="mt-10 space-y-4">
              {[
                "AI-powered contract analysis",
                "Structured risk and compliance findings",
                "Centralized audit-ready intelligence",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-[#4f5c4d]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-[#718060]">
                    <Check size={15} strokeWidth={2.5} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-[#718060]">
            LexMind · Intelligent contract risk & compliance.
          </p>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;