import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import LexMindLogo from "../../components/brand/LexMindLogo";
import { useAuth } from "../../context/AuthContext";

const legalImage =
  "https://images.unsplash.com/photo-1649653084130-06638e40ca25?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=82&w=1600";

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
    <main className="min-h-screen bg-[#f7f5ef] p-0 sm:p-4 lg:p-6">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1500px] overflow-hidden border border-[#e0dfd5] bg-[#eef1e5] shadow-[0_25px_80px_rgba(36,48,39,0.08)]">
        {/* ─────────────────────────────────────────────
            LEFT BRAND / VISUAL PANEL
        ───────────────────────────────────────────── */}
        <section className="relative hidden min-h-full w-[50%] overflow-hidden lg:block">
          <img
            src={legalImage}
            alt="Lady Justice"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-[#dce7d2]/78 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#eef3e5]/80 via-transparent to-[#8ea47d]/60" />

          {/* Abstract legal-tech shapes */}
          <div className="absolute -left-48 -top-40 h-[650px] w-[650px] rotate-[28deg] rounded-[42%] border border-white/50 bg-white/20" />

          <div className="absolute -right-44 top-[-100px] h-[720px] w-[720px] rotate-[28deg] rounded-[42%] border border-[#9caf88]/30 bg-[#9caf88]/15" />

          <div className="absolute -left-40 bottom-[-170px] h-[450px] w-[950px] rotate-[-10deg] rounded-[50%] bg-[#718060]/35" />

          <div className="absolute -left-40 bottom-[-205px] h-[110px] w-[900px] rotate-[7deg] bg-[#e8412c]" />

          {/* Logo */}
          <div className="absolute left-10 top-9 z-20">
            <div className="rounded-full bg-white/50 p-1.5 backdrop-blur-sm">
              <LexMindLogo />
            </div>
          </div>

          {/* Brand content */}
          <div className="absolute inset-x-12 top-[23%] z-20 max-w-[530px]">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f7a53]">
              Get started
            </p>

            <h1 className="font-['Playfair_Display'] text-[52px] font-medium leading-[1.03] tracking-[-0.045em] text-[#20362a] xl:text-[62px]">
              Create your
              <br />
              <span className="text-[#e8412c]">LexMind</span> workspace.
            </h1>

            <p className="mt-7 max-w-[470px] text-[16px] leading-7 text-[#506052]">
              Start managing contract risk with AI-powered intelligence built
              for modern legal and business teams.
            </p>

            <div className="mt-9 space-y-3.5">
              {[
                "Analyze contracts faster",
                "Detect risks early",
                "Ensure compliance",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-[#465647]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/65 text-[#6f895f]">
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="absolute bottom-9 left-10 z-20 text-xs font-medium text-[#60735a]">
            Intelligent contract risk & compliance.
          </p>
        </section>

        {/* ─────────────────────────────────────────────
            FORM PANEL
        ───────────────────────────────────────────── */}
        <section className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#f8f7f1] px-5 py-8 sm:px-8 lg:min-h-full lg:px-10">
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#e2eadc]" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#edf0e7]" />

          <div className="relative z-10 w-full max-w-[500px]">
            <div className="mb-7 lg:hidden">
              <LexMindLogo />
            </div>

            <div className="rounded-[26px] border border-[#dddcd3] bg-[#fffefa]/95 p-6 shadow-[0_25px_70px_rgba(36,48,39,0.10)] backdrop-blur-sm sm:p-8">
              <div className="mb-7">
                <div className="mb-4 flex items-center gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f7a53]">
                    Get started
                  </p>

                  <div className="h-px flex-1 bg-[#dfe1d8]" />
                </div>

                <h2 className="font-['Playfair_Display'] text-[36px] font-medium leading-[1.05] tracking-[-0.04em] text-[#243027]">
                  Create your{" "}
                  <span className="text-[#e8412c]">LexMind</span> account
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#687268]">
                  Set up your LexMind account and start managing contract risk
                  with clarity.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-[#e8412c]/20 bg-[#e8412c]/8 px-4 py-3 text-sm leading-5 text-[#b93223]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-[13px] font-semibold text-[#354136]"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#879186]"
                    />

                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your full name"
                      className="h-[48px] w-full rounded-xl border border-[#d9dad1] bg-[#faf9f4] pl-11 pr-4 text-sm text-[#243027] outline-none transition-all placeholder:text-[#a0a59e] hover:border-[#bfc7b9] focus:border-[#8fa37f] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[13px] font-semibold text-[#354136]"
                  >
                    Work email
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
                      className="h-[48px] w-full rounded-xl border border-[#d9dad1] bg-[#faf9f4] pl-11 pr-4 text-sm text-[#243027] outline-none transition-all placeholder:text-[#a0a59e] hover:border-[#bfc7b9] focus:border-[#8fa37f] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/10"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label
                    htmlFor="organizationId"
                    className="mb-2 block text-[13px] font-semibold text-[#354136]"
                  >
                    Organization ID
                  </label>

                  <div className="relative">
                    <Building2
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#879186]"
                    />

                    <input
                      id="organizationId"
                      type="text"
                      value={organizationId}
                      onChange={(event) =>
                        setOrganizationId(event.target.value)
                      }
                      placeholder="Your organization ID"
                      className="h-[48px] w-full rounded-xl border border-[#d9dad1] bg-[#faf9f4] pl-11 pr-4 text-sm text-[#243027] outline-none transition-all placeholder:text-[#a0a59e] hover:border-[#bfc7b9] focus:border-[#8fa37f] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/10"
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
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      className="h-[48px] w-full rounded-xl border border-[#d9dad1] bg-[#faf9f4] pl-11 pr-12 text-sm text-[#243027] outline-none transition-all placeholder:text-[#a0a59e] hover:border-[#bfc7b9] focus:border-[#8fa37f] focus:bg-white focus:ring-4 focus:ring-[#9caf88]/10"
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

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e5e3da] bg-[#faf9f5] p-3">
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

                  <span className="text-[11px] leading-[1.55] text-[#687268]">
                    I agree to the LexMind terms of service and understand that
                    contract data will be processed within my organization
                    workspace.
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-1 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#294334] px-5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(41,67,52,0.16)] transition-all hover:bg-[#20372b] hover:shadow-[0_16px_30px_rgba(41,67,52,0.20)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}

                  {!isSubmitting && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#687268]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#e8412c] transition hover:text-[#c83224]"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#8a9188]">
              <ShieldCheck size={14} />
              Secure workspace for modern contract teams.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;