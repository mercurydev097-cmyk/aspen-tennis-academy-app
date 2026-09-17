import { NavLink } from "react-router-dom";
import { Home, CalendarDays, Users, CircleUserRound } from "lucide-react";
import { cn } from "../../lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/book", label: "Book", icon: CalendarDays },
  { to: "/family", label: "Family", icon: Users },
  { to: "/profile", label: "Profile", icon: CircleUserRound },
];

export function BottomNav() {
  return (
    <div className="flex items-center justify-between border-t border-ink-200 bg-white/95 px-8 pb-7 pt-3 backdrop-blur">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="flex flex-col items-center gap-1"
        >
          {({ isActive }) => (
            <>
              <Icon
                size={22}
                strokeWidth={2.1}
                className={cn(isActive ? "text-navy-900" : "text-ink-300")}
              />
              <span
                className={cn(
                  "text-[11px] font-medium",
                  isActive ? "text-navy-900" : "text-ink-300"
                )}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
