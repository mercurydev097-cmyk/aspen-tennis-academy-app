import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { cn } from "../lib/utils";

const faqs = [
  {
    q: "How do I add a family member?",
    a: "Go to the Family tab and tap “Add Family Member.” You can add as many adults and juniors as you like, all under one login.",
  },
  {
    q: "Can I cancel a session?",
    a: "Yes — open the session from your Family member's profile or the Home screen and you'll find a cancellation option there.",
  },
  {
    q: "How do refunds work?",
    a: "Refunds for cancelled sessions are returned to your original payment method within 5-7 business days.",
  },
  {
    q: "Can adult and junior programs share one payment?",
    a: "Always. Everything in your cart — regardless of program type or family member — is paid for in a single checkout.",
  },
];

export function HelpSupport() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="px-6 pb-8 pt-10">
      <ScreenHeader title="Help & Support" subtitle="We're here to help." />

      <div className="flex flex-col gap-2.5">
        {faqs.map((faq, idx) => (
          <Card key={idx} className="p-4">
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-[14px] font-semibold text-navy-900">{faq.q}</span>
              <ChevronDown
                size={16}
                className={cn(
                  "shrink-0 text-ink-400 transition-transform",
                  open === idx && "rotate-180"
                )}
              />
            </button>
            {open === idx && (
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-500">{faq.a}</p>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-7 rounded-2xl bg-navy-900 p-5 text-white">
        <p className="text-[14px] font-bold">Still need help?</p>
        <p className="mt-1 text-[13px] text-white/60">
          Our team usually replies within a few hours.
        </p>
        <Button variant="secondary" className="mt-4 !bg-white !text-navy-900 !border-0">
          <Mail size={15} /> Contact Us
        </Button>
      </div>
    </div>
  );
}
