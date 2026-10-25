import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const capabilities = [
  {
    icon: ScanSearch,
    title: "AI Contract Analysis",
    description:
      "Understand complex agreements with clause-level analysis and contextual AI reasoning.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Intelligence",
    description:
      "Identify liability, termination, payment, confidentiality and compliance risks.",
  },
  {
    icon: FileSearch,
    title: "Evidence-backed Answers",
    description:
      "Ask questions about contracts and receive answers grounded in the original document.",
  },
];

const trustItems = [
  "Multi-tenant architecture",
  "Role-based access control",
  "Audit-ready activity logs",
  "AI-powered risk detection",
];

function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#020817]">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#020817]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-[0_0_25px_rgba(79,70,229,0.2)]">
              <ShieldCheck size={18} />
            </div>

            <div>
              <div className="text-[17px] font-semibold tracking-tight text-white">
                LexMind
              </div>

              <div className="text-[9px] font-medium tracking-[0.18em] text-slate-600">
                CONTRACT INTELLIGENCE
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#platform"
              className="text-xs text-slate-500 transition hover:text-white"
            >
              Platform
            </a>

            <a
              href="#intelligence"
              className="text-xs text-slate-500 transition hover:text-white"
            >
              Intelligence
            </a>

            <a
              href="#security"
              className="text-xs text-slate-500 transition hover:text-white"
            >
              Security
            </a>

            <a
              href="#workflow"
              className="text-xs text-slate-500 transition hover:text-white"
            >
              Workflow
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-lg px-3.5 py-2 text-xs font-medium text-slate-400 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#071426] transition hover:bg-slate-200"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative px-5 pb-24 pt-36 sm:px-8 lg:pt-44">
          <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/[0.07] blur-[120px]" />

          <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.07] px-3 py-1.5">
                <Sparkles size={13} className="text-indigo-400" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
                  Enterprise Contract Intelligence
                </span>
              </div>

              <h1 className="max-w-[760px] text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-[64px]">
                Understand every contract.
                <span className="block text-slate-500">
                  Before it becomes a risk.
                </span>
              </h1>

              <p className="mt-6 max-w-[620px] text-base leading-7 text-slate-500 sm:text-lg">
                LexMind brings AI-powered contract analysis, risk
                intelligence and compliance workflows into one
                enterprise workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="group flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-indigo-400"
                >
                  Start analyzing
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>

                <a
                  href="#platform"
                  className="flex items-center gap-2 rounded-lg border border-[#203858] bg-[#071426] px-5 py-3 text-xs font-semibold text-slate-300 transition hover:border-[#31527A] hover:text-white"
                >
                  Explore platform
                  <ChevronRight size={14} />
                </a>
              </div>

              <div className="mt-9 grid gap-2 sm:grid-cols-2">
                {trustItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[11px] text-slate-500"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400"
                    />

                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Product preview */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[24px] bg-indigo-500/[0.04] blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-[#1A3456] bg-[#061224] shadow-2xl">
                <div className="flex h-11 items-center justify-between border-b border-[#173052] px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-medium text-slate-500">
                      Contract Intelligence
                    </span>
                  </div>

                  <span className="text-[9px] text-slate-600">
                    LIVE ANALYSIS
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                        Agreement
                      </p>

                      <h3 className="mt-1 text-sm font-semibold text-slate-200">
                        Enterprise Services Agreement
                      </h3>
                    </div>

                    <span className="rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-2.5 py-1 text-[9px] font-medium text-amber-400">
                      MEDIUM RISK
                    </span>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#173052] bg-[#08172B] p-4">
                      <p className="text-[10px] text-slate-600">
                        Risk Score
                      </p>

                      <div className="mt-2 text-3xl font-semibold text-white">
                        34
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full w-[34%] rounded-full bg-amber-400" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#173052] bg-[#08172B] p-4">
                      <p className="text-[10px] text-slate-600">
                        Findings
                      </p>

                      <div className="mt-2 text-3xl font-semibold text-white">
                        12
                      </div>

                      <p className="mt-3 text-[10px] text-rose-400">
                        2 critical issues
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-[#173052] bg-[#08172B] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-400">
                        AI Review
                      </span>

                      <span className="text-[9px] text-emerald-400">
                        Completed
                      </span>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      {[72, 48, 84].map((width) => (
                        <div
                          key={width}
                          className="h-1.5 overflow-hidden rounded-full bg-slate-800"
                        >
                          <div
                            className="h-full rounded-full bg-indigo-500/70"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform */}
        <section
          id="platform"
          className="border-y border-[#102744] bg-[#030D1C] px-5 py-24 sm:px-8"
        >
          <div className="mx-auto max-w-[1280px]">
            <div className="max-w-[650px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                One workspace
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                From document upload to informed decision.
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                LexMind combines document intelligence, retrieval,
                risk analysis and compliance workflows into a single
                system built for legal teams.
              </p>
            </div>

            <div
              id="intelligence"
              className="mt-12 grid gap-4 md:grid-cols-3"
            >
              {capabilities.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-xl border border-[#173052] bg-[#071426]/70 p-6 transition hover:border-[#2A4B75]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Icon size={19} />
                    </div>

                    <h3 className="mt-5 text-sm font-semibold text-slate-200">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security */}
        <section
          id="security"
          className="px-5 py-24 sm:px-8"
        >
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                  Enterprise by design
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Security and accountability built into the workflow.
                </h2>

                <p className="mt-4 max-w-[560px] text-sm leading-6 text-slate-500">
                  Every action can be tied back to an organization,
                  user, contract and request. LexMind is designed for
                  controlled access and auditable AI workflows.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Tenant isolation",
                  "RBAC permissions",
                  "Audit trails",
                  "Request tracing",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-[#173052] bg-[#071426] p-4"
                  >
                    <LockKeyhole
                      size={16}
                      className="text-indigo-400"
                    />

                    <span className="text-xs font-medium text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="workflow"
          className="border-t border-[#102744] px-5 py-24 sm:px-8"
        >
          <div className="mx-auto max-w-[850px] text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
              Start with your next contract
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Turn contracts into decisions.
            </h2>

            <p className="mx-auto mt-4 max-w-[600px] text-sm leading-6 text-slate-500">
              Upload an agreement, let LexMind analyze the risk, and
              give your team the evidence they need to act.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-semibold text-[#071426] transition hover:bg-slate-200"
            >
              Create your workspace
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#102744] px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-3 text-[10px] text-slate-600 sm:flex-row">
          <span>© 2026 LexMind. Contract Intelligence Platform.</span>
          <span>Built for modern legal and compliance teams.</span>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;