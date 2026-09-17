import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  initialFamily,
  initialUpcoming,
  sessions,
  type FamilyMember,
  type UpcomingBooking,
} from "../data/mockData";

export interface CartItem {
  sessionId: string;
  memberId: string;
}

interface AppStateShape {
  family: FamilyMember[];
  upcoming: UpcomingBooking[];
  cart: CartItem[];
  addFamilyMember: (m: Omit<FamilyMember, "id" | "initials" | "enrolledSessionIds">) => void;
  updateFamilyMember: (id: string, patch: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  addToCart: (sessionId: string, memberId: string) => void;
  clearCart: () => void;
  confirmBooking: () => void;
  getSession: (id: string) => (typeof sessions)[number] | undefined;
  getMember: (id: string) => FamilyMember | undefined;
}

const AppStateContext = createContext<AppStateShape | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [family, setFamily] = useState<FamilyMember[]>(initialFamily);
  const [upcoming, setUpcoming] = useState<UpcomingBooking[]>(initialUpcoming);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addFamilyMember: AppStateShape["addFamilyMember"] = (m) => {
    const id = `${m.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const initials = m.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    setFamily((f) => [...f, { ...m, id, initials, enrolledSessionIds: [] }]);
  };

  const updateFamilyMember: AppStateShape["updateFamilyMember"] = (id, patch) => {
    setFamily((f) => f.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const removeFamilyMember: AppStateShape["removeFamilyMember"] = (id) => {
    setFamily((f) => f.filter((m) => m.id !== id));
    setUpcoming((u) => u.filter((b) => b.memberId !== id));
  };

  const addToCart: AppStateShape["addToCart"] = (sessionId, memberId) => {
    setCart((c) => [...c, { sessionId, memberId }]);
  };

  const clearCart = () => setCart([]);

  const confirmBooking = () => {
    setUpcoming((u) => [
      ...u,
      ...cart.map((item, i) => ({
        id: `b-${Date.now()}-${i}`,
        sessionId: item.sessionId,
        memberId: item.memberId,
        when: "Scheduled",
      })),
    ]);
    setFamily((f) =>
      f.map((m) => {
        const added = cart.filter((c) => c.memberId === m.id).map((c) => c.sessionId);
        if (!added.length) return m;
        return {
          ...m,
          enrolledSessionIds: Array.from(new Set([...m.enrolledSessionIds, ...added])),
        };
      })
    );
    setCart([]);
  };

  const getSession = (id: string) => sessions.find((s) => s.id === id);
  const getMember = (id: string) => family.find((m) => m.id === id);

  const value = useMemo(
    () => ({
      family,
      upcoming,
      cart,
      addFamilyMember,
      updateFamilyMember,
      removeFamilyMember,
      addToCart,
      clearCart,
      confirmBooking,
      getSession,
      getMember,
    }),
    [family, upcoming, cart]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
