import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { AnimatePresence, motion } from "framer-motion";

const TAB_ROUTES = ["/home", "/book", "/family", "/profile"];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const showNav = TAB_ROUTES.includes(location.pathname);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-200 p-0 sm:p-6">
      <div className="relative flex h-screen w-full max-w-[430px] flex-col overflow-hidden bg-surface shadow-none sm:h-[890px] sm:rounded-[40px] sm:shadow-[var(--shadow-float)] sm:ring-8 sm:ring-white/60">
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
