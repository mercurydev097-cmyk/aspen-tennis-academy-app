import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Mountain } from "lucide-react";
import qrcode from "qrcode-generator";
import { useAppState } from "../context/AppState";
import { formatLongDate } from "../data/mockData";

export function Pass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { upcoming, getSession, getMember } = useAppState();
  const booking = upcoming.find((u) => u.id === id);
  const session = booking ? getSession(booking.sessionId) : undefined;
  const member = booking ? getMember(booking.memberId) : undefined;

  const svg = useMemo(() => {
    if (!booking) return "";
    const q = qrcode(0, "M");
    q.addData(`ASPEN|${booking.id}|${booking.sessionId}|${booking.memberId}`);
    q.make();
    return q.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
  }, [booking]);

  if (!booking || !session || !member) {
    return <div className="flex min-h-full items-center justify-center p-8 text-ink-500">Pass not found.</div>;
  }

  return (
    <div className="min-h-full bg-navy-900 px-6 pb-10 pt-10 text-white">
      <button onClick={() => navigate(-1)} className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
        <ArrowLeft size={16} />
      </button>
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="overflow-hidden rounded-3xl bg-white text-navy-900 shadow-[var(--shadow-float)]"
      >
        <div className="flex items-center gap-3 bg-pine-600 px-6 py-4 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <Mountain size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Check-in pass</p>
            <p className="text-[15px] font-extrabold leading-tight">{session.title}</p>
          </div>
        </div>
        <div className="flex flex-col items-center px-6 pb-4 pt-6">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-52 rounded-2xl border border-ink-200 p-3"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <p className="mt-3 text-[12px] text-ink-500">Show this code to your coach at the court</p>
        </div>
        <div className="mx-5 border-t border-dashed border-ink-200" />
        <div className="space-y-2.5 px-6 py-5 text-[13px]">
          <p className="text-[16px] font-bold">{member.name}</p>
          {session.date && (
            <p className="flex items-center gap-2 text-ink-500"><Calendar size={14} /> {formatLongDate(session.date)}</p>
          )}
          <p className="flex items-center gap-2 text-ink-500"><Clock size={14} /> {session.time}</p>
          <p className="flex items-center gap-2 text-ink-500"><MapPin size={14} /> {session.location}</p>
        </div>
      </motion.div>
    </div>
  );
}
