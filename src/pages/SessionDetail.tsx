import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Sparkles, User } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { CourtPattern } from "../components/layout/CourtPattern";
import { useAppState } from "../context/AppState";
import { formatCurrency, cn } from "../lib/utils";
import { formatLongDate } from "../data/mockData";
import { useData } from "../data/store";

export function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSession, family, addToCart } = useAppState();
  const session = getSession(id ?? "");
  const { bookedCount, isFull } = useData();

  const eligibleMembers = useMemo(
    () => family.filter((m) => m.type === session?.type),
    [family, session]
  );
  const [selectedMemberId, setSelectedMemberId] = useState(eligibleMembers[0]?.id);

  if (!session) {
    return (
      <div className="flex min-h-full items-center justify-center p-8 text-center text-ink-500">
        Session not found.
      </div>
    );
  }

  const cancelled = session.status === "cancelled";
  const full = isFull(session.id);
  const spotsLeft = session.capacity ? Math.max(0, session.capacity - bookedCount(session.id)) : null;
  const dated = !!session.date;

  const handleBook = () => {
    if (cancelled || full) return;
    if (selectedMemberId) addToCart(session.id, selectedMemberId);
    navigate("/cart");
  };

  return (
    <div className="min-h-full pb-8">
      <div className="relative overflow-hidden bg-navy-900 px-6 pb-8 pt-10 text-white">
        <CourtPattern className="absolute inset-0 h-full w-full opacity-60" />
        <div className="relative">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-start justify-between">
            <div>
              <Badge tone={session.type === "adult" ? "pine" : "gold"}>{session.type}</Badge>
              <h1 className="mt-3 text-[30px] font-extrabold leading-tight">{session.title}</h1>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ball text-navy-900">
              <Sparkles size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-7">
        {cancelled && (
          <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-[13px] font-semibold text-red-700">
            This class has been cancelled and can no longer be booked.
          </div>
        )}
        {full && !cancelled && (
          <div className="mb-4 rounded-xl bg-gold-50 p-3.5 text-[13px] font-semibold text-gold-500">
            This class is full. Check back if a spot opens up.
          </div>
        )}
        {(session.level || session.program) && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {session.level && <Badge tone="gold">Level {session.level}</Badge>}
            {session.program && <Badge tone="pine">{session.program}</Badge>}
          </div>
        )}
        {session.description && (
          <p className="text-[14px] leading-relaxed text-ink-500">{session.description}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-ink-100 p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-500">
              <Calendar size={12} /> Schedule
            </div>
            <p className="text-[14px] font-semibold text-navy-900">{dated ? formatLongDate(session.date!) : session.schedule}</p>
          </div>
          <div className="rounded-xl bg-ink-100 p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-500">
              <Clock size={12} /> Time
            </div>
            <p className="text-[14px] font-semibold text-navy-900">{session.time}{session.durationMin ? ` · ${session.durationMin} min` : ""}</p>
          </div>
          <div className="rounded-xl bg-ink-100 p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-500">
              <MapPin size={12} /> Location
            </div>
            <p className="text-[14px] font-semibold text-navy-900">{session.location}</p>
          </div>
          <div className="rounded-xl bg-ink-100 p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-500">
              <User size={12} /> Coach
            </div>
            <p className="text-[14px] font-semibold text-navy-900">{session.coach}</p>
          </div>
        </div>

        {dated && (
          <p className="mt-3 text-[11px] text-ink-500">
            Times shown in Central time (Chicago, GMT-5).
            {spotsLeft !== null && !cancelled && !full && spotsLeft <= 3 ? ` Only ${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left.` : ""}
          </p>
        )}

        <div className="mt-5 rounded-xl bg-ink-100 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-500">
              Book for
            </span>
            <span className="text-[16px] font-bold text-navy-900">
              {formatCurrency(session.price)}
            </span>
          </div>
          <div className="flex gap-2">
            {eligibleMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMemberId(m.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full border-2 py-1 pl-1 pr-3 transition-colors",
                  selectedMemberId === m.id
                    ? "border-navy-900 bg-white"
                    : "border-transparent bg-white/60"
                )}
              >
                <Avatar initials={m.initials} color={m.color} size={26} />
                <span className="text-[13px] font-semibold text-navy-900">
                  {m.name.split(" ")[0]}
                </span>
              </button>
            ))}
            {eligibleMembers.length === 0 && (
              <span className="text-[13px] text-ink-500">No matching family member yet</span>
            )}
          </div>
        </div>

        <Button fullWidth className="mt-6" onClick={handleBook} disabled={!selectedMemberId || cancelled || full}>
          {cancelled ? "Class cancelled" : full ? "Class full" : "Book this session"} <ArrowLeft size={16} className="rotate-180" />
        </Button>
      </div>
    </div>
  );
}
