import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Banknote, CreditCard, Sparkles } from "lucide-react";
import { Toggle } from "../components/ui/Toggle";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { useAppState } from "../context/AppState";
import { formatCurrency } from "../lib/utils";
import { describeWhen, savedCard } from "../data/mockData";
import { cn } from "../lib/utils";

export function Cart() {
  const navigate = useNavigate();
  const { cart, getSession, getMember, confirmBooking } = useAppState();

  const items = cart
    .map((item) => ({ ...item, session: getSession(item.sessionId), member: getMember(item.memberId) }))
    .filter((i) => i.session && i.member);

  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [method, setMethod] = useState<"card" | "ach">("card");
  const [oneClick, setOneClick] = useState(true);

  const subtotal = items.reduce((sum, i) => sum + (i.session?.price ?? 0), 0);
  const discount = applied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const total = subtotal - discount;

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "DEMO10") {
      setApplied(true);
      setPromoError("");
    } else {
      setApplied(false);
      setPromoError("This promo code is not valid.");
    }
  };

  const handleConfirm = () => {
    const summary = items.map((i) => ({
      title: i.session!.title,
      type: i.session!.type,
      memberName: i.member!.name.split(" ")[0],
      when: describeWhen(i.session!),
    }));
    confirmBooking();
    navigate("/confirmation", { state: { items: summary } });
  };

  if (items.length === 0) {
    return (
      <div className="px-6 pb-8 pt-10">
        <ScreenHeader title="Your Cart" subtitle="One checkout for the whole family" onBack={() => navigate("/book")} />
        <div className="rounded-2xl bg-ink-100 p-8 text-center text-[14px] text-ink-500">
          Your cart is empty. Browse sessions to add one.
        </div>
        <Button fullWidth className="mt-6" onClick={() => navigate("/book")}>
          Browse Sessions
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col px-6 pb-8 pt-10">
      <ScreenHeader title="Your Cart" subtitle="One checkout for the whole family" onBack={() => navigate("/book")} />

      <Card className="divide-y divide-ink-100 px-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 p-4">
            <div
              className="h-9 w-1 rounded-full"
              style={{
                background:
                  item.session!.type === "adult" ? "var(--color-pine-600)" : "var(--color-gold-500)",
              }}
            />
            <div className="flex-1">
              <span
                className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: item.session!.type === "adult" ? "var(--color-pine-600)" : "var(--color-gold-500)" }}
              >
                {item.session!.type}
              </span>
              <p className="text-[14px] font-semibold text-navy-900">{item.session!.title}</p>
              {item.session!.date && (
                <p className="text-[12px] text-ink-500">{describeWhen(item.session!)}</p>
              )}
              <p className="text-[12px] text-ink-500">
                For {item.member!.name.split(" ")[0]}
                {item.session!.date
                  ? ` · Ticket × 1`
                  : item.session!.sessionsIncluded
                    ? ` · ${item.session!.sessionsIncluded} sessions`
                    : ""}
              </p>
            </div>
            <span className="text-[14px] font-semibold text-navy-900">
              {formatCurrency(item.session!.price)}
            </span>
          </div>
        ))}
      </Card>

      <div className="mt-5">
        <span className="text-[11px] font-bold uppercase tracking-wide text-ink-500">Promo code</span>
        <div className="mt-2 flex gap-2">
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Enter code"
            className="min-w-0 flex-1 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-[14px] text-navy-900"
          />
          <button
            onClick={applyPromo}
            className="rounded-xl bg-navy-900 px-4 text-[13px] font-semibold text-white"
          >
            Apply
          </button>
        </div>
        {promoError && <p className="mt-1.5 text-[12px] text-red-600">{promoError}</p>}
        {applied && <p className="mt-1.5 text-[12px] font-medium text-pine-600">DEMO10 applied: 10% off.</p>}
        <p className="mt-1.5 text-[11px] text-ink-500">Demo: try DEMO10.</p>
      </div>

      {applied && (
        <div className="mt-4 flex items-center justify-between text-[13px] text-ink-500">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      )}
      {applied && (
        <div className="mt-1 flex items-center justify-between text-[13px] text-pine-600">
          <span>Discount</span>
          <span>-{formatCurrency(discount)}</span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[16px] font-bold text-navy-900">Total</span>
        <span className="text-[18px] font-extrabold text-navy-900">{formatCurrency(total)}</span>
      </div>

      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-pine-50 p-3.5">
        <Sparkles size={16} className="shrink-0 text-pine-600" />
        <p className="text-[12.5px] font-medium text-pine-600">
          One login, one payment — for the whole family.
        </p>
      </div>

      <div className="mt-auto pt-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
            Payment Method
          </span>
          <button
            onClick={() => navigate("/profile/payment")}
            className="text-[13px] font-semibold text-pine-600"
          >
            Edit
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <Card
            onClick={() => setMethod("card")}
            className={cn(
              "flex cursor-pointer items-center gap-3 border-2 p-3.5",
              method === "card" ? "border-navy-900" : "border-ink-100"
            )}
          >
            <div className="flex h-8 w-11 items-center justify-center rounded-md bg-navy-900">
              <CreditCard size={15} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-navy-900">
                {savedCard.brand} ending in {savedCard.last4}
              </p>
              <p className="text-[12px] text-ink-500">Card · Ready to use</p>
            </div>
          </Card>
          <Card
            onClick={() => setMethod("ach")}
            className={cn(
              "flex cursor-pointer items-center gap-3 border-2 p-3.5",
              method === "ach" ? "border-navy-900" : "border-ink-100"
            )}
          >
            <div className="flex h-8 w-11 items-center justify-center rounded-md bg-pine-600">
              <Banknote size={15} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-navy-900">Bank account (ACH)</p>
              <p className="text-[12px] text-ink-500">Direct debit · $0.00 processing fee</p>
            </div>
          </Card>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[12.5px] text-ink-500">Use this for one-click checkout next time</p>
          <Toggle checked={oneClick} onChange={setOneClick} />
        </div>

        <Button fullWidth className="mt-4" onClick={handleConfirm}>
          Confirm &amp; Pay {formatCurrency(total)} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
