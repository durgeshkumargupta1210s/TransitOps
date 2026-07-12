import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import {
  FiBell,
  FiMoon,
  FiSun,
  FiLogOut,
  FiSearch,
  FiUser,
} from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">

      <div className="flex items-center justify-between px-6 py-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            TransitOps
          </h1>

          <p className="text-sm text-slate-500">
            Smart Transport Operations Platform
          </p>
        </div>

        <div className="hidden xl:flex w-96 relative">

          <FiSearch
            className="absolute left-4 top-3.5 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="input pl-11"
          />

        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={toggleTheme}
            className="h-11 w-11 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === "dark" ? (
              <FiSun size={20} />
            ) : (
              <FiMoon size={20} />
            )}
          </button>

          <button className="relative h-11 w-11 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <FiBell size={20} />

            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </button>

          {user && (
            <div className="hidden md:flex items-center gap-3">

              <div className="h-11 w-11 rounded-full bg-cyan-600 flex items-center justify-center text-white">
                <FiUser size={20} />
              </div>

              <div className="leading-tight">
                <h4 className="font-semibold text-slate-800 dark:text-white">
                  {user.name}
                </h4>

                <p className="text-xs text-slate-500">
                  {user.role}
                </p>
              </div>

            </div>
          )}

          <button
            onClick={logout}
            className="btn-danger"
          >
            <FiLogOut />
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}