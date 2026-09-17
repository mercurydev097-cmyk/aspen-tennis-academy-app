import { useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { useAppState } from "../context/AppState";
import { formatCurrency } from "../lib/utils";
import { savedCard } from "../data/mockData";

export function Cart() {
  const navigate = useNavigate();
  const { cart, getSession, getMember, confirmBooking } = useAppState();

  const items = cart
    .map((item) => ({ ...item, session: getSession(item.sessionId), member: getMember(item.memberId) }))
    .filter((i) => i.session && i.member);

  const total = items.reduce((sum, i) => sum + (i.session?.price ?? 0), 0);

  const handleConfirm = () => {
    const summary = items.map((i) => ({
      title: i.session!.title,
      type: i.session!.type,
      memberName: i.member!.name.split(" ")[0],
      when: i.session!.schedule,
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
              <p className="text-[12px] text-ink-500">
                For {item.member!.name.split(" ")[0]}
                {item.session!.sessionsIncluded ? ` · ${item.session!.sessionsIncluded} sessions` : ""}
              </p>
            </div>
            <span className="text-[14px] font-semibold text-navy-900">
              {formatCurrency(item.session!.price)}
            </span>
          </div>
        ))}
      </Card>

      <div className="mt-5 flex items-center justify-between">
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
        <Card className="flex items-center gap-3 border border-ink-100 p-3.5">
          <div className="flex h-8 w-11 items-center justify-center rounded-md bg-navy-900">
            <CreditCard size={15} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-navy-900">
              {savedCard.brand} ending in {savedCard.last4}
            </p>
            <p className="text-[12px] text-ink-500">Ready to use</p>
          </div>
        </Card>

        <Button fullWidth className="mt-4" onClick={handleConfirm}>
          Confirm &amp; Pay {formatCurrency(total)} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
