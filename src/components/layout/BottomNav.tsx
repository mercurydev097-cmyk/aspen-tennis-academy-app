import { NavLink } from "react-router-dom";
import { Home, CalendarDays, Users, CircleUserRound } from "lucide-react";
import { motion } from "framer-motion";
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
          className="relative flex flex-col items-center gap-1 px-2"
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute -top-3 h-[3px] w-8 rounded-full bg-ball"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <motion.div animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -1 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Icon
                size={22}
                strokeWidth={2.1}
                className={cn(isActive ? "text-navy-900" : "text-ink-300")}
              />
              </motion.div>
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
