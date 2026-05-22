import { NavLink, useLocation } from "react-router";

export function Nav() {
  const location = useLocation();
  const isBooks = location.pathname.startsWith("/books");
  const isCalendar = location.pathname.startsWith("/calendar");

  const navThemeClass = isBooks
    ? "bg-sky-300"
    : isCalendar
    ? "bg-emerald-300"
    : "bg-amber-300";
  const navWaveThemeClass = isBooks
    ? "nav-wave-books"
    : isCalendar
    ? "nav-wave-calendar"
    : "nav-wave-home";

  return (
    <nav className={`nav-wave-pattern ${navWaveThemeClass} ${navThemeClass} text-slate-800 shadow-sm border-b border-white/60`}>
      <div className="relative z-10 max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <NavLink to="/" className="text-2xl font-bold tracking-wide hover:text-slate-900 transition-colors">
            BaliNook
        </NavLink>
        <div className="flex items-center gap-2">
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? "bg-white/80 text-slate-900" : "text-slate-700 hover:bg-white/45"
              }`
            }
          >
            Books
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? "bg-white/80 text-slate-900" : "text-slate-700 hover:bg-white/45"
              }`
            }
          >
            Calendar
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
