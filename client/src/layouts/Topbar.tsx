import {
  Bell,
  Home,
  LogOut,
  Menu,
  Search,
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
    <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-[#e1dfd5] bg-[#f8f7f1]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-9">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="mr-3 rounded-xl p-2 text-[#687268] transition hover:bg-[#e5eadf] hover:text-[#243027] lg:hidden"
      >
        <Menu size={21} />
      </button>

      {/* Search */}
      <div className="relative w-full max-w-[670px]">
        <Search
          size={19}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#53614f]"
        />

        <input
          type="text"
          placeholder="Search contracts, clauses, or findings..."
          className="
            h-[46px] w-full rounded-xl
            border border-[#d9d7cc]
            bg-[#faf9f4]
            pl-11 pr-20
            text-sm text-[#243027]
            outline-none
            placeholder:text-[#8d948c]
            transition-all
            hover:border-[#c5c9bd]
            focus:border-[#9caf88]
            focus:bg-white
            focus:ring-4
            focus:ring-[#9caf88]/10
          "
        />

        <div
          className="
            absolute right-3 top-1/2
            flex -translate-y-1/2 items-center gap-1.5
            rounded-lg border border-[#dddcd3]
            bg-[#f3f2eb] px-2 py-1.5
            text-[10px] font-medium text-[#8a9188]
          "
        >
          <span>Ctrl</span>
          <span>+</span>
          <span>K</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="
            relative rounded-xl p-2.5
            text-[#596557]
            transition
            hover:bg-[#e5eadf]
            hover:text-[#243027]
          "
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />
        </button>

        {/* User */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setProfileMenuOpen(
                (current) => !current,
              )
            }
            className="
              flex items-center gap-2.5
              rounded-full p-1
              transition
              hover:bg-[#e5eadf]
            "
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
          >
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                border border-[#d7d8ce]
                bg-[#718060]
                text-xs font-semibold
                text-white
                shadow-[0_4px_12px_rgba(36,48,39,0.10)]
              "
            >
              {initials}
            </div>

            <div className="hidden text-left lg:block">
              <div className="max-w-[150px] truncate text-xs font-semibold text-[#243027]">
                {fullName}
              </div>

              <div className="mt-0.5 text-[10px] text-[#7a8379]">
                {role}
              </div>
            </div>
          </button>

          {profileMenuOpen ? (
            <div
              role="menu"
              className="
                absolute right-0 top-[calc(100%+10px)] z-50
                w-[250px] overflow-hidden
                rounded-2xl
                border border-[#dddcd3]
                bg-[#fffefa]
                shadow-[0_20px_55px_rgba(36,48,39,0.14)]
              "
            >
              {/* User identity */}
              <div className="border-b border-[#e5e3da] px-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10 shrink-0 items-center justify-center
                      rounded-full
                      bg-[#718060]
                      text-xs font-semibold
                      text-white
                    "
                  >
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#243027]">
                      {fullName}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-[#8a9188]">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-left text-xs
                    text-[#687268]
                    transition
                    hover:bg-[#e5eadf]
                    hover:text-[#243027]
                  "
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
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-left text-xs
                    text-[#687268]
                    transition
                    hover:bg-[#e5eadf]
                    hover:text-[#243027]
                  "
                >
                  <Home size={15} />

                  Homepage
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-[#e5e3da] p-2">
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
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-left text-xs
                    text-[#c63a2a]
                    transition
                    hover:bg-[#e8412c]/8
                    hover:text-[#b93223]
                  "
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