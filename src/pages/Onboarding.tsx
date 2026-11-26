import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarCheck, QrCode, Users } from "lucide-react";
import { Button } from "../components/ui/Button";

export const ONBOARD_KEY = "aspen-onboarded";

const slides = [
  { icon: Users, title: "One account, the whole family", text: "Add adults and juniors, then book for everyone in a single checkout." },
  { icon: CalendarCheck, title: "Book in seconds", text: "Browse live drills and classes by level, coach and court, then reserve your spot." },
  { icon: QrCode, title: "Walk on court with your pass", text: "Every booking gets a QR check-in pass and a calendar reminder." },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const last = i === slides.length - 1;
  const done = () => {
    try {
      localStorage.setItem(ONBOARD_KEY, "1");
    } catch {
      /* ignore */
    }
    navigate("/signup");
  };
  const S = slides[i];

  return (
    <div className="flex min-h-full flex-col bg-navy-900 px-7 pb-10 pt-14 text-white">
      <button onClick={done} className="self-end text-[13px] font-semibold text-white/70">
        Skip
      </button>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 13 }}
              className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-white/10 ring-1 ring-white/20"
            >
              <S.icon size={46} className="text-ball" />
            </motion.div>
            <h1 className="mt-9 text-[26px] font-extrabold leading-tight">{S.title}</h1>
            <p className="mt-3 max-w-[290px] text-[14px] leading-relaxed text-white/70">{S.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, n) => (
          <motion.span key={n} animate={{ width: n === i ? 26 : 8, opacity: n === i ? 1 : 0.4 }} className="h-2 rounded-full bg-ball" />
        ))}
      </div>
      <Button fullWidth onClick={() => (last ? done() : setI(i + 1))} className="!bg-white !text-navy-900">
        {last ? "Get started" : "Next"} <ArrowRight size={17} />
      </Button>
    </div>
  );
}
