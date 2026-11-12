import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  ClipboardCheck,
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
  },
  {
    label: "Upload & Process",
    path: "/upload",
    icon: UploadCloud,
  },
  {
    label: "AI Analysis",
    path: "/analysis",
    icon: Sparkles,
  },
  {
    label: "Risk Findings",
    path: "/findings",
    icon: ShieldCheck,
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
  },
  {
    label: "Audit Logs",
    path: "/audit",
    icon: Activity,
  },
  {
    label: "Processing Jobs",
    path: "/jobs",
    icon: BriefcaseBusiness,
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
          className="fixed inset-0 z-40 bg-[#243027]/35 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[246px] flex-col
          overflow-hidden
          bg-[#718060]
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ─────────────────────────────────────────────
            BRAND
        ───────────────────────────────────────────── */}
        <div className="px-6 pb-5 pt-7">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="group flex items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/45 bg-white/10 text-white">
              <Scale size={25} strokeWidth={1.7} />
            </div>

            <div>
              <div className="font-['Playfair_Display'] text-[27px] font-medium leading-none tracking-[-0.04em] text-white">
                LexMind
              </div>

              <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-white/75">
                AI Contract Intelligence
              </div>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-5 rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        {/* ─────────────────────────────────────────────
            NAVIGATION
        ───────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Workspace
          </div>

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "group flex min-h-[46px] items-center gap-3 rounded-xl px-4",
                      "text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#fffefa] text-[#e8412c] shadow-[0_8px_20px_rgba(36,48,39,0.08)]"
                        : "text-white/88 hover:bg-white/10 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ─────────────────────────────────────────────
            AI / PRODUCT AREA
            No fake metrics or organization data.
        ───────────────────────────────────────────── */}
        <div className="px-4 pb-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#526449]/35 p-4">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
                <Sparkles size={17} />
              </div>

              <p className="font-['Playfair_Display'] text-[17px] font-medium leading-tight text-white">
                Smarter contracts.
                <br />
                Safer business.
              </p>

              <p className="mt-2 text-[11px] leading-5 text-white/65">
                AI-powered intelligence for contract risk and compliance.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            BOTTOM BRAND AREA
        ───────────────────────────────────────────── */}
        <div className="border-t border-white/15 px-4 py-4">
          <div className="flex items-center gap-2 px-2 text-[10px] font-medium text-white/50">
            <Scale size={13} />
            <span>Contract Intelligence Platform</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;