import { useState } from "react";
import { NavLink, useLocation } from "react-router";

export function Nav() {
  const [titleBurstKey, setTitleBurstKey] = useState(0);
  const location = useLocation();
  const isBooks = location.pathname.startsWith("/books");
  const isCalendar = location.pathname.startsWith("/calendar");

  const navThemeClass = isBooks
    ? "bg-sky-600"
    : isCalendar
    ? "bg-emerald-600"
    : "bg-amber-600";
  const navWaveThemeClass = isBooks
    ? "nav-wave-books"
    : isCalendar
    ? "nav-wave-calendar"
    : "nav-wave-home";

  return (
    <nav className={`nav-wave-pattern ${navWaveThemeClass} ${navThemeClass} text-white shadow-sm border-b border-white/60`}>
      <div className="relative z-10 max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <NavLink
          to="/"
          onClick={() => setTitleBurstKey((key) => key + 1)}
          className="nav-title-burst-host text-2xl font-bold tracking-wide text-white hover:text-white transition-colors"
        >
            <span className="relative z-10">BaliNook</span>
            <span key={`wave-1-${titleBurstKey}`} aria-hidden className="nav-title-burst nav-title-burst-a" />
            <span key={`wave-2-${titleBurstKey}`} aria-hidden className="nav-title-burst nav-title-burst-b" />
        </NavLink>
        <div className="flex items-center gap-2">
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? "bg-white/35 text-white" : "text-white hover:bg-white/25"
              }`
            }
          >
            Books
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? "bg-white/35 text-white" : "text-white hover:bg-white/25"
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
