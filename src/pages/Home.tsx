import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight, Crown, Mountain, Plus, QrCode, Tag, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAppState } from "../context/AppState";
import { currentUser } from "../data/mockData";
import { useData, classKey } from "../data/store";
import { DEFAULT_BANNER } from "../data/types";
import { useRewards } from "./Rewards";

const rise = (i: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 * i, duration: 0.45, ease: "easeOut" as const } });

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function daysUntil(from: string, to: string) {
  return Math.round((new Date(to + "T00:00:00").getTime() - new Date(from + "T00:00:00").getTime()) / 86400000);
}

export function Home() {
  const navigate = useNavigate();
  const { family, upcoming, getSession, getMember } = useAppState();
  const { today: demoToday, settings } = useData();
  const { points, tier } = useRewards();
  const [copied, setCopied] = useState(false);
  const banner = settings.banner ?? DEFAULT_BANNER;
  const next = [...upcoming]
    .map((u) => ({ u, s: getSession(u.sessionId), m: getMember(u.memberId) }))
    .filter((x) => x.s && x.m && x.s.date && x.s.date >= demoToday)
    .sort((a, b) => classKey(a.s!).localeCompare(classKey(b.s!)))[0];
  const nextDays = next ? daysUntil(demoToday, next.s!.date!) : 0;
  const bookAgain = Array.from(new Map(upcoming.map((u) => [getSession(u.sessionId)?.title, u])).values()).slice(0, 4);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-6 pb-8 pt-7">
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white">
            <Mountain size={18} />
          </div>
          <div>
            <p className="text-[13px] font-extrabold leading-none text-navy-900">ASPEN</p>
            <p className="text-[9px] font-semibold tracking-wider text-ink-500">
              TENNIS ACADEMY
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-500">
            <Bell size={16} />
          </button>
          <button onClick={() => navigate("/profile")}>
            <Avatar initials={currentUser.initials} size={36} />
          </button>
        </div>
      </div>

      <p className="text-[13px] font-semibold text-pine-600">{today}</p>
      <h1 className="mt-1 text-[26px] font-extrabold leading-tight text-navy-900">
        {greeting()}, Sarah<span className="text-gold-500">.</span>
      </h1>
      <p className="mt-1 text-[13px] text-ink-500">
        Make time for the people you rally with.
      </p>

      {next && (
        <motion.div {...rise(1)} className="relative mt-6 overflow-hidden rounded-3xl bg-navy-900 p-5 text-white shadow-[var(--shadow-float)]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-ball/20 blur-2xl" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ball">Next on court</p>
          <p className="mt-2 text-[20px] font-extrabold leading-tight">{next.s!.title}</p>
          <p className="mt-0.5 text-[13px] text-white/70">{next.u.when} · {next.m!.name.split(" ")[0]}</p>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[34px] font-extrabold leading-none">{nextDays <= 0 ? "Today" : nextDays === 1 ? "Tomorrow" : nextDays}</p>
              {nextDays > 1 && <p className="mt-1 text-[12px] text-white/70">days to go</p>}
            </div>
            <button onClick={() => navigate(`/pass/${next.u.id}`)} className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-navy-900 active:scale-95">
              <QrCode size={15} /> Show pass
            </button>
          </div>
        </motion.div>
      )}

      {banner.enabled && (
        <motion.div {...rise(2)} className="mt-4 flex items-center gap-3 rounded-2xl border border-gold-500/40 bg-gold-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100"><Tag size={17} className="text-gold-500" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-navy-900">{banner.title}</p>
            <p className="text-[12px] text-ink-500">{banner.text}</p>
          </div>
          {banner.code && (
            <button
              onClick={() => { try { navigator.clipboard?.writeText(banner.code); } catch { /* ignore */ } setCopied(true); setTimeout(() => setCopied(false), 1600); }}
              className="shrink-0 rounded-lg bg-navy-900 px-2.5 py-1.5 text-[11px] font-bold tracking-wider text-white"
            >
              {copied ? "COPIED" : banner.code}
            </button>
          )}
        </motion.div>
      )}

      <motion.button {...rise(3)} onClick={() => navigate("/rewards")} className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-[var(--shadow-card)] active:scale-[0.985]">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pine-100"><Crown size={17} className="text-pine-600" /></div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-navy-900">{points} Aspen points</p>
          <p className="text-[12px] text-ink-500">{tier.name} member</p>
        </div>
        <ChevronRight size={18} className="text-ink-300" />
      </motion.button>

      {bookAgain.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">Book again</p>
          <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6">
            {bookAgain.map((u) => {
              const s = getSession(u.sessionId);
              return s ? (
                <button key={u.id} onClick={() => navigate(`/session/${s.id}`)} className="shrink-0 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-navy-900 active:scale-95">
                  {s.title}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-navy-900">Your Family</h2>
          <button
            onClick={() => navigate("/family")}
            className="text-[13px] font-semibold text-pine-600"
          >
            Manage family
          </button>
        </div>
        <div className="flex gap-3.5">
          {family.map((m) => (
            <button
              key={m.id}
              onClick={() => navigate(`/family/${m.id}`)}
              className="flex flex-col items-center gap-1.5"
            >
              <Avatar initials={m.initials} color={m.color} size={48} />
              <span className="text-[11px] font-medium text-ink-500">
                {m.name.split(" ")[0]}
              </span>
            </button>
          ))}
          <button
            onClick={() => navigate("/family/add")}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-ink-300 text-ink-500">
              <Plus size={18} />
            </div>
            <span className="text-[11px] font-medium text-ink-500">Add</span>
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-navy-900">Upcoming</h2>
          <button
            onClick={() => navigate("/book")}
            className="text-[13px] font-semibold text-pine-600"
          >
            See all
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {upcoming.map((booking, idx) => {
            const session = getSession(booking.sessionId);
            const member = getMember(booking.memberId);
            if (!session || !member) return null;
            return (
              <motion.div key={booking.id} {...rise(4 + idx)}>
              <Card
                onClick={() => navigate(`/session/${session.id}`)}
                className="flex cursor-pointer items-center gap-3.5 p-3.5"
              >
                <div className="h-11 w-1 rounded-full" style={{
                  background: session.type === "adult" ? "var(--color-pine-600)" : "var(--color-gold-500)"
                }} />
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Badge tone={session.type === "adult" ? "pine" : "gold"}>
                      {session.type}
                    </Badge>
                    <span className="text-[11px] text-ink-500">For {member.name.split(" ")[0]}</span>
                  </div>
                  <p className="text-[15px] font-semibold text-navy-900">{session.title}</p>
                  <p className="text-[13px] text-ink-500">{booking.when}</p>
                </div>
                <ChevronRight size={18} className="text-ink-300" />
              </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-7 overflow-hidden rounded-2xl bg-pine-600 p-6 text-white">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
            Find your next rally
          </span>
          <Trophy size={18} className="text-gold-500" />
        </div>
        <p className="text-[17px] font-bold leading-snug">
          There's always room for one more session.
        </p>
        <Button
          variant="secondary"
          className="mt-4 !bg-white/95 !text-pine-600 !border-0"
          onClick={() => navigate("/book")}
        >
          Browse sessions <ChevronRight size={16} />
        </Button>
        <button onClick={() => navigate("/about")} className="mt-3 w-full text-center text-[13px] font-semibold text-white/90 underline">
          About the academy
        </button>
      </div>
    </div>
  );
}
