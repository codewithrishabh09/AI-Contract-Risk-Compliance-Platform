import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LexMindLogo from "../../components/brand/LexMindLogo";
import { useAuth } from "../../context/AuthContext";

const legalImage =
  "https://images.unsplash.com/photo-1649653084130-06638e40ca25?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=82&w=1600";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: normalizedEmail,
        password,
      });

      const destination =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname || "/dashboard";

      navigate(destination, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef] p-0 sm:p-4 lg:p-6">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1500px] overflow-hidden border border-[#e0dfd5] bg-[#eef1e5] shadow-[0_25px_80px_rgba(36,48,39,0.08)]">
        {/* ─────────────────────────────────────────────
            LEFT VISUAL PANEL
        ───────────────────────────────────────────── */}
        <section className="relative hidden min-h-full w-[52%] overflow-hidden lg:block">
          {/* Base image */}
          <img
            src={legalImage}
            alt="Lady Justice"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Soft legal-tech wash */}
          <div className="absolute inset-0 bg-[#dce7d2]/78 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#eef3e5]/80 via-transparent to-[#8ea47d]/60" />

          {/* Decorative diagonal layers */}
          <div className="absolute -right-32 -top-28 h-[620px] w-[620px] rotate-[28deg] rounded-[40%] border border-white/45 bg-[#f4f5e9]/35" />

          <div className="absolute -right-56 top-20 h-[700px] w-[700px] rotate-[28deg] rounded-[42%] border border-[#9caf88]/35 bg-[#9caf88]/15" />

          <div className="absolute -left-40 bottom-[-170px] h-[470px] w-[950px] rotate-[-10deg] rounded-[50%] bg-[#718060]/35" />

          <div className="absolute -left-40 bottom-[-205px] h-[110px] w-[900px] rotate-[7deg] bg-[#e8412c] shadow-[0_-8px_25px_rgba(232,65,44,0.16)]" />

          {/* Top logo */}
          <div className="absolute left-10 top-9 z-20">
            <div className="rounded-full bg-white/50 p-1.5 backdrop-blur-sm">
              <LexMindLogo />
            </div>
          </div>

          {/* Main copy */}
          <div className="absolute inset-x-12 top-[26%] z-20 max-w-[570px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#718060]/30 bg-white/65 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#526047] backdrop-blur-sm">
              <ShieldCheck size={14} />
              Contract Intelligence
            </div>

            <h1 className="font-['Playfair_Display'] text-[52px] font-medium leading-[1.02] tracking-[-0.045em] text-[#20362a] xl:text-[64px]">
              Understand every
              <br />
              contract{" "}
              <span className="text-[#718060]">
                with
                <br />
                confidence.
              </span>
            </h1>

            <p className="mt-7 max-w-[500px] text-[16px] leading-7 text-[#506052]">
              Review obligations, identify risk, and turn complex legal
              language into clear, actionable intelligence.
            </p>

            <div className="mt-9 flex gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/65 px-5 py-4 backdrop-blur-sm">
                <div className="text-[24px] font-semibold tracking-[-0.03em] text-[#243027]">
                  AI
                </div>
                <p className="mt-1 text-[11px] text-[#687268]">
                  Intelligent contract analysis
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/65 px-5 py-4 backdrop-blur-sm">
                <div className="text-[24px] font-semibold tracking-[-0.03em] text-[#243027]">
                  360°
                </div>
                <p className="mt-1 text-[11px] text-[#687268]">
                  Risk & compliance visibility
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-9 left-10 z-20 text-xs font-medium text-[#60735a]">
            Secure workspace for modern contract teams.
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            RIGHT AUTH PANEL
        ───────────────────────────────────────────── */}
        <section className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#f8f7f1] px-5 py-10 sm:px-8 lg:min-h-full lg:px-12">
          {/* Mobile background decoration */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#dfe8d7]" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#e5eadf]" />

          <div className="relative z-10 w-full max-w-[475px]">
            {/* Mobile logo */}
            <div className="mb-8 lg:hidden">
              <LexMindLogo />
            </div>

            <div className="rounded-[26px] border border-[#dddcd3] bg-[#fffefa]/95 p-6 shadow-[0_25px_70px_rgba(36,48,39,0.10)] backdrop-blur-sm sm:p-9">
              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f7a53]">
                    Welcome back
                  </p>

                  <div className="h-px flex-1 bg-[#dfe1d8]" />
                </div>

                <h2 className="font-['Playfair_Display'] text-[38px] font-medium leading-[1.05] tracking-[-0.04em] text-[#243027]">
                  Sign in to{" "}
                  <span className="text-[#e8412c]">LexMind</span>
                </h2>

                <p className="mt-4 max-w-[390px] text-sm leading-6 text-[#687268]">
                  Access your contracts, analysis, findings, and compliance
                  workspace.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-2xl border border-[#e8412c]/20 bg-[#e8412c]/8 px-4 py-3 text-sm leading-5 text-[#b93223]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[13px] font-semibold text-[#354136]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#879186]"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="h-[50px] w-full rounded-xl border border-[#d9dad1] bg-[#faf9f4] pl-11 pr-4 text-sm text-[#243027] outline-none transition-all placeholder:text-[#a0a59e] hover:border-[#bfc7b9] focus:border-[#8fa37f] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[13px] font-semibold text-[#354136]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#879186]"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="h-[50px] w-full rounded-xl border border-[#d9dad1] bg-[#faf9f4] pl-11 pr-12 text-sm text-[#243027] outline-none transition-all placeholder:text-[#a0a59e] hover:border-[#bfc7b9] focus:border-[#8fa37f] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/10"
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-2 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#294334] px-5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(41,67,52,0.16)] transition-all hover:bg-[#20372b] hover:shadow-[0_16px_30px_rgba(41,67,52,0.20)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}

                  {!isSubmitting && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#e5e3da]" />
                <span className="text-[11px] font-medium text-[#9a9f98]">
                  OR
                </span>
                <div className="h-px flex-1 bg-[#e5e3da]" />
              </div>

              <p className="text-center text-sm text-[#687268]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#e8412c] transition hover:text-[#c83224]"
                >
                  Create account
                </Link>
              </p>
            </div>

            {/* Security note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#8a9188]">
              <ShieldCheck size={14} />
              Your workspace is protected by secure authentication.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;