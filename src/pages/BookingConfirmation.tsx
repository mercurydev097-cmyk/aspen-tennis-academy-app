import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Check, QrCode, Sparkles, Trophy } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { motion } from "framer-motion";
import { Confetti } from "../components/Confetti";
import { useAppState } from "../context/AppState";
import { downloadIcs } from "../lib/ics";

interface ConfirmedItem {
  title: string;
  type: "adult" | "junior";
  memberName: string;
  when: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

export function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { upcoming } = useAppState();
  const items = (location.state?.items as ConfirmedItem[]) ?? [];

  return (
    <div className="relative flex min-h-full flex-col items-center overflow-hidden px-7 pb-10 pt-16 text-center">
      <Confetti />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-pine-100"
      >
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="var(--color-pine-600)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.5 }} />
        </svg>
        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500" />
      </motion.div>

      <p className="mt-6 text-[11px] font-bold uppercase tracking-wide text-pine-600">
        Booking Confirmed
      </p>
      <h1 className="mt-1 text-[28px] font-extrabold text-navy-900">You're all set!</h1>
      <p className="mt-2 max-w-[260px] text-[14px] text-ink-500">
        Your family is ready for a great week on court. We've sent the details to Sarah's
        email.
      </p>

      <Card className="mt-8 w-full divide-y divide-ink-100 px-1 text-left">
        {items.length === 0 && (
          <div className="p-4 text-[13px] text-ink-500">No booking details available.</div>
        )}
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 p-4">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background: item.type === "adult" ? "var(--color-pine-100)" : "var(--color-gold-100)",
              }}
            >
              {item.type === "adult" ? (
                <Trophy size={15} className="text-pine-600" />
              ) : (
                <Sparkles size={15} className="text-gold-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-navy-900">{item.title}</p>
              <p className="text-[12px] text-ink-500">
                {item.memberName} · {item.when}
              </p>
            </div>
            <Check size={16} className="text-pine-600" />
          </div>
        ))}
      </Card>

      <button
        onClick={() => {
          const ev = items.filter((i) => i.date && i.startTime && i.endTime).map((i) => ({
            title: `${i.title} (${i.memberName})`,
            date: i.date!, startTime: i.startTime!, endTime: i.endTime!, location: i.location ?? "Aspen Tennis Academy",
          }));
          if (ev.length) downloadIcs(ev);
        }}
        className="mt-6 flex items-center gap-1.5 text-[14px] font-semibold text-pine-600">
        <Calendar size={15} /> Add to calendar
      </button>

      {upcoming.length > 0 && (
        <Button variant="secondary" fullWidth className="mt-6" onClick={() => navigate(`/pass/${upcoming[upcoming.length - 1].id}`)}>
          <QrCode size={16} /> View my check-in pass
        </Button>
      )}
      <Button fullWidth className="mt-3" onClick={() => navigate("/home")}>
        Back to Home
      </Button>
    </div>
  );
}
