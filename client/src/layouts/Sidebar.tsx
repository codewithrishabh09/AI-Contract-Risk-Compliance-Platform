import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardCheck,
  FileSearch,
  FileText,
  LayoutDashboard,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Contracts",
    path: "/contracts",
    icon: FileText,
    expandable: true,
  },
  {
    label: "Upload & Process",
    path: "/upload",
    icon: UploadCloud,
    expandable: true,
  },
  {
    label: "AI Analysis",
    path: "/analysis",
    icon: Sparkles,
    expandable: true,
  },
  {
    label: "Risk Findings",
    path: "/findings",
    icon: ShieldCheck,
    expandable: true,
  },
  {
    label: "Risk Trends",
    path: "/risk-trends",
    icon: BarChart3,
  },
  {
    label: "Compliance",
    path: "/compliance",
    icon: ClipboardCheck,
    expandable: true,
  },
  {
    label: "Audit Logs",
    path: "/audit",
    icon: Activity,
    expandable: true,
  },
  {
    label: "Processing Jobs",
    path: "/jobs",
    icon: BriefcaseBusiness,
    expandable: true,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col
          border-r border-[#173052] bg-[#030D1C]
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-[72px] items-center justify-between border-b border-[#173052] px-5">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-[0_0_24px_rgba(99,102,241,0.25)]">
              <Scale size={19} strokeWidth={2.4} />
            </div>

            <div>
              <div className="text-[17px] font-semibold tracking-tight text-white">
                LexMind
              </div>

              <div className="text-[10px] font-medium tracking-wide text-slate-500">
                CONTRACT INTELLIGENCE
              </div>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Workspace
          </div>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "group flex h-10 items-center gap-3 rounded-lg px-3",
                      "text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-indigo-500/20 to-blue-500/10 text-white shadow-[inset_2px_0_0_#6366f1]"
                        : "text-slate-400 hover:bg-white/[0.035] hover:text-slate-100",
                    ].join(" ")
                  }
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  <span className="flex-1">{item.label}</span>

                  {item.expandable && (
                    <ChevronDown
                      size={13}
                      className="text-slate-600 transition group-hover:text-slate-400"
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* AI card */}
        <div className="px-3 pb-4">
          <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.09] to-blue-500/[0.03] p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                <Sparkles size={15} />
              </div>

              <span className="text-xs font-semibold text-slate-200">
                AI Contract Intelligence
              </span>
            </div>

            <p className="text-[11px] leading-5 text-slate-500">
              Analyze agreements, detect risks, and uncover compliance issues.
            </p>

            <button
              type="button"
              className="mt-3 flex items-center gap-2 text-[11px] font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Explore AI tools
              <FileSearch size={13} />
            </button>
          </div>
        </div>

        {/* Organization */}
        <div className="border-t border-[#173052] p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-white/[0.035]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-slate-300">
              AC
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-slate-200">
                Acme Corporation
              </div>

              <div className="mt-0.5 text-[10px] text-slate-500">
                Enterprise workspace
              </div>
            </div>

            <ChevronDown size={14} className="text-slate-600" />
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;