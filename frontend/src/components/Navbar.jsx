import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Problem Tracker
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-violet-500/20 text-violet-300 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/notes"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive("/notes")
                  ? "bg-teal-500/20 text-teal-300 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              Notes
            </Link>
            <Link
              to="/add"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                isActive("/add")
                  ? "bg-violet-500/20 text-violet-300 shadow-inner"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Problem
            </Link>
            <Link
              to="/add-note"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                isActive("/add-note")
                  ? "bg-teal-500/20 text-teal-300 shadow-inner"
                  : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/25"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Note
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Nav Links */}
        {mobileOpen && (
          <div className="md:hidden pb-4 grid grid-cols-1 gap-2">
            <Link
              to="/"
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-violet-500/20 text-violet-300 shadow-inner"
                  : "text-slate-300 bg-white/5 hover:text-slate-100 hover:bg-white/10"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/notes"
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive("/notes")
                  ? "bg-teal-500/20 text-teal-300 shadow-inner"
                  : "text-slate-300 bg-white/5 hover:text-slate-100 hover:bg-white/10"
              }`}
            >
              Notes
            </Link>
            <Link
              to="/add"
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isActive("/add")
                  ? "bg-violet-500/20 text-violet-300 shadow-inner"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Problem
            </Link>
            <Link
              to="/add-note"
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isActive("/add-note")
                  ? "bg-teal-500/20 text-teal-300 shadow-inner"
                  : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-500 hover:to-emerald-500"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Note
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
