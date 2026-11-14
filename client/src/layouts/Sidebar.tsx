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
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-[#243027]/40
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[232px] flex-col
          bg-[#718763]
          shadow-[8px_0_30px_rgba(36,48,39,0.05)]
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="px-5 pb-7 pt-7">
          <div className="flex items-start justify-between">
            <NavLink
              to="/dashboard"
              onClick={onClose}
              className="group flex items-start gap-3"
            >
              <div
                className="
                  mt-0.5 flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-[15px]
                  border border-white/30
                  bg-white/[0.10]
                  text-white
                  shadow-[0_8px_20px_rgba(36,48,39,0.08)]
                  transition
                  group-hover:bg-white/[0.15]
                "
              >
                <Scale
                  size={22}
                  strokeWidth={1.7}
                />
              </div>

              <div className="min-w-0">
                <div
                  className="
                    font-['Playfair_Display']
                    text-[25px] font-medium
                    leading-none tracking-[-0.04em]
                    text-white
                  "
                >
                  LexMind
                </div>

                <div className="mt-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  AI Contract
                  <br />
                  Intelligence
                </div>
              </div>
            </NavLink>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="
                rounded-xl p-2
                text-white/55
                transition
                hover:bg-white/10
                hover:text-white
                lg:hidden
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/45">
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
                      "group relative flex min-h-[44px] items-center gap-3 rounded-[13px] px-3.5",
                      "text-[12.5px] font-medium",
                      "transition-all duration-200",
                      isActive
                        ? [
                            "bg-[#FFFEFA] text-[#243027]",
                            "shadow-[0_7px_20px_rgba(36,48,39,0.09)]",
                          ].join(" ")
                        : [
                            "text-white/78",
                            "hover:bg-white/[0.08]",
                            "hover:text-white",
                          ].join(" "),
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}
                      {isActive && (
                        <span
                          className="
                            absolute left-0 top-1/2
                            h-6 w-[3px]
                            -translate-y-1/2
                            rounded-r-full
                            bg-[#E8412C]
                          "
                        />
                      )}

                      <span
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]",
                          "transition-colors",
                          isActive
                            ? "bg-[#E5EADF] text-[#526347]"
                            : "bg-transparent text-white/70 group-hover:bg-white/[0.07] group-hover:text-white",
                        ].join(" ")}
                      >
                        <Icon
                          size={16}
                          strokeWidth={isActive ? 2 : 1.7}
                        />
                      </span>

                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>

                      {item.expandable && (
                        <ChevronDown
                          size={13}
                          strokeWidth={1.7}
                          className={[
                            "shrink-0 transition-transform",
                            isActive
                              ? "text-[#718060]"
                              : "text-white/35 group-hover:text-white/60",
                          ].join(" ")}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Product message */}
        <div className="px-4 pb-4">
          <div
            className="
              overflow-hidden rounded-[18px]
              border border-white/20
              bg-white/[0.075]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-white/[0.10]
                  text-white
                "
              >
                <Sparkles
                  size={16}
                  strokeWidth={1.7}
                />
              </div>

              <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                AI
              </span>
            </div>

            <h3
              className="
                mt-4
                font-['Playfair_Display']
                text-[17px] font-medium
                leading-[1.15]
                tracking-[-0.01em]
                text-white
              "
            >
              Smarter contracts.
              <br />
              Safer decisions.
            </h3>

            <p className="mt-2.5 text-[10px] leading-[1.65] text-white/55">
              AI-powered contract intelligence for modern legal teams.
            </p>
          </div>
        </div>

        {/* Platform footer */}
        <div className="border-t border-white/12 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.08] text-white/60">
              <Scale
                size={11}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold text-white/60">
                LexMind Platform
              </p>

              <p className="mt-0.5 text-[8px] text-white/35">
                Contract Intelligence
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;