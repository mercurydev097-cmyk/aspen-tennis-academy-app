import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Crown, Flame, Gift, Star, Ticket } from "lucide-react";
import { useState } from "react";
import { Card } from "../components/ui/Card";
import { useData } from "../data/store";

const TIERS = [
  { name: "Baseline", min: 0 },
  { name: "Rally", min: 500 },
  { name: "Champion", min: 1200 },
];

export function useRewards() {
  const { bookings } = useData();
  const mine = bookings.filter((b) => b.customerId === "c-sarah" && b.status === "confirmed");
  const points = 250 + mine.length * 50;
  const tierIdx = TIERS.reduce((acc, t, i) => (points >= t.min ? i : acc), 0);
  const next = TIERS[tierIdx + 1];
  return { points, tier: TIERS[tierIdx], next, count: mine.length };
}

export function Rewards() {
  const navigate = useNavigate();
  const { points, tier, next } = useRewards();
  const [copied, setCopied] = useState(false);
  const pct = next ? Math.min(100, ((points - tier.min) / (next.min - tier.min)) * 100) : 100;

  const copy = () => {
    try {
      navigator.clipboard?.writeText("SARAH-ASPEN");
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-full pb-10">
      <div className="bg-navy-900 px-6 pb-8 pt-10 text-white">
        <button onClick={() => navigate(-1)} className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
          <ArrowLeft size={16} />
        </button>
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ball">
          <Crown size={13} /> Aspen Rewards
        </p>
        <motion.p
          key={points}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-[44px] font-extrabold leading-none"
        >
          {points}
          <span className="ml-1.5 text-[14px] font-semibold text-white/60">pts</span>
        </motion.p>
        <p className="mt-1 text-[13px] text-white/70">{tier.name} member</p>
        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-ball"
          />
        </div>
        <p className="mt-2 text-[12px] text-white/70">
          {next ? `${next.min - points} pts to ${next.name}` : "You've reached the top tier"}
        </p>
      </div>

      <div className="space-y-3 px-6 pt-6">
        <Card className="flex items-center gap-3.5 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100"><Flame size={18} className="text-gold-500" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-navy-900">3 week streak</p>
            <p className="text-[12px] text-ink-500">Play every week to keep it going</p>
          </div>
        </Card>

        <p className="pt-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">Perks</p>
        {[
          { icon: Ticket, t: "Free guest pass", d: "Bring a friend to any drill at 500 pts" },
          { icon: Star, t: "Early booking access", d: "Reserve new classes before everyone else at 1,200 pts" },
          { icon: Gift, t: "Birthday court time", d: "A free session in your birthday month" },
        ].map((p) => (
          <Card key={p.t} className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pine-100"><p.icon size={18} className="text-pine-600" /></div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-navy-900">{p.t}</p>
              <p className="text-[12px] text-ink-500">{p.d}</p>
            </div>
          </Card>
        ))}

        <div className="mt-2 rounded-2xl bg-pine-600 p-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-wide text-white/70">Refer a friend</p>
          <p className="mt-1 text-[15px] font-bold">You both earn 200 pts when they book.</p>
          <button onClick={copy} className="mt-3 flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-[14px] font-bold tracking-widest">
            SARAH-ASPEN <Copy size={14} />
            <span className="text-[11px] font-semibold tracking-normal text-ball">{copied ? "Copied" : ""}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
