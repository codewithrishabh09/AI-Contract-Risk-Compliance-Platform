import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LexMindLogo from "../../components/brand/LexMindLogo";
import { useAuth } from "../../context/AuthContext";

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
    <main className="min-h-screen bg-[#f7f5ef]">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        {/* Brand panel */}
        <section className="relative hidden w-[46%] overflow-hidden bg-[#dfe6d7] px-12 py-10 lg:flex lg:flex-col">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#9caf88]/35 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/60 blur-3xl" />

          <div className="relative z-10">
            <LexMindLogo />
          </div>

          <div className="relative z-10 my-auto max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#718060]/25 bg-white/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#526047]">
              <ShieldCheck size={14} />
              Contract Intelligence
            </div>

            <h1 className="max-w-lg font-['Playfair_Display'] text-5xl font-medium leading-[1.08] tracking-[-0.035em] text-[#243027] xl:text-6xl">
              Understand every contract
              <span className="text-[#718060]"> with confidence.</span>
            </h1>

            <p className="mt-6 max-w-md text-[16px] leading-7 text-[#5f695f]">
              Review obligations, identify risk, and turn complex legal
              language into clear, actionable intelligence.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#718060]/20 bg-white/55 p-4">
                <div className="text-2xl font-semibold text-[#243027]">
                  AI
                </div>
                <p className="mt-1 text-xs leading-5 text-[#687268]">
                  Intelligent contract analysis
                </p>
              </div>

              <div className="rounded-2xl border border-[#718060]/20 bg-white/55 p-4">
                <div className="text-2xl font-semibold text-[#243027]">
                  360°
                </div>
                <p className="mt-1 text-xs leading-5 text-[#687268]">
                  Risk & compliance visibility
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-[#718060]">
            Secure workspace for modern contract teams.
          </p>
        </section>

        {/* Form panel */}
        <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[470px]">
            <div className="mb-10 lg:hidden">
              <LexMindLogo />
            </div>

            <div className="rounded-[28px] border border-[#dddcd3] bg-[#fffefa] p-6 shadow-[0_24px_70px_rgba(36,48,39,0.08)] sm:p-9">
              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#718060]">
                  Welcome back
                </p>

                <h2 className="font-['Playfair_Display'] text-4xl font-medium tracking-[-0.03em] text-[#243027]">
                  Sign in to LexMind
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#687268]">
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
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#354136]"
                  >
                    Email address
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
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-[#354136]"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9288]"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#243027] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(36,48,39,0.14)] transition hover:bg-[#354638] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#e5e3da]" />
                <span className="text-xs text-[#9a9f98]">OR</span>
                <div className="h-px flex-1 bg-[#e5e3da]" />
              </div>

              <p className="text-center text-sm text-[#687268]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#526047] transition hover:text-[#e8412c]"
                >
                  Create account
                </Link>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8a9188]">
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