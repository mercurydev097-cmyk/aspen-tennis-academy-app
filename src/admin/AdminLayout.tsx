import { useState, type FormEvent, type ReactNode } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { CalendarDays, CreditCard, LayoutDashboard, LogOut, Settings, Smartphone, Ticket, Users } from "lucide-react";
import { cn } from "../lib/utils";
import { Btn, Field, TextInput } from "./ui";

const KEY = "aspen-admin-session";
let memFlag = false;

export const DEMO_EMAIL = "admin@aspentennis.demo";
export const DEMO_PASSWORD = "aspen2026";

function isAdmin() {
  try {
    return sessionStorage.getItem(KEY) === "1" || memFlag;
  } catch {
    return memFlag;
  }
}
function setAdmin(on: boolean) {
  memFlag = on;
  try {
    if (on) sessionStorage.setItem(KEY, "1");
    else sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  return isAdmin() ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === DEMO_EMAIL && pw === DEMO_PASSWORD) {
      setAdmin(true);
      navigate("/admin", { replace: true });
    } else setErr("Incorrect email or password.");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-200 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-[var(--shadow-float)]">
        <p className="text-[12px] font-extrabold tracking-[0.25em] text-pine-600">ASPEN</p>
        <h1 className="mt-1 text-[22px] font-extrabold text-navy-900">Admin sign in</h1>
        <p className="mt-1 text-[13px] text-ink-500">Manage classes, players and payments.</p>
        <div className="mt-5 space-y-3.5">
          <Field label="Email">
            <TextInput value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </Field>
          <Field label="Password">
            <TextInput type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
          </Field>
          {err && <p className="text-[12.5px] font-medium text-red-600">{err}</p>}
          <Btn variant="primary" type="submit" className="w-full py-2.5">
            Sign in
          </Btn>
        </div>
        <div className="mt-5 rounded-lg bg-gold-50 p-3 text-[12px] text-ink-500">
          <p className="font-bold text-navy-900">Demo login (prototype only, not real security)</p>
          <p className="mt-1">Email: {DEMO_EMAIL}</p>
          <p>Password: {DEMO_PASSWORD}</p>
          <button
            type="button"
            onClick={() => {
              setEmail(DEMO_EMAIL);
              setPw(DEMO_PASSWORD);
            }}
            className="mt-2 font-semibold text-pine-600"
          >
            Fill in demo login
          </button>
        </div>
      </form>
    </div>
  );
}

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/admin/bookings", label: "Bookings", icon: Ticket },
  { to: "/admin/players", label: "Players", icon: Users },
  { to: "/admin/pricing", label: "Pricing & payments", icon: CreditCard },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const signOut = () => {
    setAdmin(false);
    navigate("/admin/login");
  };
  const link = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-colors",
      isActive ? "bg-white/12 text-white" : "text-white/65 hover:bg-white/8 hover:text-white"
    );
  return (
    <div className="min-h-screen bg-surface text-navy-900 md:flex">
      <aside className="bg-navy-900 md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col">
        <div className="flex items-center justify-between px-4 py-3 md:block md:px-5 md:py-5">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.3em] text-ball">ASPEN</p>
            <p className="text-[13px] font-semibold text-white/80">Admin dashboard</p>
          </div>
          <button onClick={signOut} className="rounded-lg p-2 text-white/70 hover:bg-white/10 md:hidden" aria-label="Sign out">
            <LogOut size={18} />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={link}>
              <n.icon size={17} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden space-y-1 border-t border-white/10 p-3 md:block">
          <button onClick={() => navigate("/home")} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-white/65 hover:bg-white/8 hover:text-white">
            <Smartphone size={16} /> View player app
          </button>
          <button onClick={signOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-white/65 hover:bg-white/8 hover:text-white">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-5 md:px-8 md:py-7">
        <div className="mb-5 rounded-lg bg-gold-50 px-3.5 py-2 text-[12px] text-ink-500">
          Prototype with demo data. Changes you make here show up in the player app and are saved in this browser only.
        </div>
        <Outlet />
      </main>
    </div>
  );
}
