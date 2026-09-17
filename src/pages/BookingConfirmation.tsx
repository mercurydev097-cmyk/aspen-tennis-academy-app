import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Check, Sparkles, Trophy } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { motion } from "framer-motion";

interface ConfirmedItem {
  title: string;
  type: "adult" | "junior";
  memberName: string;
  when: string;
}

export function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const items = (location.state?.items as ConfirmedItem[]) ?? [];

  return (
    <div className="flex min-h-full flex-col items-center px-7 pb-10 pt-16 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-pine-100"
      >
        <Check size={32} className="text-pine-600" />
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

      <button className="mt-6 flex items-center gap-1.5 text-[14px] font-semibold text-pine-600">
        <Calendar size={15} /> Add to calendar
      </button>

      <Button fullWidth className="mt-8" onClick={() => navigate("/home")}>
        Back to Home
      </Button>
    </div>
  );
}
