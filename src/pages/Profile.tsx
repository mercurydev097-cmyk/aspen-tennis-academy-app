import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  CreditCard,
  HelpCircle,
  Bell,
  SlidersHorizontal,
  LogOut,
} from "lucide-react";
import { Avatar } from "../components/ui/Avatar";
import { Card } from "../components/ui/Card";
import { currentUser, savedCard } from "../data/mockData";

const rows = [
  {
    to: "/profile/payment",
    icon: CreditCard,
    label: "Payment methods",
    detail: `${savedCard.brand} ending in ${savedCard.last4}`,
  },
  {
    to: "/profile/notifications",
    icon: Bell,
    label: "Notifications",
    detail: "Email & push notifications",
  },
  {
    to: "/profile/help",
    icon: HelpCircle,
    label: "Help & support",
    detail: "We're here to help",
  },
  {
    to: "/profile/preferences",
    icon: SlidersHorizontal,
    label: "App preferences",
    detail: "Language, privacy, and more",
  },
];

export function Profile() {
  const navigate = useNavigate();

  return (
    <div className="px-6 pb-8 pt-10">
      <h1 className="text-[26px] font-extrabold text-navy-900">Profile</h1>
      <p className="mt-1 text-[13px] text-ink-500">Your Aspen account.</p>

      <Card className="mt-6 flex items-center gap-3.5 p-4">
        <Avatar initials={currentUser.initials} size={52} />
        <div className="flex-1">
          <p className="text-[15px] font-bold text-navy-900">{currentUser.name}</p>
          <p className="text-[13px] text-ink-500">{currentUser.email}</p>
        </div>
        <button
          onClick={() => navigate("/profile/edit")}
          className="text-[13px] font-semibold text-pine-600"
        >
          Edit
        </button>
      </Card>

      <div className="mt-5 flex flex-col gap-2.5">
        {rows.map((row) => (
          <Card
            key={row.to}
            onClick={() => navigate(row.to)}
            className="flex cursor-pointer items-center gap-3.5 p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100">
              <row.icon size={17} className="text-navy-900" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-navy-900">{row.label}</p>
              <p className="text-[12px] text-ink-500">{row.detail}</p>
            </div>
            <ChevronRight size={17} className="text-ink-300" />
          </Card>
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white py-4 text-[14px] font-semibold text-navy-900"
      >
        <LogOut size={15} /> Sign out
      </button>
    </div>
  );
}
