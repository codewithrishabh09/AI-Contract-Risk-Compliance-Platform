import {
  ArrowRight,
  Check,
  ChevronRight,
  FileCheck2,
  FileSearch,
  LockKeyhole,
  Menu,
  Scale,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import LexMindLogo from "../../components/brand/LexMindLogo";

function AnalysisPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="absolute -inset-6 rounded-[40px] bg-[#9caf88]/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[28px] border border-[#d9ddd2] bg-[#fffefa] shadow-[0_30px_90px_rgba(36,48,39,0.14)]">
        <div className="flex items-center justify-between border-b border-[#e5e3da] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526047]">
              <FileSearch size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#243027]">
                Vendor Agreement
              </p>
              <p className="text-[11px] text-[#858d84]">
                Contract analysis complete
              </p>
            </div>
          </div>

          <span className="rounded-full bg-[#e5eadf] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#526047]">
            Analysed
          </span>
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_190px]">
          <div className="space-y-5 p-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#858d84]">
                  Overall risk
                </span>

                <span className="text-sm font-bold text-[#e8412c]">
                  Medium
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#ebece6]">
                <div className="lexmind-risk-bar h-full w-[57%] rounded-full bg-[#e8412c]" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5e3da] bg-[#faf9f5] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fce6e2] text-[#e8412c]">
                  <ShieldCheck size={14} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#354136]">
                    Payment obligation
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#7a8279]">
                    Payment is due within 15 days after receipt of invoice.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5e3da] bg-[#faf9f5] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e5eadf] text-[#718060]">
                  <FileCheck2 size={14} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#354136]">
                    Renewal clause
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#7a8279]">
                    Agreement automatically renews for successive 12-month
                    periods.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e3da] bg-[#f4f5ef] p-5 md:border-l md:border-t-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#858d84]">
              Findings
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5e685e]">High</span>
                  <span className="text-xs font-semibold text-[#e8412c]">
                    02
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5e685e]">Medium</span>
                  <span className="text-xs font-semibold text-[#718060]">
                    05
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5e685e]">Low</span>
                  <span className="text-xs font-semibold text-[#718060]">
                    08
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#243027] p-4 text-white">
              <Sparkles size={15} className="text-[#9caf88]" />

              <p className="mt-3 text-xs font-semibold">
                AI insight
              </p>

              <p className="mt-1 text-[10px] leading-5 text-white/60">
                3 clauses require review before approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const intelligenceItems = [
  {
    icon: FileSearch,
    title: "Contract Analysis",
    description:
      "Turn lengthy agreements into structured, understandable intelligence.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Detection",
    description:
      "Surface risky clauses, obligations, and potential exposure before they become problems.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Ask questions about contracts and get context-aware answers from your documents.",
  },
];

const securityItems = [
  "Role-based access control",
  "Audit-ready activity history",
  "Organization-level data isolation",
  "Secure authenticated workspace",
];

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f5ef] text-[#243027]">
      {/* Navigation */}
      <header className="relative z-50 border-b border-[#dddcd3]/80 bg-[#f7f5ef]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <LexMindLogo />

          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#intelligence"
              className="text-sm font-medium text-[#687268] transition hover:text-[#243027]"
            >
              Intelligence
            </a>

            <a
              href="#workflow"
              className="text-sm font-medium text-[#687268] transition hover:text-[#243027]"
            >
              Workflow
            </a>

            <a
              href="#security"
              className="text-sm font-medium text-[#687268] transition hover:text-[#243027]"
            >
              Security
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#526047] transition hover:bg-[#e5eadf]"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-[#243027] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(36,48,39,0.12)] transition hover:bg-[#354638]"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="rounded-xl border border-[#dddcd3] bg-white p-2.5 text-[#526047] lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#dddcd3] bg-[#fffefa] px-5 py-5 lg:hidden">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-2">
              <a
                href="#intelligence"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#526047] hover:bg-[#e5eadf]"
              >
                Intelligence
              </a>

              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#526047] hover:bg-[#e5eadf]"
              >
                Workflow
              </a>

              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#526047] hover:bg-[#e5eadf]"
              >
                Security
              </a>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="rounded-xl border border-[#dddcd3] px-4 py-3 text-center text-sm font-semibold text-[#526047]"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-[#243027] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 lexmind-soft-grid opacity-70" />

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#9caf88]/20 blur-3xl" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-[#e8412c]/8 blur-3xl" />

        <div className="relative mx-auto grid min-h-[700px] max-w-[1240px] items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#9caf88]/40 bg-[#e5eadf] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#526047]">
              <Scale size={14} />
              AI Contract Intelligence
            </div>

            <h1 className="max-w-[650px] font-['Playfair_Display'] text-5xl font-medium leading-[1.02] tracking-[-0.045em] text-[#243027] sm:text-6xl lg:text-[72px]">
              Make every contract
              <span className="block text-[#718060]">
                easier to understand.
              </span>
            </h1>

            <p className="mt-7 max-w-[560px] text-base leading-7 text-[#687268] sm:text-lg">
              LexMind helps teams analyse contracts, identify risk, understand
              obligations, and make confident decisions without getting lost
              in legal complexity.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#243027] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(36,48,39,0.15)] transition hover:bg-[#354638]"
              >
                Start analysing
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#d7d9d0] bg-[#fffefa] px-6 text-sm font-semibold text-[#526047] transition hover:border-[#9caf88] hover:bg-[#e5eadf]"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[#7b847a]">
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#718060]" />
                Risk-focused analysis
              </span>

              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#718060]" />
                Secure workspace
              </span>

              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#718060]" />
                Audit visibility
              </span>
            </div>
          </div>

          <div className="lexmind-float">
            <AnalysisPreview />
          </div>
        </div>
      </section>

      {/* Intelligence */}
      <section
        id="intelligence"
        className="border-y border-[#dddcd3] bg-[#fffefa]"
      >
        <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#718060]">
              One intelligent workspace
            </p>

            <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-medium leading-tight tracking-[-0.035em] text-[#243027] sm:text-5xl">
              From documents to decisions.
            </h2>

            <p className="mt-5 text-base leading-7 text-[#687268]">
              Bring contract review, risk analysis, and compliance visibility
              into one focused workspace.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {intelligenceItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-[24px] border border-[#dddcd3] bg-[#f9f8f3] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#9caf88] hover:shadow-[0_20px_45px_rgba(36,48,39,0.08)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5eadf] text-[#526047] transition group-hover:bg-[#9caf88] group-hover:text-white">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-7 text-lg font-semibold tracking-[-0.02em] text-[#243027]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#687268]">
                    {item.description}
                  </p>

                  <div className="mt-7 flex items-center gap-1 text-xs font-semibold text-[#718060]">
                    Explore capability
                    <ChevronRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="bg-[#e9ede4]">
        <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#718060]">
                A clearer workflow
              </p>

              <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-medium leading-tight tracking-[-0.035em] text-[#243027] sm:text-5xl">
                Less searching.
                <br />
                More understanding.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-[#687268]">
                LexMind gives your team a structured way to move from uploaded
                agreements to actionable contract intelligence.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#526047] transition hover:text-[#e8412c]"
              >
                Build your workspace
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Upload",
                  text: "Bring contracts into one secure workspace.",
                },
                {
                  number: "02",
                  title: "Analyse",
                  text: "Extract clauses, risks, obligations, and insights.",
                },
                {
                  number: "03",
                  title: "Act",
                  text: "Review findings and make better decisions.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="rounded-[22px] border border-[#d4d9ce] bg-[#f7f5ef]/80 p-6"
                >
                  <span className="text-xs font-bold tracking-[0.15em] text-[#9caf88]">
                    {step.number}
                  </span>

                  <h3 className="mt-8 text-base font-semibold text-[#243027]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#687268]">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="bg-[#f7f5ef]">
        <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="relative overflow-hidden rounded-[30px] bg-[#243027] p-8 text-white sm:p-10">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#9caf88]/20 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9caf88]/15 text-[#9caf88]">
                  <LockKeyhole size={20} />
                </div>

                <h3 className="mt-8 max-w-md font-['Playfair_Display'] text-3xl font-medium leading-tight">
                  Designed for sensitive contract intelligence.
                </h3>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
                  Keep access controlled, activity visible, and your contract
                  workspace organized around the teams that need it.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {securityItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/75"
                    >
                      <Check
                        size={14}
                        className="mt-0.5 shrink-0 text-[#9caf88]"
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#718060]">
                Trust & visibility
              </p>

              <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-medium leading-tight tracking-[-0.035em] text-[#243027] sm:text-5xl">
                Know what changed,
                <br />
                who acted, and why.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-[#687268]">
                Contract intelligence is only useful when your team can trust
                the process. LexMind brings analysis, findings, and audit
                visibility together.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Structured findings instead of scattered notes",
                  "Clear risk signals for faster review",
                  "Centralized contract history and activity",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5eadf] text-[#718060]">
                      <Check size={14} strokeWidth={2.5} />
                    </span>

                    <span className="text-sm font-medium text-[#526047]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[#dddcd3] bg-[#e5eadf]">
        <div className="mx-auto max-w-[1000px] px-5 py-24 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#243027] text-[#9caf88]">
            <Scale size={23} />
          </div>

          <h2 className="mx-auto mt-7 max-w-3xl font-['Playfair_Display'] text-4xl font-medium leading-tight tracking-[-0.035em] text-[#243027] sm:text-5xl">
            Make contract review a strategic advantage.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#687268]">
            Build a clearer view of your agreements, risks, and obligations
            with LexMind.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-[#243027] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(36,48,39,0.14)] transition hover:bg-[#354638]"
          >
            Create your workspace
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#dddcd3] bg-[#f7f5ef]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
          <LexMindLogo compact />

          <p className="text-xs text-[#8a9188]">
            © 2026 LexMind. Contract intelligence for modern teams.
          </p>

          <div className="flex items-center gap-5 text-xs font-medium text-[#687268]">
            <Link to="/login" className="hover:text-[#243027]">
              Sign in
            </Link>

            <Link to="/register" className="hover:text-[#243027]">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;