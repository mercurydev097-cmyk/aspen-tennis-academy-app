import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Plus, Search } from "lucide-react";
import type { Session } from "../../data/mockData";
import type { Booking, PayMethod } from "../../data/types";
import { classKey, shortDate, uid, useData } from "../../data/store";
import { Btn, Empty, Field, FillBar, Modal, PageHeader, Panel, Pill, Select, Stat, TextInput, downloadCsv, money } from "../ui";

const methodLabel: Record<PayMethod, string> = { card: "Card", ach: "ACH", cash: "Cash", comp: "Comp" };
const statusTone = { confirmed: "green", refunded: "red", credited: "blue", cancelled: "gray" } as const;
const statusLabel = { confirmed: "Confirmed", refunded: "Refunded", credited: "Credited", cancelled: "Cancelled" } as const;

const classLabel = (c: Session) => (c.date ? `${shortDate(c.date)} ${c.startTime} · ${c.title}` : c.title);

export function Bookings() {
  const [params, setParams] = useSearchParams();
  const classId = params.get("class") ?? "all";
  const { classes, bookings, customers, today, bookedCount, isFull, updateBooking, resolveBooking, addBookings, upsertCustomer } = useData();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState<{ b: Booking; to: "refund" | "credit" } | null>(null);

  const sorted = useMemo(
    () => [...classes].sort((a, b) => classKey(a).localeCompare(classKey(b))),
    [classes]
  );
  const cls = classes.find((c) => c.id === classId);
  const classById = (id: string) => classes.find((c) => c.id === id);

  const rows = useMemo(
    () =>
      bookings
        .filter((b) => classId === "all" || b.sessionId === classId)
        .filter((b) => status === "all" || b.status === status)
        .filter((b) => !q || `${b.playerName} ${customers.find((c) => c.id === b.customerId)?.name ?? ""}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [bookings, classId, status, q, customers]
  );

  const confirmedRows = rows.filter((b) => b.status === "confirmed");
  const total = confirmedRows.reduce((s, b) => s + b.amount, 0);

  const exportCsv = () =>
    downloadCsv(cls ? `roster-${cls.id}.csv` : "bookings.csv", [
      ["Player", "Family", "Email", "Class", "Date", "Paid", "Method", "Status", "Checked in"],
      ...rows.map((b) => {
        const c = customers.find((x) => x.id === b.customerId);
        const k = classById(b.sessionId);
        return [b.playerName, c?.name ?? "", c?.email ?? "", k?.title ?? "", k?.date ?? "", b.amount.toFixed(2), methodLabel[b.method], statusLabel[b.status], b.checkedIn ? "Yes" : "No"];
      }),
    ]);

  const checkInAll = () => confirmedRows.forEach((b) => !b.checkedIn && updateBooking(b.id, { checkedIn: true }));

  return (
    <>
      <PageHeader
        title="Bookings"
        subtitle="Every booking, with rosters, check-in, refunds and walk-ins."
        actions={
          <>
            <Btn onClick={exportCsv}><Download size={14} /> Export CSV</Btn>
            <Btn variant="primary" onClick={() => setAdding(true)}><Plus size={15} /> Add booking</Btn>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select
          value={classId}
          onChange={(e) => (e.target.value === "all" ? setParams({}) : setParams({ class: e.target.value }))}
          className="w-auto max-w-full sm:max-w-md"
        >
          <option value="all">All classes</option>
          {sorted.map((c) => <option key={c.id} value={c.id}>{classLabel(c)}{c.status === "cancelled" ? " (cancelled)" : ""}</option>)}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
          <option value="all">Any status</option>
          {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
        <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-ink-300" />
          <TextInput placeholder="Search player or family" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      {cls && (
        <Panel className="mb-4" title={cls.title} action={cls.status === "cancelled" ? <Pill tone="red">Cancelled</Pill> : cls.status === "draft" ? <Pill tone="amber">Draft</Pill> : <Pill tone="green">Open</Pill>}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-[13px] text-ink-500">
              {cls.date ? `${shortDate(cls.date)}, ${cls.time}` : cls.schedule} · {cls.location} · {cls.coach}
              {cls.date === today && " · today"}
            </div>
            <div className="w-40"><FillBar booked={bookedCount(cls.id)} capacity={cls.capacity} /></div>
            <Btn size="sm" onClick={checkInAll} disabled={cls.status === "cancelled"}>Check in everyone</Btn>
          </div>
        </Panel>
      )}

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label="Showing" value={rows.length} sub="bookings" />
        <Stat label="Paid" value={money(total)} sub={`${confirmedRows.length} confirmed`} />
        <Stat label="Checked in" value={confirmedRows.filter((b) => b.checkedIn).length} sub={`of ${confirmedRows.length}`} />
      </div>

      {rows.length === 0 ? (
        <Empty>No bookings match these filters.</Empty>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead className="border-b border-ink-100 bg-ink-100/50 text-[11px] uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-2.5 font-bold">In</th>
                <th className="px-2 py-2.5 font-bold">Player</th>
                {classId === "all" && <th className="px-2 py-2.5 font-bold">Class</th>}
                <th className="px-2 py-2.5 font-bold">Booked</th>
                <th className="px-2 py-2.5 font-bold">Paid</th>
                <th className="px-2 py-2.5 font-bold">Method</th>
                <th className="px-2 py-2.5 font-bold">Status</th>
                <th className="px-4 py-2.5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((b) => {
                const c = customers.find((x) => x.id === b.customerId);
                const k = classById(b.sessionId);
                return (
                  <tr key={b.id}>
                    <td className="px-4 py-2.5">
                      <input type="checkbox" aria-label="Checked in" checked={b.checkedIn} disabled={b.status !== "confirmed"} onChange={(e) => updateBooking(b.id, { checkedIn: e.target.checked })} />
                    </td>
                    <td className="px-2 py-2.5"><span className="font-semibold text-navy-900">{b.playerName}</span><span className="block text-[12px] text-ink-500">{c?.name}</span></td>
                    {classId === "all" && <td className="px-2 py-2.5 text-ink-500">{k ? classLabel(k) : "Deleted class"}</td>}
                    <td className="px-2 py-2.5 text-ink-500">{shortDate(b.createdAt)}</td>
                    <td className="px-2 py-2.5 font-semibold text-navy-900">{money(b.amount)}{b.promoCode && <span className="block text-[11.5px] font-normal text-ink-500">{b.promoCode} (-{money(b.discount)})</span>}</td>
                    <td className="px-2 py-2.5 text-ink-500">{methodLabel[b.method]}</td>
                    <td className="px-2 py-2.5"><Pill tone={statusTone[b.status]}>{statusLabel[b.status]}</Pill></td>
                    <td className="px-4 py-2.5 text-right">
                      {b.status === "confirmed" && (
                        <div className="flex justify-end gap-1.5">
                          <Btn size="sm" onClick={() => setConfirm({ b, to: "refund" })}>Refund</Btn>
                          <Btn size="sm" onClick={() => setConfirm({ b, to: "credit" })}>Credit</Btn>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.to === "refund" ? "Refund this booking?" : "Credit this booking?"}
        footer={
          <>
            <Btn onClick={() => setConfirm(null)}>Back</Btn>
            <Btn variant="primary" onClick={() => { if (confirm) resolveBooking(confirm.b.id, confirm.to); setConfirm(null); }}>
              {confirm?.to === "refund" ? "Refund" : "Add credit"}
            </Btn>
          </>
        }
      >
        {confirm && (
          <p className="text-[13.5px] text-navy-900">
            {confirm.b.playerName} will be {confirm.to === "refund" ? `refunded ${money(confirm.b.amount)} to the original payment method` : `given ${money(confirm.b.amount)} credit on the family account`} and their spot is released. This prototype does not move real money.
          </p>
        )}
      </Modal>

      <AddBooking
        open={adding}
        onClose={() => setAdding(false)}
        defaultClass={cls && cls.status !== "cancelled" ? cls.id : ""}
        classes={sorted.filter((c) => c.status !== "cancelled" && c.status !== "draft" && (!c.date || c.date >= today))}
        isFull={isFull}
        bookedCount={bookedCount}
        onCreate={(list, newCustomer) => {
          if (newCustomer) upsertCustomer(newCustomer);
          addBookings(list);
        }}
        today={today}
      />
    </>
  );
}

function AddBooking({
  open, onClose, defaultClass, classes, isFull, bookedCount, onCreate, today
}: {
  open: boolean; onClose: () => void; defaultClass: string; classes: Session[];
  isFull: (id: string) => boolean; bookedCount: (id: string) => number;
  onCreate: (b: Booking[], newCustomer?: import("../../data/types").Customer) => void;
  today: string;
}) {
  const { customers, bookings } = useData();
  const [sid, setSid] = useState("");
  const [cid, setCid] = useState("");
  const [pid, setPid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<PayMethod>("card");
  const [amount, setAmount] = useState("");
  const [override, setOverride] = useState(false);
  const [err, setErr] = useState("");
  const [lastOpen, setLastOpen] = useState(false);

  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setSid(defaultClass || classes[0]?.id || "");
      setCid(customers[0]?.id ?? "new");
      setPid("");
      setName("");
      setEmail("");
      setMethod("card");
      setAmount("");
      setOverride(false);
      setErr("");
    }
  }

  const cls = classes.find((c) => c.id === sid);
  const cust = customers.find((c) => c.id === cid);
  const players = (cust?.players ?? []).filter((p) => p.type === (cls?.type ?? "adult"));
  const full = cls ? isFull(cls.id) : false;
  const price = method === "comp" ? 0 : amount !== "" ? Number(amount) : cls?.price ?? 0;

  const submit = () => {
    if (!cls) return setErr("Pick a class.");
    if (full && !override) return setErr("This class is full. Tick the override box to add them anyway.");
    let customerId = cid;
    let playerName = "";
    let newCustomer: import("../../data/types").Customer | undefined;
    if (cid === "new") {
      if (!name.trim()) return setErr("Enter the player's name.");
      customerId = uid("c");
      playerName = name.trim();
      newCustomer = {
        id: customerId, name: playerName, email: email.trim(), phone: "",
        players: [{ id: uid("p"), name: playerName, level: "", type: cls.type }],
        notes: "Walk-in added by admin.", credit: 0, oneClick: false, createdAt: today,
      };
    } else {
      const p = players.find((x) => x.id === pid) ?? players[0];
      if (!p) return setErr("This family has no matching player. Add one on the Players page first.");
      playerName = p.name;
      if (bookings.some((b) => b.sessionId === cls.id && b.customerId === cid && b.playerName === playerName && b.status === "confirmed"))
        return setErr(`${playerName} is already booked into this class.`);
    }
    if (!(price >= 0)) return setErr("Enter a valid amount.");
    onCreate(
      [{ id: uid("b"), sessionId: cls.id, customerId, playerName, amount: price, discount: 0, method, status: "confirmed", checkedIn: false, createdAt: today, note: "Added by admin" }],
      newCustomer
    );
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add booking"
      footer={<><Btn onClick={onClose}>Cancel</Btn><Btn variant="primary" onClick={submit}>Add booking</Btn></>}>
      <div className="space-y-3.5">
        <Field label="Class">
          <Select value={sid} onChange={(e) => setSid(e.target.value)}>
            {classes.map((c) => <option key={c.id} value={c.id}>{classLabel(c)} ({bookedCount(c.id)}/{c.capacity})</option>)}
          </Select>
        </Field>
        <Field label="Family">
          <Select value={cid} onChange={(e) => { setCid(e.target.value); setPid(""); }}>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            <option value="new">+ New walk-in</option>
          </Select>
        </Field>
        {cid === "new" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Player name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Email (optional)"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          </div>
        ) : (
          <Field label="Player">
            <Select value={pid || players[0]?.id || ""} onChange={(e) => setPid(e.target.value)}>
              {players.map((p) => <option key={p.id} value={p.id}>{p.name}{p.level ? ` (NTRP ${p.level})` : ""}</option>)}
              {players.length === 0 && <option value="">No matching player</option>}
            </Select>
          </Field>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Payment">
            <Select value={method} onChange={(e) => setMethod(e.target.value as PayMethod)}>
              <option value="card">Card</option><option value="ach">ACH</option><option value="cash">Cash</option><option value="comp">Comp (free)</option>
            </Select>
          </Field>
          <Field label="Amount" hint={cls ? `Class price ${money(cls.price)}` : undefined}>
            <TextInput type="number" min="0" step="0.5" value={method === "comp" ? "0" : amount} placeholder={cls ? String(cls.price) : ""} disabled={method === "comp"} onChange={(e) => setAmount(e.target.value)} />
          </Field>
        </div>
        {full && (
          <label className="flex items-center gap-2 rounded-lg bg-gold-50 p-3 text-[13px] text-navy-900">
            <input type="checkbox" checked={override} onChange={(e) => setOverride(e.target.checked)} /> This class is full. Add them anyway.
          </label>
        )}
        {err && <p className="text-[13px] font-medium text-red-600">{err}</p>}
      </div>
    </Modal>
  );
}
