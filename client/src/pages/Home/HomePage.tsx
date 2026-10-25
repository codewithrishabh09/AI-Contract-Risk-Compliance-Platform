import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleAlert,
  Lock,
  Search,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";

import LexMindLogo from "../../components/brand/LexMindLogo";

const intelligenceItems = [
  {
    number: "01",
    title: "Read the important parts",
    description:
      "Long agreements are reduced to the clauses, obligations and terms your team actually needs to review.",
  },
  {
    number: "02",
    title: "Find exposure early",
    description:
      "Surface payment, liability, termination, confidentiality and compliance risks before they become expensive problems.",
  },
  {
    number: "03",
    title: "Keep the evidence",
    description:
      "Every answer stays connected to the underlying contract, page and clause so decisions remain traceable.",
  },
];

const securityItems = [
  "Organization-level tenant isolation",
  "Role-based permissions",
  "Audit-ready activity history",
  "Request-level tracing",
];

function AnalysisPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[650px]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-20 rounded-full bg-violet-600/[0.045] blur-[100px]" />

      {/* Animated wave */}
      <div className="pointer-events-none absolute -bottom-24 left-[-15%] h-52 w-[130%] overflow-hidden opacity-80">
        <div className="lexmind-wave lexmind-wave-one" />
        <div className="lexmind-wave lexmind-wave-two" />
        <div className="lexmind-wave lexmind-wave-three" />
      </div>

      {/* Main application panel */}
      <div className="lexmind-float relative overflow-hidden rounded-[20px] border border-white/[0.10] bg-[#080c16] shadow-[0_35px_100px_rgba(0,0,0,0.50)]">
        {/* Top bar */}
        <div className="flex h-[52px] items-center justify-between border-b border-white/[0.07] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
              <Scale
                size={14}
                strokeWidth={1.7}
                className="text-violet-300"
              />
            </div>

            <div>
              <p className="text-[10px] font-medium text-slate-300">
                Contract Intelligence
              </p>

              <p className="mt-0.5 text-[8px] text-slate-600">
                Enterprise Services Agreement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
              Analysis complete
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          {/* Document header */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Agreement
              </p>

              <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.02em] text-white">
                Enterprise Services Agreement
              </h3>

              <p className="mt-1.5 text-[9px] text-slate-600">
                Version 3 · 24 pages · Updated today
              </p>
            </div>

            <div className="text-right">
              <p className="text-[8px] uppercase tracking-[0.15em] text-slate-600">
                Risk score
              </p>

              <div className="mt-1 flex items-baseline justify-end gap-1.5">
                <span className="text-[31px] font-semibold tracking-[-0.05em] text-white">
                  34
                </span>

                <span className="text-[8px] text-slate-600">
                  / 100
                </span>
              </div>

              <span className="mt-1 inline-flex rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-amber-300">
                Medium risk
              </span>
            </div>
          </div>

          {/* Animated risk progress */}
          <div className="mt-6">
            <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
              <div className="lexmind-risk-bar h-full w-[34%] rounded-full bg-amber-400" />
            </div>
          </div>

          {/* Analysis section */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-slate-300">
                  Material findings
                </p>

                <p className="mt-1 text-[8px] text-slate-600">
                  AI identified areas that need attention
                </p>
              </div>

              <span className="text-[9px] text-slate-600">
                12 findings
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {/* Finding 1 */}
              <div className="group rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition duration-300 hover:border-rose-400/20 hover:bg-rose-400/[0.025]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-400/[0.08]">
                    <CircleAlert
                      size={13}
                      className="text-rose-400"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-semibold text-slate-200">
                        Limitation of liability
                      </span>

                      <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-rose-400">
                        High
                      </span>
                    </div>

                    <p className="mt-1.5 text-[9px] leading-5 text-slate-500">
                      Liability cap may not cover indirect losses described
                      elsewhere in the agreement.
                    </p>

                    <p className="mt-2 text-[8px] text-slate-600">
                      Page 17 · Section 11
                    </p>
                  </div>
                </div>
              </div>

              {/* Finding 2 */}
              <div className="group rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition duration-300 hover:border-amber-400/20 hover:bg-amber-400/[0.025]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-400/[0.08]">
                    <CircleAlert
                      size={13}
                      className="text-amber-400"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-semibold text-slate-200">
                        Automatic renewal
                      </span>

                      <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-amber-400">
                        Medium
                      </span>
                    </div>

                    <p className="mt-1.5 text-[9px] leading-5 text-slate-500">
                      Renewal continues for another 12 months unless notice is
                      provided 60 days before expiry.
                    </p>

                    <p className="mt-2 text-[8px] text-slate-600">
                      Page 21 · Section 14
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI evidence strip */}
          <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10">
                <Search
                  size={11}
                  className="text-violet-300"
                />
              </div>

              <div>
                <p className="text-[9px] font-medium text-slate-400">
                  Evidence-backed analysis
                </p>

                <p className="mt-0.5 text-[8px] text-slate-600">
                  18 relevant clauses indexed
                </p>
              </div>
            </div>

            <span className="flex items-center gap-1 text-[9px] font-medium text-violet-300">
              View report
              <ChevronRight size={11} />
            </span>
          </div>
        </div>

        {/* Scanning line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
          <div className="lexmind-scan-line absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
        </div>
      </div>

      {/* Floating insight badge */}
      <div className="lexmind-insight absolute -bottom-7 left-5 z-10 hidden w-[230px] rounded-xl border border-violet-400/20 bg-[#0a0d18]/95 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:block">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <Scale
              size={13}
              className="text-violet-300"
            />
          </div>

          <div>
            <p className="text-[9px] font-semibold text-slate-200">
              Smarter contract review
            </p>

            <p className="mt-1 text-[8px] leading-4 text-slate-600">
              Evidence first. Risk second. Decisions faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#05070d] text-slate-100">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <LexMindLogo />

          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#intelligence"
              className="text-[12px] text-slate-500 transition-colors hover:text-slate-200"
            >
              Intelligence
            </a>

            <a
              href="#workflow"
              className="text-[12px] text-slate-500 transition-colors hover:text-slate-200"
            >
              Workflow
            </a>

            <a
              href="#security"
              className="text-[12px] text-slate-500 transition-colors hover:text-slate-200"
            >
              Security
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-3.5 py-2 text-[12px] font-medium text-slate-400 transition hover:text-white"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-lg border border-violet-400/25 bg-violet-500 px-4 py-2 text-[11px] font-semibold text-white shadow-[0_8px_25px_rgba(139,92,246,0.12)] transition hover:bg-violet-400"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative px-5 pb-32 pt-36 sm:px-8 lg:pb-40 lg:pt-44">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[680px] overflow-hidden">
            <div className="absolute left-[58%] top-[8%] h-[480px] w-[480px] rounded-full bg-violet-600/[0.045] blur-[140px]" />
          </div>

          <div className="relative mx-auto grid max-w-[1240px] items-center gap-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
            {/* Copy */}
            <div className="relative z-10">
              <div className="mb-7 flex items-center gap-2">
                <span className="h-px w-7 bg-violet-400/70" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                  AI-powered contract intelligence
                </span>
              </div>

              <h1 className="max-w-[680px] text-[46px] font-semibold leading-[0.97] tracking-[-0.055em] text-white sm:text-[58px] lg:text-[70px]">
                Understand the contract.

                <span className="mt-3 block font-serif font-normal italic text-slate-400">
                  Before you sign it.
                </span>
              </h1>

              <p className="mt-7 max-w-[570px] text-[15px] leading-7 text-slate-500 sm:text-[16px]">
                LexMind turns long agreements into clear risk intelligence —
                identifying important clauses, surfacing exposure, and giving
                your team evidence they can act on.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-lg border border-violet-400/25 bg-violet-500 px-5 py-3 text-[11px] font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.13)] transition hover:bg-violet-400"
                >
                  Analyze a contract

                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                <a
                  href="#intelligence"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.10] px-5 py-3 text-[11px] font-semibold text-slate-300 transition hover:border-white/[0.18] hover:text-white"
                >
                  See how it works

                  <ChevronRight size={13} />
                </a>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] text-slate-600">
                <span className="flex items-center gap-2">
                  <Check
                    size={12}
                    className="text-emerald-400"
                  />
                  Clause-level analysis
                </span>

                <span className="flex items-center gap-2">
                  <Check
                    size={12}
                    className="text-emerald-400"
                  />
                  Evidence-backed answers
                </span>

                <span className="flex items-center gap-2">
                  <Check
                    size={12}
                    className="text-emerald-400"
                  />
                  Enterprise access controls
                </span>
              </div>
            </div>

            {/* Product visualization */}
            <div className="relative z-10 pt-4 lg:pt-0">
              <AnalysisPreview />
            </div>
          </div>
        </section>

        {/* Intelligence */}
        <section
          id="intelligence"
          className="border-y border-white/[0.07] bg-[#080b12] px-5 py-24 sm:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-[680px]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                What LexMind does
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-[46px]">
                Less time reading.

                <span className="block text-slate-500">
                  More time deciding.
                </span>
              </h2>

              <p className="mt-5 max-w-[610px] text-sm leading-7 text-slate-500">
                A contract should not require your team to search hundreds of
                pages just to answer a few important questions.
              </p>
            </div>

            <div className="mt-16 grid border-t border-white/[0.08] md:grid-cols-3">
              {intelligenceItems.map((item, index) => (
                <div
                  key={item.number}
                  className={`py-8 md:px-8 ${
                    index !== 0
                      ? "border-t border-white/[0.08] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <span className="text-[10px] font-medium tracking-[0.16em] text-violet-300">
                    {item.number}
                  </span>

                  <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.02em] text-slate-100">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[12px] leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section
          id="workflow"
          className="px-5 py-24 sm:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                  A simpler review workflow
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                  From document

                  <span className="block text-slate-500">
                    to decision.
                  </span>
                </h2>

                <p className="mt-5 max-w-[470px] text-sm leading-7 text-slate-500">
                  Upload the agreement. LexMind handles extraction, retrieval
                  and analysis so your team can focus on what the contract
                  actually means.
                </p>
              </div>

              <div className="border-t border-white/[0.08]">
                {[
                  {
                    number: "01",
                    title: "Upload",
                    text: "Bring in a PDF or DOCX agreement and create a versioned contract record.",
                  },
                  {
                    number: "02",
                    title: "Understand",
                    text: "LexMind extracts the document, clauses and searchable evidence.",
                  },
                  {
                    number: "03",
                    title: "Analyze",
                    text: "AI evaluates risk across payment, liability, termination, data and other critical domains.",
                  },
                  {
                    number: "04",
                    title: "Decide",
                    text: "Review findings, inspect evidence and make a decision with the source contract beside you.",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="grid grid-cols-[48px_1fr] gap-5 border-b border-white/[0.08] py-6"
                  >
                    <span className="text-[10px] font-medium tracking-[0.14em] text-violet-300">
                      {item.number}
                    </span>

                    <div>
                      <h3 className="text-[14px] font-semibold text-slate-200">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-[560px] text-[12px] leading-6 text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section
          id="security"
          className="border-y border-white/[0.07] bg-[#080b12] px-5 py-24 sm:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/[0.06]">
                  <Lock
                    size={17}
                    className="text-violet-300"
                  />
                </div>

                <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                  Built for controlled workflows
                </p>

                <h2 className="mt-4 max-w-[560px] text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                  Security should be part of the workflow,

                  <span className="text-slate-500">
                    {" "}
                    not an afterthought.
                  </span>
                </h2>

                <p className="mt-5 max-w-[560px] text-sm leading-7 text-slate-500">
                  LexMind is designed around tenant isolation, controlled
                  access and auditable actions from the beginning.
                </p>
              </div>

              <div className="border-t border-white/[0.08]">
                {securityItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between border-b border-white/[0.08] py-5"
                  >
                    <span className="text-[12px] text-slate-300">
                      {item}
                    </span>

                    <Check
                      size={14}
                      className="text-emerald-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden px-5 py-28 text-center sm:px-8 lg:py-36">
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-[700px] -translate-x-1/2 rounded-full bg-violet-600/[0.035] blur-[100px]" />

          <div className="relative mx-auto max-w-[760px]">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/[0.06]">
              <Scale
                size={16}
                strokeWidth={1.7}
                className="text-violet-300"
              />
            </div>

            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300">
              Start with the next agreement
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-[58px]">
              Know what you are signing.
            </h2>

            <p className="mx-auto mt-5 max-w-[580px] text-sm leading-7 text-slate-500">
              Upload a contract, understand the material risks, and give your
              team evidence they can trust.
            </p>

            <Link
              to="/register"
              className="group mt-8 inline-flex items-center gap-2 rounded-lg border border-violet-400/25 bg-violet-500 px-5 py-3 text-[11px] font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.13)] transition hover:bg-violet-400"
            >
              Create your workspace

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <LexMindLogo />

          <div className="text-[10px] text-slate-600">
            © 2026 LexMind · Enterprise Contract Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;