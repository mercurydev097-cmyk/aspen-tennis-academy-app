import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight, Mountain, Plus, Trophy } from "lucide-react";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAppState } from "../context/AppState";
import { currentUser } from "../data/mockData";

export function Home() {
  const navigate = useNavigate();
  const { family, upcoming, getSession, getMember } = useAppState();

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
        Good morning, Sarah<span className="text-gold-500">.</span>
      </h1>
      <p className="mt-1 text-[13px] text-ink-500">
        Make time for the people you rally with.
      </p>

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
          {upcoming.map((booking) => {
            const session = getSession(booking.sessionId);
            const member = getMember(booking.memberId);
            if (!session || !member) return null;
            return (
              <Card
                key={booking.id}
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
      </div>
    </div>
  );
}
