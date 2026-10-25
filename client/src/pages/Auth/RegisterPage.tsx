import {
  ArrowLeft,
  Eye,
  EyeOff,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#020817]">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1fr]">
        {/* Form */}
        <div className="order-2 flex items-center justify-center px-5 py-10 sm:px-8 lg:order-1">
          <div className="w-full max-w-[440px]">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to LexMind
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex items-center gap-3 lg:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
                  <Scale size={18} />
                </div>

                <span className="text-lg font-semibold text-white">
                  LexMind
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Create your workspace
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Start building a smarter contract review workflow.
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Full name
                </label>

                <input
                  type="text"
                  placeholder="Rishabh Dwivedi"
                  className="h-11 w-full rounded-lg border border-[#203858] bg-[#071426] px-3.5 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Work email
                </label>

                <input
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-lg border border-[#203858] bg-[#071426] px-3.5 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Organization
                </label>

                <input
                  type="text"
                  placeholder="Acme Corporation"
                  className="h-11 w-full rounded-lg border border-[#203858] bg-[#071426] px-3.5 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    className="h-11 w-full rounded-lg border border-[#203858] bg-[#071426] px-3.5 pr-11 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 pt-1 text-[11px] leading-5 text-slate-600">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-[#29415F] bg-[#071426]"
                />

                <span>
                  I agree to the workspace terms and understand that
                  contract data is processed within my organization&apos;s
                  workspace.
                </span>
              </label>

              <button
                type="submit"
                className="mt-2 h-11 w-full rounded-lg bg-indigo-500 text-xs font-semibold text-white transition hover:bg-indigo-400"
              >
                Create workspace
              </button>
            </form>

            <p className="mt-7 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Brand panel */}
        <div className="relative order-1 hidden overflow-hidden border-l border-[#173052] bg-[#030D1C] lg:order-2 lg:flex lg:flex-col lg:justify-center">
          <div className="pointer-events-none absolute right-[-100px] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-blue-600/[0.06] blur-[130px]" />

          <div className="relative max-w-[560px] px-12">
            <Link
              to="/"
              className="mb-16 inline-flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600">
                <Scale size={18} />
              </div>

              <span className="text-lg font-semibold text-white">
                LexMind
              </span>
            </Link>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400">
              Built for high-stakes decisions
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white">
              One workspace for contracts, risk and compliance.
            </h2>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Give legal and compliance teams the intelligence they
              need without losing control over the underlying evidence.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Analyze contracts with contextual AI",
                "Track risks across contract versions",
                "Maintain an auditable review history",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <ShieldCheck
                    size={16}
                    className="text-emerald-400"
                  />

                  <span className="text-xs text-slate-400">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;