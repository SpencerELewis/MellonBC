import { NavLink } from "react-router";

export function Nav() {
  return (
    <nav className="bg-amber-900 text-amber-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <NavLink to="/" className="text-2xl font-bold tracking-wide hover:text-amber-200 transition-colors">
            BaliNook
        </NavLink>
        <div className="flex items-center gap-2">
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? "bg-amber-800 text-amber-50" : "text-amber-100 hover:bg-amber-800/70"
              }`
            }
          >
            Books
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? "bg-amber-800 text-amber-50" : "text-amber-100 hover:bg-amber-800/70"
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
