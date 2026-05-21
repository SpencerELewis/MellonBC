import { NavLink } from "react-router";

export function Nav() {
  return (
    <nav className="bg-amber-900 text-amber-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <NavLink to="/" className="text-lg font-bold tracking-wide hover:text-amber-200 transition-colors">
          📚 BaliNook Book Club
        </NavLink>
      </div>
    </nav>
  );
}
