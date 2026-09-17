import { useState } from "react";
import { Check, CreditCard, Plus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { cn } from "../lib/utils";

interface Card_ {
  id: string;
  brand: string;
  last4: string;
}

export function PaymentMethods() {
  const [cards, setCards] = useState<Card_[]>([{ id: "1", brand: "Visa", last4: "4242" }]);
  const [defaultId, setDefaultId] = useState("1");

  const addCard = () => {
    const id = Date.now().toString();
    setCards((c) => [...c, { id, brand: "Mastercard", last4: "8891" }]);
  };

  const removeCard = (id: string) => {
    setCards((c) => c.filter((card) => card.id !== id));
  };

  return (
    <div className="px-6 pb-8 pt-10">
      <ScreenHeader title="Payment Methods" subtitle="Manage cards for your family's checkout." />

      <div className="flex flex-col gap-2.5">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={cn(
              "flex items-center gap-3 p-4 border",
              defaultId === card.id ? "border-navy-900" : "border-ink-100"
            )}
          >
            <div className="flex h-9 w-12 items-center justify-center rounded-md bg-navy-900">
              <CreditCard size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-navy-900">
                {card.brand} ending in {card.last4}
              </p>
              <p className="text-[12px] text-ink-500">
                {defaultId === card.id ? "Default payment method" : "Tap to set as default"}
              </p>
            </div>
            {defaultId === card.id ? (
              <Check size={18} className="text-pine-600" />
            ) : (
              <button
                onClick={() => setDefaultId(card.id)}
                className="text-[12px] font-semibold text-pine-600"
              >
                Set default
              </button>
            )}
            {cards.length > 1 && (
              <button
                onClick={() => removeCard(card.id)}
                className="ml-1 text-[12px] font-semibold text-ink-400"
              >
                Remove
              </button>
            )}
          </Card>
        ))}
      </div>

      <Button variant="secondary" fullWidth className="mt-5" onClick={addCard}>
        <Plus size={16} /> Add Payment Method
      </Button>
    </div>
  );
}
