import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Clock, MapPin, Sparkles, UserRound } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import {
  adultLocations,
  adultTags,
  formatLongDate,
  sessions,
  type ProgramType,
  type Session,
} from "../data/mockData";
import { cn, formatCurrency } from "../lib/utils";

// Weeks run Sunday to Saturday, like the Momence schedule. Only weeks with classes are listed.
const WEEK_STARTS = [new Date(2026, 9, 18), new Date(2026, 9, 25)];
const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function iso(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function weekDays(start: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { iso: iso(d), dow: DOW[d.getDay()], num: d.getDate() };
  });
}

function ClassCard({ s, onOpen }: { s: Session; onOpen: () => void }) {
  const cancelled = s.status === "cancelled";
  return (
    <Card
      onClick={cancelled ? undefined : onOpen}
      className={cn("flex gap-3 p-4", cancelled ? "opacity-60" : "cursor-pointer")}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="pine">Class</Badge>
          {s.level && <Badge tone="gold">Level {s.level}</Badge>}
        </div>
        <p className="mt-1.5 text-[15px] font-semibold leading-snug text-navy-900">{s.title}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[12px] text-ink-500">
          <UserRound size={12} /> {s.coach}
        </p>
        {s.program && <p className="mt-1 text-[12px] text-ink-500">{s.program}</p>}
        <div className="mt-2.5 flex flex-col gap-1 text-[12px] text-ink-500">
          <span className="flex items-center gap-1.5">
            <Clock size={12} /> {s.time} · {s.durationMin} min
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} /> {s.location}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between">
        <span className="text-[16px] font-bold text-navy-900">{formatCurrency(s.price)}</span>
        <span
          className={cn(
            "rounded-xl px-3.5 py-2 text-[12px] font-semibold",
            cancelled ? "bg-ink-200 text-ink-500" : "bg-navy-900 text-white"
          )}
        >
          {cancelled ? "Cancelled" : "Book now"}
        </span>
      </div>
    </Card>
  );
}

export function Book() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ProgramType>("adult");
  const [weekIdx, setWeekIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");

  const adult = useMemo(() => sessions.filter((s) => s.type === "adult"), []);
  const junior = useMemo(() => sessions.filter((s) => s.type === "junior"), []);
  const datesWithClasses = useMemo(() => new Set(adult.map((s) => s.date)), [adult]);
  const days = weekDays(WEEK_STARTS[weekIdx]);

  const filteredAdult = adult.filter(
    (s) =>
      (!selectedDate || s.date === selectedDate) &&
      (location === "all" || s.location === location) &&
      (tag === "all" || s.tag === tag)
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Session[]>();
    for (const s of filteredAdult) {
      const key = s.date ?? "";
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return Array.from(map.entries());
  }, [filteredAdult]);

  const showAll = () => {
    setSelectedDate(null);
    setLocation("all");
    setTag("all");
  };

  return (
    <div className="px-6 pb-8 pt-10">
      <h1 className="text-[26px] font-extrabold text-navy-900">Book a Session</h1>
      <p className="mt-1 text-[13px] text-ink-500">Find your next way to play.</p>

      <div className="mt-6">
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { label: "Adult", value: "adult" },
            { label: "Junior", value: "junior" },
          ]}
        />
      </div>

      {filter === "adult" && (
        <>
          <p className="mt-4 text-center text-[11px] font-medium text-ink-500">
            Times shown in Central time (Chicago, GMT-5)
          </p>

          <div className="mt-3 flex items-center gap-1">
            <button
              aria-label="Previous week"
              disabled={weekIdx === 0}
              onClick={() => setWeekIdx((i) => i - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-navy-900 disabled:text-ink-300"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="grid flex-1 grid-cols-7 gap-1">
              {days.map((d) => {
                const has = datesWithClasses.has(d.iso);
                const active = selectedDate === d.iso;
                return (
                  <button
                    key={d.iso}
                    disabled={!has}
                    onClick={() => setSelectedDate(active ? null : d.iso)}
                    className={cn(
                      "flex flex-col items-center rounded-xl py-1.5 transition-colors",
                      active ? "bg-navy-900 text-white" : has ? "text-navy-900" : "text-ink-300"
                    )}
                  >
                    <span className="text-[9px] font-bold tracking-wide">{d.dow}</span>
                    <span className="text-[14px] font-semibold">{d.num}</span>
                    <span
                      className={cn(
                        "mt-0.5 h-1 w-1 rounded-full",
                        has ? (active ? "bg-ball" : "bg-pine-600") : "bg-transparent"
                      )}
                    />
                  </button>
                );
              })}
            </div>
            <button
              aria-label="Next week"
              disabled={weekIdx === WEEK_STARTS.length - 1}
              onClick={() => setWeekIdx((i) => i + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-navy-900 disabled:text-ink-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={showAll}
              className="shrink-0 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide text-navy-900"
            >
              Show all
            </button>
            <label className="relative min-w-0 flex-1">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full appearance-none rounded-full border border-ink-200 bg-white py-2 pl-3.5 pr-8 text-[12px] font-medium text-navy-900"
              >
                <option value="all">All locations</option>
                {adultLocations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-2.5 text-ink-500" />
            </label>
            <label className="relative min-w-0 flex-1">
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full appearance-none rounded-full border border-ink-200 bg-white py-2 pl-3.5 pr-8 text-[12px] font-medium text-navy-900"
              >
                <option value="all">All drills</option>
                {adultTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-2.5 text-ink-500" />
            </label>
          </div>

          <div className="mb-3 mt-5 flex items-center justify-between">
            <span className="text-[12px] text-ink-500">{filteredAdult.length} classes</span>
          </div>

          {grouped.length === 0 && (
            <div className="rounded-2xl bg-ink-100 p-8 text-center text-[14px] text-ink-500">
              No classes match these filters.
            </div>
          )}

          <div className="flex flex-col gap-5">
            {grouped.map(([date, list]) => (
              <div key={date}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                  {formatLongDate(date)}
                </p>
                <div className="flex flex-col gap-3">
                  {list.map((s) => (
                    <ClassCard key={s.id} s={s} onOpen={() => navigate(`/session/${s.id}`)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {filter === "junior" && (
        <>
          <div className="mb-3 mt-6 flex items-center justify-between">
            <span className="text-[12px] text-ink-500">{junior.length} programs to explore</span>
          </div>
          <div className="flex flex-col gap-3">
            {junior.map((s) => (
              <Card
                key={s.id}
                onClick={() => navigate(`/session/${s.id}`)}
                className="flex cursor-pointer items-center gap-3.5 p-4"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--color-gold-100)" }}
                >
                  <Sparkles size={18} className="text-gold-500" />
                </div>
                <div className="flex-1">
                  <Badge tone="gold">junior</Badge>
                  <p className="mt-1 text-[15px] font-semibold text-navy-900">{s.title}</p>
                  <p className="text-[12px] text-ink-500">
                    {s.schedule} · {s.time}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[14px] font-bold text-navy-900">{formatCurrency(s.price)}</span>
                  <ChevronRight size={16} className="text-ink-300" />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
