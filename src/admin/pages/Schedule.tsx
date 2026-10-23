import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Copy, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import type { Session } from "../../data/mockData";
import { addDays, classKey, shortDate, useData } from "../../data/store";
import { cn } from "../../lib/utils";
import { Btn, Empty, FillBar, Modal, PageHeader, Pill, Select, Tabs, TextInput, money } from "../ui";
import { ClassForm, JuniorForm } from "./ClassForm";

function sundayOf(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return addDays(iso, -d.getDay());
}

function StatusPill({ s }: { s: Session }) {
  return s.status === "cancelled" ? <Pill tone="red">Cancelled</Pill> : s.status === "draft" ? <Pill tone="amber">Draft</Pill> : <Pill tone="green">Open</Pill>;
}

export function Schedule() {
  const navigate = useNavigate();
  const { classes, bookings, settings, today, bookedCount, cancelClass, reopenClass, deleteClass } = useData();

  const [segment, setSegment] = useState<"adult" | "junior">("adult");
  const [view, setView] = useState<"list" | "week">("list");
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("all");
  const [tag, setTag] = useState("all");
  const [status, setStatus] = useState("all");
  const [showPast, setShowPast] = useState(false);
  const [weekStart, setWeekStart] = useState(sundayOf(today));

  const [form, setForm] = useState<{ editing?: Session | null; template?: Session | null; date?: string } | null>(null);
  const [juniorForm, setJuniorForm] = useState<{ editing?: Session | null } | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Session | null>(null);
  const [resolution, setResolution] = useState<"refund" | "credit" | "none">("refund");
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);

  const adult = useMemo(
    () =>
      classes
        .filter((c) => c.type === "adult" && c.date)
        .filter((c) => showPast || view === "week" || c.date! >= today)
        .filter((c) => (loc === "all" || c.location === loc) && (tag === "all" || c.tag === tag) && (status === "all" || (c.status ?? "open") === status))
        .filter((c) => !q || `${c.title} ${c.tag ?? ""} ${c.program ?? ""}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => classKey(a).localeCompare(classKey(b))),
    [classes, loc, tag, status, q, showPast, view, today]
  );
  const grouped = useMemo(() => {
    const m = new Map<string, Session[]>();
    adult.forEach((c) => m.set(c.date!, [...(m.get(c.date!) ?? []), c]));
    return Array.from(m.entries());
  }, [adult]);

  const junior = classes.filter((c) => c.type === "junior");
  const confirmedFor = (id: string) => bookings.filter((b) => b.sessionId === id && b.status === "confirmed");
  const hasBookings = (id: string) => bookings.some((b) => b.sessionId === id);

  const actions = (c: Session, isJunior = false) => (
    <div className="flex flex-wrap justify-end gap-1.5">
      <Btn size="sm" onClick={() => (isJunior ? setJuniorForm({ editing: c }) : setForm({ editing: c }))}><Pencil size={13} /> Edit</Btn>
      {!isJunior && <Btn size="sm" onClick={() => setForm({ template: c })}><Copy size={13} /> Duplicate</Btn>}
      <Btn size="sm" onClick={() => navigate(`/admin/bookings?class=${c.id}`)}><Users size={13} /> Roster</Btn>
      {c.status === "cancelled" ? (
        <Btn size="sm" onClick={() => reopenClass(c.id)}>Reopen</Btn>
      ) : (
        !isJunior && <Btn size="sm" variant="danger" onClick={() => { setResolution("refund"); setCancelTarget(c); }}>Cancel</Btn>
      )}
      <Btn size="sm" variant="ghost" disabled={hasBookings(c.id)} title={hasBookings(c.id) ? "Has bookings. Cancel it instead." : "Delete"} onClick={() => setDeleteTarget(c)}>
        <Trash2 size={13} />
      </Btn>
    </div>
  );

  const row = (c: Session) => (
    <div key={c.id} className={cn("grid items-center gap-x-3 gap-y-2 px-4 py-3 md:grid-cols-[96px_1fr_110px_88px_auto]", c.status === "cancelled" && "bg-ink-100/50")}>
      <div className="text-[12.5px] font-semibold text-ink-500">{c.startTime}<span className="block font-normal">{c.durationMin} min</span></div>
      <div className="min-w-0">
        <p className={cn("truncate text-[14px] font-semibold text-navy-900", c.status === "cancelled" && "line-through opacity-70")}>{c.title}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-ink-500">
          <span>{c.location}</span>
          <span>{c.coach}</span>
          {c.level && <Pill tone="amber">Level {c.level}</Pill>}
          {c.tag && <span className="truncate">{c.tag}</span>}
        </p>
      </div>
      <FillBar booked={bookedCount(c.id)} capacity={c.capacity} />
      <div className="flex items-center gap-2 md:block md:text-right">
        <span className="text-[14px] font-bold text-navy-900">{money(c.price)}</span>
        <div className="md:mt-1"><StatusPill s={c} /></div>
      </div>
      {actions(c)}
    </div>
  );

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <>
      <PageHeader
        title="Schedule"
        subtitle="Create, edit and cancel classes. Players see changes straight away."
        actions={
          segment === "adult" ? (
            <Btn variant="primary" onClick={() => setForm({ date: today })}><Plus size={15} /> New class</Btn>
          ) : (
            <Btn variant="primary" onClick={() => setJuniorForm({})}><Plus size={15} /> New program</Btn>
          )
        }
      />

      <Tabs value={segment} onChange={setSegment} options={[{ value: "adult", label: "Adult classes" }, { value: "junior", label: "Junior programs" }]} />

      {segment === "adult" && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
              <Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-ink-300" />
              <TextInput placeholder="Search classes" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <Select value={loc} onChange={(e) => setLoc(e.target.value)} className="w-auto">
              <option value="all">All locations</option>
              {settings.locations.map((l) => <option key={l}>{l}</option>)}
            </Select>
            <Select value={tag} onChange={(e) => setTag(e.target.value)} className="w-auto max-w-[220px]">
              <option value="all">All drills</option>
              {settings.tags.map((l) => <option key={l}>{l}</option>)}
            </Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
              <option value="all">Any status</option>
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <label className="flex items-center gap-1.5 text-[13px] text-ink-500">
              <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} /> Show past
            </label>
            <div className="ml-auto inline-flex rounded-lg bg-ink-100 p-1">
              {(["list", "week"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={cn("rounded-md px-3 py-1 text-[13px] font-semibold capitalize", view === v ? "bg-white text-navy-900 shadow-sm" : "text-ink-500")}>{v}</button>
              ))}
            </div>
          </div>

          {view === "list" ? (
            grouped.length === 0 ? (
              <Empty>No classes match these filters.</Empty>
            ) : (
              <div className="space-y-5">
                {grouped.map(([date, list]) => (
                  <section key={date}>
                    <h3 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-ink-500">
                      {shortDate(date)}{date === today ? " · today" : ""}
                    </h3>
                    <div className="divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200 bg-white">{list.map(row)}</div>
                  </section>
                ))}
              </div>
            )
          ) : (
            <>
              <div className="mb-3 flex items-center gap-2">
                <Btn size="sm" onClick={() => setWeekStart(addDays(weekStart, -7))}><ChevronLeft size={14} /></Btn>
                <span className="text-[13px] font-semibold text-navy-900">{shortDate(weekDates[0])} to {shortDate(weekDates[6])}</span>
                <Btn size="sm" onClick={() => setWeekStart(addDays(weekStart, 7))}><ChevronRight size={14} /></Btn>
                <Btn size="sm" variant="ghost" onClick={() => setWeekStart(sundayOf(today))}>This week</Btn>
              </div>
              <div className="grid gap-2 md:grid-cols-7">
                {weekDates.map((d) => {
                  const list = adult.filter((c) => c.date === d);
                  return (
                    <div key={d} className={cn("min-h-[120px] rounded-xl border bg-white p-2", d === today ? "border-pine-600" : "border-ink-200")}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[11.5px] font-bold text-ink-500">{shortDate(d)}</span>
                        <button aria-label="Add class" onClick={() => setForm({ date: d })} className="rounded p-0.5 text-ink-300 hover:bg-ink-100 hover:text-navy-900"><Plus size={14} /></button>
                      </div>
                      <div className="space-y-1.5">
                        {list.map((c) => (
                          <button key={c.id} onClick={() => setForm({ editing: c })} className={cn("w-full rounded-lg px-2 py-1.5 text-left text-[11.5px] leading-snug", c.status === "cancelled" ? "bg-red-50 text-red-600" : c.status === "draft" ? "bg-gold-50 text-gold-500" : "bg-pine-50 text-pine-600")}>
                            <span className="font-bold">{c.startTime}</span>
                            <span className="block truncate font-semibold text-navy-900">{c.title}</span>
                            <span>{bookedCount(c.id)}/{c.capacity} · {c.location}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {segment === "junior" && (
        <div className="divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200 bg-white">
          {junior.length === 0 && <div className="p-6"><Empty>No junior programs yet.</Empty></div>}
          {junior.map((c) => (
            <div key={c.id} className="grid items-center gap-x-3 gap-y-2 px-4 py-3 md:grid-cols-[1fr_110px_88px_auto]">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-navy-900">{c.title}</p>
                <p className="text-[12px] text-ink-500">{c.schedule} · {c.time} · {c.location}</p>
              </div>
              <FillBar booked={bookedCount(c.id)} capacity={c.capacity} />
              <div className="md:text-right"><span className="text-[14px] font-bold text-navy-900">{money(c.price)}</span><div className="md:mt-1"><StatusPill s={c} /></div></div>
              {actions(c, true)}
            </div>
          ))}
        </div>
      )}

      <ClassForm open={!!form} onClose={() => setForm(null)} editing={form?.editing} template={form?.template} defaultDate={form?.date} />
      <JuniorForm open={!!juniorForm} onClose={() => setJuniorForm(null)} editing={juniorForm?.editing} />

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel this class?"
        footer={
          <>
            <Btn onClick={() => setCancelTarget(null)}>Keep class</Btn>
            <Btn variant="primary" onClick={() => { if (cancelTarget) cancelClass(cancelTarget.id, resolution); setCancelTarget(null); }}>Cancel class</Btn>
          </>
        }
      >
        {cancelTarget && (() => {
          const paid = confirmedFor(cancelTarget.id);
          const total = paid.reduce((s, b) => s + b.amount, 0);
          return (
            <div className="space-y-3 text-[13.5px] text-navy-900">
              <p><strong>{cancelTarget.title}</strong>, {shortDate(cancelTarget.date!)} at {cancelTarget.startTime}. It stays visible to players as Cancelled and can no longer be booked.</p>
              {paid.length === 0 ? (
                <p className="text-ink-500">No paid bookings, so nobody needs a refund.</p>
              ) : (
                <>
                  <p>{paid.length} paid booking{paid.length === 1 ? "" : "s"} ({money(total)}). What should happen to them?</p>
                  {([
                    ["refund", "Refund to the original payment method"],
                    ["credit", "Give each family account credit"],
                    ["none", "Do nothing for now (I will handle it manually)"],
                  ] as const).map(([v, label]) => (
                    <label key={v} className="flex items-center gap-2"><input type="radio" checked={resolution === v} onChange={() => setResolution(v)} /> {label}</label>
                  ))}
                  <p className="rounded-lg bg-ink-100 p-3 text-[12px] text-ink-500">Players are told using the cancellation message in Settings. This prototype does not send real messages or move real money.</p>
                </>
              )}
            </div>
          );
        })()}
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this class?"
        footer={
          <>
            <Btn onClick={() => setDeleteTarget(null)}>Keep</Btn>
            <Btn variant="danger" onClick={() => { if (deleteTarget) deleteClass(deleteTarget.id); setDeleteTarget(null); }}>Delete</Btn>
          </>
        }
      >
        <p className="text-[13.5px] text-navy-900">{deleteTarget?.title} has no bookings. Deleting removes it for good.</p>
      </Modal>
    </>
  );
}
