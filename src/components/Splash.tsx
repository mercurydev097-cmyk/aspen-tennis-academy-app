import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mountain } from "lucide-react";

const SEEN_KEY = "aspen-splash-seen";

export function useSplash() {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const close = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };
  return { show, close };
}

/** Animated baseline-view court, used until public/splash.mp4 is dropped in. */
function CourtScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-[#0c1a29]">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 6, ease: "easeOut" }}
      >
        <svg viewBox="0 0 430 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="court" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2c5a46" />
              <stop offset="1" stopColor="#1d4435" />
            </linearGradient>
            <radialGradient id="glow" cx="50%" cy="38%" r="60%">
              <stop offset="0" stopColor="#c9e23a" stopOpacity="0.28" />
              <stop offset="1" stopColor="#c9e23a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <polygon points="150,330 280,330 420,900 10,900" fill="url(#court)" opacity="0.9" />
          <g stroke="white" strokeOpacity="0.55" strokeWidth="2" fill="none">
            <line x1="150" y1="330" x2="10" y2="900" />
            <line x1="280" y1="330" x2="420" y2="900" />
            <line x1="150" y1="330" x2="280" y2="330" />
            <line x1="188" y1="330" x2="140" y2="900" />
            <line x1="242" y1="330" x2="290" y2="900" />
            <line x1="172" y1="500" x2="258" y2="500" />
            <line x1="215" y1="330" x2="215" y2="500" />
          </g>
          <rect x="0" y="0" width="430" height="900" fill="url(#glow)" />
        </svg>
      </motion.div>

      {/* Slow ball arc */}
      <motion.div
        className="absolute h-4 w-4 rounded-full bg-ball shadow-[0_0_22px_6px_rgba(201,226,58,0.45)]"
        initial={{ left: "78%", top: "62%", scale: 1.4, opacity: 0 }}
        animate={{
          left: ["78%", "58%", "50%"],
          top: ["62%", "28%", "40%"],
          scale: [1.4, 0.8, 0.6],
          opacity: [0, 1, 1],
        }}
        transition={{ duration: 3.4, ease: "easeInOut", times: [0, 0.55, 1] }}
      />

      {/* Court light sweep */}
      <motion.div
        className="absolute -inset-y-10 w-40 -skew-x-12 bg-white/10 blur-2xl"
        initial={{ left: "-30%" }}
        animate={{ left: "130%" }}
        transition={{ duration: 3.4, delay: 0.6, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/50" />
    </div>
  );
}

export function Splash({ onDone }: { onDone: () => void }) {
  const [videoOn, setVideoOn] = useState(false);
  const [exiting, setExiting] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const finish = () => setExiting(true);

  useEffect(() => {
    const t = window.setTimeout(finish, videoOn ? 7500 : 5200);
    return () => window.clearTimeout(t);
  }, [videoOn]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!exiting && (
        <motion.div
          key="splash"
          className="absolute inset-0 z-[60] overflow-hidden bg-navy-900"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <CourtScene />
          <video
            ref={ref}
            src={`${import.meta.env.BASE_URL}splash.mp4`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoOn ? "opacity-100" : "opacity-0"}`}
            autoPlay
            muted
            playsInline
            preload="auto"
            onPlaying={() => setVideoOn(true)}
            onEnded={finish}
            onError={() => setVideoOn(false)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-navy-900/40" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-8 pb-24 text-center text-white">
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 140, damping: 14 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-navy-900 shadow-[var(--shadow-float)]"
            >
              <Mountain size={30} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.6em", y: 12 }}
              animate={{ opacity: 1, letterSpacing: "0.22em", y: 0 }}
              transition={{ delay: 1.8, duration: 1.2, ease: "easeOut" }}
              className="mt-5 text-[34px] font-extrabold"
            >
              ASPEN
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 2.6, duration: 0.8, ease: "easeOut" }}
              className="mt-2 h-[2px] w-24 origin-center bg-ball"
            />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.9 }}
              className="mt-3 text-[11px] font-semibold tracking-[0.35em] text-white/80"
            >
              TENNIS ACADEMY
            </motion.p>
          </div>

          <button
            onClick={finish}
            className="absolute right-5 top-6 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
