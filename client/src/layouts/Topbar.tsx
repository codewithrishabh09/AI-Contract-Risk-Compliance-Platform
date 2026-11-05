import {
  Bell,
  Command,
  Home,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface TopbarProps {
  onMenuClick: () => void;
}

function getInitials(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatRole(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

function Topbar({ onMenuClick }: TopbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const fullName = user?.full_name?.trim() || "User";

  const role = user?.role
    ? formatRole(user.role)
    : "User";

  const initials = getInitials(fullName);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-[#173052] bg-[#020B18]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="mr-3 rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative max-w-[520px] flex-1">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          placeholder="Search contracts, clauses, risks, or ask AI..."
          className="
            h-10 w-full rounded-lg border border-[#173052]
            bg-[#071426] pl-10 pr-20 text-xs text-slate-200
            outline-none placeholder:text-slate-600
            transition focus:border-indigo-500/50 focus:ring-2
            focus:ring-indigo-500/10
          "
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-[#203858] bg-[#0B1930] px-1.5 py-1 text-[10px] text-slate-500">
          <Command size={10} />
          <span>K</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {/* System status */}
        <div className="hidden items-center gap-2 border-r border-[#173052] pr-4 md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

          <span className="text-[11px] font-medium text-slate-400">
            System healthy
          </span>
        </div>

        {/* Security */}
        <button
          type="button"
          className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200 sm:block"
          aria-label="Security status"
        >
          <ShieldCheck size={18} />
        </button>

        {/* Theme */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
          aria-label="Toggle theme"
        >
          <Sun size={18} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
          aria-label="Notifications"
        >
          <Bell size={18} />

          <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white">
            3
          </span>
        </button>

        {/* Authenticated User */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() =>
              setProfileMenuOpen(
                (current) => !current,
              )
            }
            className="flex items-center gap-2.5 rounded-lg p-1.5 pr-2 transition hover:bg-white/5"
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-[11px] font-bold text-white">
              {initials}
            </div>

            <div className="hidden text-left lg:block">
              <div className="max-w-[160px] truncate text-[11px] font-semibold text-slate-200">
                {fullName}
              </div>

              <div className="text-[10px] text-slate-500">
                {role}
              </div>
            </div>
          </button>

          {profileMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+10px)] z-50 w-[250px] overflow-hidden rounded-xl border border-[#173052] bg-[#071426] shadow-2xl shadow-black/40"
            >
              {/* User identity */}
              <div className="border-b border-[#173052] px-4 py-3">
                <p className="truncate text-xs font-semibold text-slate-200">
                  {fullName}
                </p>

                <p className="mt-1 truncate text-[10px] text-slate-600">
                  {user?.email}
                </p>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <UserRound size={15} />

                  Profile
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate("/");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <Home size={15} />

                  Homepage
                </button>
              </div>

              <div className="border-t border-[#173052] p-1.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                    navigate("/", {
                      replace: true,
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <LogOut size={15} />

                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Topbar;