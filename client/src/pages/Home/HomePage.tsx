import {
  ArrowRight,
  Bell,
  Check,
  FileCheck2,
  FileSearch,
  LockKeyhole,
  Menu,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import LexMindLogo from "../../components/brand/LexMindLogo";

const heroImage =
  "https://images.unsplash.com/photo-1649653084130-06638e40ca25?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=82&w=1600";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Workflow", href: "#workflow" },
  { label: "Security", href: "#security" },
];

const capabilities = [
  {
    icon: ShieldCheck,
    title: "Enterprise-Grade Security",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
  },
  {
    icon: Scale,
    title: "Built for Legal Professionals",
  },
];

const features = [
  {
    icon: FileSearch,
    title: "AI-Powered Analysis",
    description:
      "Understand complex contracts with structured AI-powered analysis.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Detection",
    description:
      "Identify risky clauses, obligations, and potential exposure early.",
  },
  {
    icon: FileCheck2,
    title: "Compliance Assurance",
    description:
      "Keep important contractual requirements visible and reviewable.",
  },
  {
    icon: Sparkles,
    title: "Actionable Insights",
    description:
      "Turn contract intelligence into clearer, faster decisions.",
  },
];

const securityItems = [
  "Role-based access control",
  "Audit-ready activity history",
  "Organization-level data isolation",
  "Secure authenticated workspace",
];

function DashboardPreview() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#dddcd3] bg-[#fffefa] shadow-[0_30px_70px_rgba(36,48,39,0.10)]">
      <div className="flex items-center justify-between border-b border-[#e5e3da] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[#243027]">
            Contract Intelligence
          </p>

          <p className="mt-1 text-[10px] text-[#858d84]">
            Overview of your contract portfolio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden h-8 w-24 rounded-lg border border-[#dddcd3] bg-[#f7f5ef] sm:block" />

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5eadf] text-[#526047]">
            <Bell size={14} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-3">
        {[
          ["Total Contracts", "128"],
          ["Under Review", "24"],
          ["High Risk", "08"],
        ].map(([label, value], index) => (
          <div
            key={label}
            className="rounded-2xl border border-[#e5e3da] bg-[#faf9f5] p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#858d84]">
                {label}
              </span>

              <span
                className={`h-2 w-2 rounded-full ${
                  index === 2 ? "bg-[#e8412c]" : "bg-[#9caf88]"
                }`}
              />
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#243027]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 px-5 pb-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-[#e5e3da] bg-[#faf9f5] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#243027]">
                Risk Overview
              </p>

              <p className="mt-1 text-[9px] text-[#858d84]">
                Current contract portfolio
              </p>
            </div>

            <span className="text-xs font-semibold text-[#718060]">
              92% compliant
            </span>
          </div>

          <div className="mt-7 flex h-[120px] items-end gap-3">
            {[38, 54, 48, 67, 58, 78, 71, 90, 83, 96].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex flex-1 items-end rounded-t-lg bg-[#9caf88]/40"
                  style={{ height: `${height}%` }}
                >
                  <div
                    className="w-full rounded-t-lg bg-[#718060]"
                    style={{
                      height: `${Math.max(28, height - 18)}%`,
                    }}
                  />
                </div>
              ),
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#243027] bg-[#243027] p-5 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9caf88]/15 text-[#9caf88]">
            <Sparkles size={16} />
          </div>

          <p className="mt-5 text-xs font-semibold">
            AI Insight
          </p>

          <p className="mt-2 text-[10px] leading-5 text-white/60">
            3 clauses require review before approval.
          </p>

          <div className="mt-5 flex items-center gap-2 text-[9px] font-semibold text-[#9caf88]">
            View findings
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f5ef] text-[#243027]">
      {/* =========================================================
          NAVIGATION
      ========================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#dddcd3]/80 bg-[#f7f5ef]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[78px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Brand */}
          <Link
            to="/"
            className="shrink-0 transition-opacity hover:opacity-80"
          >
            <LexMindLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border border-[#dddcd3] bg-[#fffefa]/80 p-1 shadow-[0_4px_18px_rgba(36,48,39,0.04)] lg:flex">
            {navItems.map((item) => {
              const isHome = item.label === "Home";

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-[0.01em] transition-all duration-200 ${
                    isHome
                      ? "bg-[#e5eadf] text-[#526047] shadow-sm"
                      : "text-[#687268] hover:bg-[#f1f3ed] hover:text-[#243027]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-full px-4 py-2.5 text-[11px] font-semibold text-[#526047] transition hover:bg-[#e5eadf]"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#e8412c] px-5 py-2.5 text-[11px] font-semibold text-white shadow-[0_8px_22px_rgba(232,65,44,0.16)] transition hover:bg-[#d83a27]"
            >
              Get Started
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dddcd3] bg-[#fffefa] text-[#526047] transition hover:bg-[#e5eadf] lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-[#dddcd3] bg-[#fffefa] px-5 py-5 shadow-[0_15px_30px_rgba(36,48,39,0.05)] lg:hidden">
            <div className="mx-auto max-w-[1320px]">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isHome = item.label === "Home";

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isHome
                          ? "bg-[#e5eadf] text-[#526047]"
                          : "text-[#526047] hover:bg-[#f4f5ef]"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#e5e3da] pt-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-[#dddcd3] bg-[#fffefa] px-4 py-3 text-center text-sm font-semibold text-[#526047] transition hover:bg-[#f4f5ef]"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-[#e8412c] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#d83a27]"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(156,175,136,0.18),transparent_32%)]" />

        <div className="relative mx-auto grid min-h-[680px] max-w-[1400px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
          {/* Hero Content */}
          <div className="relative z-20">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#9caf88]/35 bg-[#e5eadf] px-4 py-2 text-[11px] font-semibold tracking-[0.04em] text-[#526047]">
              <Sparkles size={14} />
              Next-Gen Legal Tech Platform
            </div>

            <h1 className="max-w-[720px] font-['Playfair_Display'] text-5xl font-medium leading-[0.98] tracking-[-0.045em] text-[#243027] sm:text-6xl lg:text-[70px]">
              Smarter Contract Analysis.
              <span className="mt-2 block text-[#e8412c]">
                Safer Business Decisions.
              </span>
            </h1>

            <p className="mt-7 max-w-[600px] text-base leading-7 text-[#687268] sm:text-lg">
              Leverage the power of AI to analyze contracts, identify risks,
              understand obligations, and ensure compliance with confidence.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#e8412c] px-7 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(232,65,44,0.20)] transition hover:bg-[#d83a27]"
              >
                Get Started

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#9caf88] bg-[#fffefa] px-7 text-sm font-semibold text-[#526047] transition hover:bg-[#e5eadf]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9caf88] text-white">
                  <ArrowRight size={11} />
                </span>

                Watch Demo
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-4">
              {capabilities.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`flex items-center gap-3 ${
                      index !== 0
                        ? "border-l border-[#dddcd3] pl-6"
                        : ""
                    }`}
                  >
                    <Icon
                      size={23}
                      strokeWidth={1.7}
                      className="text-[#718060]"
                    />

                    <span className="max-w-[130px] text-[11px] font-medium leading-4 text-[#526047]">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative min-h-[500px] lg:min-h-[600px]">
            <div className="absolute right-[-18%] top-[-12%] h-[560px] w-[560px] rounded-full bg-[#e5eadf] opacity-70 blur-[1px]" />

            <div className="absolute inset-y-[-8%] right-[-14%] w-[105%] overflow-hidden rounded-l-[48%] rounded-r-none lg:right-[-12%]">
              <img
                src={heroImage}
                alt="Lady Justice representing legal intelligence"
                className="h-full w-full object-cover object-center opacity-90"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#f7f5ef] via-[#f7f5ef]/10 to-transparent" />

              <div className="absolute inset-0 bg-[#9caf88]/10 mix-blend-multiply" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute right-2 top-8 h-12 w-12 rounded-xl bg-[#e8412c]/85 shadow-lg sm:right-8" />

            <div className="absolute right-14 top-20 h-8 w-8 rounded-lg bg-[#e5eadf] shadow-lg sm:right-20" />
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUSTED STRIP
      ========================================================== */}
      <section className="border-y border-[#dddcd3] bg-[#fffefa]">
        <div className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8">
          <div className="mb-6 flex items-center gap-5">
            <div className="h-px flex-1 bg-[#dddcd3]" />

            <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.28em] text-[#687268]">
              Trusted by modern legal teams
            </p>

            <div className="h-px flex-1 bg-[#dddcd3]" />
          </div>

          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-3 lg:grid-cols-6">
            {[
              "Microsoft",
              "amazon",
              "Google",
              "Meta",
              "Deloitte.",
              "LegalOps",
            ].map((name) => (
              <div
                key={name}
                className="text-lg font-semibold tracking-[-0.04em] text-[#718060] opacity-80"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY LEXMIND
      ========================================================== */}
      <section id="intelligence" className="bg-[#f7f5ef]">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-[#9caf88]/35 bg-[#e5eadf] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#526047]">
                Why choose LexMind
              </div>

              <h2 className="mt-5 max-w-[500px] font-['Playfair_Display'] text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-[#243027] sm:text-5xl">
                Built for Modern Legal Teams
              </h2>

              <p className="mt-5 max-w-[460px] text-sm leading-6 text-[#687268]">
                From complex language to clear decisions — LexMind helps you
                stay ahead in a complex legal landscape.
              </p>

              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#e8412c] px-6 py-3 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(232,65,44,0.15)] transition hover:bg-[#d83a27]"
              >
                Explore Features
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-[22px] border border-[#dddcd3] bg-[#fffefa] p-6 transition hover:-translate-y-0.5 hover:border-[#9caf88] hover:shadow-[0_16px_40px_rgba(36,48,39,0.07)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e5eadf] text-[#718060]">
                        <Icon size={20} strokeWidth={1.8} />
                      </div>

                      <div>
                        <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#243027]">
                          {feature.title}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-[#687268]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT WORKFLOW
      ========================================================== */}
      <section id="workflow" className="bg-[#fffefa]">
        <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#718060]">
              One intelligent workspace
            </p>

            <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-medium leading-tight tracking-[-0.04em] text-[#243027] sm:text-5xl">
              See your contracts clearly.
            </h2>

            <p className="mt-5 text-sm leading-6 text-[#687268] sm:text-base">
              A focused workspace for contracts, risk findings, compliance,
              analysis, and audit visibility.
            </p>
          </div>

          <div className="mt-14">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* =========================================================
          SECURITY
      ========================================================== */}
      <section id="security" className="bg-[#e9ede4]">
        <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="relative overflow-hidden rounded-[30px] bg-[#243027] p-8 text-white sm:p-10">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#9caf88]/20 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9caf88]/15 text-[#9caf88]">
                  <LockKeyhole size={20} />
                </div>

                <h3 className="mt-8 max-w-md font-['Playfair_Display'] text-3xl font-medium leading-tight">
                  Secure by design.
                  <br />
                  Visible by default.
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
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#718060]">
                Trust & visibility
              </p>

              <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-medium leading-tight tracking-[-0.04em] text-[#243027] sm:text-5xl">
                Secure.
                <br />
                Compliant.
                <br />
                Intelligent.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-6 text-[#687268] sm:text-base">
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
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f7f5ef] text-[#718060]">
                      <Check size={14} strokeWidth={2.5} />
                    </span>

                    <span className="text-sm font-medium text-[#526047]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e8412c] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#d83a27]"
              >
                Try LexMind Today
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="bg-[#f7f5ef]">
        <div className="mx-auto max-w-[1000px] px-5 py-24 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#243027] text-[#9caf88]">
            <Scale size={23} />
          </div>

          <h2 className="mx-auto mt-7 max-w-3xl font-['Playfair_Display'] text-4xl font-medium leading-tight tracking-[-0.04em] text-[#243027] sm:text-5xl">
            Secure. Compliant. Intelligent.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#687268] sm:text-base">
            Make contract review a strategic advantage with a clearer view of
            your agreements, risks, and obligations.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#e8412c] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(232,65,44,0.16)] transition hover:bg-[#d83a27]"
          >
            Try LexMind Today
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="border-t border-[#dddcd3] bg-[#f7f5ef]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <LexMindLogo compact />

          <p className="text-xs text-[#8a9188]">
            © 2026 LexMind. Contract intelligence for modern teams.
          </p>

          <div className="flex items-center gap-5 text-xs font-medium text-[#687268]">
            <Link
              to="/login"
              className="transition hover:text-[#e8412c]"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="transition hover:text-[#e8412c]"
            >
              Get started
            </Link>

            <Link
              to="/settings"
              className="transition hover:text-[#e8412c]"
              aria-label="Settings"
            >
              <Settings size={14} />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;