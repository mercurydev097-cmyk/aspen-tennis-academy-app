import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Toggle } from "../components/ui/Toggle";
import { ScreenHeader } from "../components/layout/ScreenHeader";

const initialSettings = {
  email: true,
  push: true,
  bookingConfirmations: true,
  sessionReminders: true,
  promotions: false,
};

export function Notifications() {
  const [settings, setSettings] = useState(initialSettings);

  const set = (key: keyof typeof initialSettings) => (value: boolean) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const Row = ({
    label,
    description,
    settingKey,
  }: {
    label: string;
    description: string;
    settingKey: keyof typeof initialSettings;
  }) => (
    <div className="flex items-center gap-3 p-4">
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-navy-900">{label}</p>
        <p className="text-[12px] text-ink-500">{description}</p>
      </div>
      <Toggle checked={settings[settingKey]} onChange={set(settingKey)} />
    </div>
  );

  return (
    <div className="px-6 pb-8 pt-10">
      <ScreenHeader title="Notifications" subtitle="Choose how Aspen keeps you posted." />

      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
        Channels
      </p>
      <Card className="mb-6 divide-y divide-ink-100 px-1">
        <Row label="Email notifications" description="Receipts, confirmations, and updates" settingKey="email" />
        <Row label="Push notifications" description="Real-time alerts on this device" settingKey="push" />
      </Card>

      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
        What you hear about
      </p>
      <Card className="divide-y divide-ink-100 px-1">
        <Row
          label="Booking confirmations"
          description="When a session is booked or changed"
          settingKey="bookingConfirmations"
        />
        <Row
          label="Session reminders"
          description="A nudge before class or camp starts"
          settingKey="sessionReminders"
        />
        <Row
          label="Promotions"
          description="New programs, offers, and academy news"
          settingKey="promotions"
        />
      </Card>
    </div>
  );
}
