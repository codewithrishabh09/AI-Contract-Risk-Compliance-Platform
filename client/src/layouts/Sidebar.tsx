import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
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
          className="fixed inset-0 z-40 bg-[#243027]/35 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col
          bg-[#718763]
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="px-6 pb-7 pt-8">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="group flex items-start gap-3"
          >
            <div
              className="
                mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center
                rounded-full border border-white/55
                bg-white/10 text-white
              "
            >
              <Scale size={22} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="font-['Playfair_Display'] text-[25px] font-medium leading-none tracking-[-0.04em] text-white">
                LexMind
              </div>

              <div className="mt-2 text-[9px] font-medium uppercase tracking-[0.16em] text-white/75">
                AI Contract Intelligence
              </div>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="
              absolute right-3 top-3 rounded-lg p-2
              text-white/65 transition
              hover:bg-white/10 hover:text-white
              lg:hidden
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-5">
          <div className="mb-3 px-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
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
                      "group flex min-h-[46px] items-center gap-3 rounded-xl px-3.5",
                      "text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#fffefa] text-[#e8412c] shadow-[0_6px_18px_rgba(36,48,39,0.08)]"
                        : "text-white/85 hover:bg-white/[0.09] hover:text-white",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.1 : 1.8}
                        className="shrink-0"
                      />

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {item.expandable && (
                        <ChevronDown
                          size={13}
                          strokeWidth={1.8}
                          className={
                            isActive
                              ? "text-[#e8412c]/70"
                              : "text-white/45 transition group-hover:text-white/70"
                          }
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Product identity card */}
        <div className="px-4 pb-5">
          <div
            className="
              rounded-2xl border border-white/25
              bg-white/[0.08] p-4
            "
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
              <Sparkles size={17} strokeWidth={1.8} />
            </div>

            <h3 className="font-['Playfair_Display'] text-[18px] font-medium leading-tight text-white">
              Smarter contracts.
              <br />
              Safer decisions.
            </h3>

            <p className="mt-2 text-[11px] leading-5 text-white/65">
              AI-powered contract intelligence for modern legal teams.
            </p>
          </div>
        </div>

        {/* Bottom brand line */}
        <div className="border-t border-white/15 px-5 py-4">
          <div className="flex items-center gap-2 text-[10px] font-medium text-white/60">
            <Scale size={12} strokeWidth={1.8} />

            <span>Contract Intelligence Platform</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;