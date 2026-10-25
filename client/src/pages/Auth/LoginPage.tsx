import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#020817]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden border-r border-[#173052] bg-[#030D1C] lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute left-[-100px] top-[15%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.07] blur-[120px]" />

          <div className="relative p-10">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600">
                <Scale size={18} />
              </div>

              <span className="text-lg font-semibold text-white">
                LexMind
              </span>
            </Link>
          </div>

          <div className="relative max-w-[560px] px-10 pb-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400">
              Enterprise Contract Intelligence
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white">
              The intelligence layer for every contract decision.
            </h1>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Analyze agreements, identify risk and keep every
              decision backed by evidence.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "AI-powered contract analysis",
                "Clause-level risk intelligence",
                "Enterprise audit and access controls",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-xs text-slate-400"
                >
                  <ShieldCheck
                    size={15}
                    className="text-emerald-400"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative px-10 pb-8 text-[10px] text-slate-700">
            Secure enterprise workspace
          </div>
        </div>

        {/* Form */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px]">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to LexMind
            </Link>

            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
                  <Scale size={18} />
                </div>

                <span className="text-lg font-semibold text-white">
                  LexMind
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to your contract intelligence workspace.
              </p>
            </div>

            <form className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  Work email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-lg border border-[#203858] bg-[#071426] px-3.5 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-slate-400"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-lg border border-[#203858] bg-[#071426] px-3.5 pr-11 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-[11px] text-slate-500">
                <input
                  type="checkbox"
                  className="rounded border-[#29415F] bg-[#071426]"
                />
                Keep me signed in
              </label>

              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 text-xs font-semibold text-white transition hover:bg-indigo-400"
              >
                <LockKeyhole size={14} />
                Sign in
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#173052]" />
              <span className="text-[10px] text-slate-700">
                OR
              </span>
              <div className="h-px flex-1 bg-[#173052]" />
            </div>

            <p className="text-center text-xs text-slate-500">
              Don&apos;t have a LexMind workspace?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;