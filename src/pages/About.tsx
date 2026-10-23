import { useNavigate } from "react-router-dom";
import { Award, CalendarDays, MapPin, Trophy } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { useData } from "../data/store";

const initialsOf = (n: string) => {
  const w = n.split(" ").filter(Boolean);
  return ((w[0]?.[0] ?? "") + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
};

export function About() {
  const navigate = useNavigate();
  const { settings } = useData();
  const a = settings.about;
  const stats = [
    { icon: CalendarDays, label: "Established", value: String(a.established) },
    { icon: Trophy, label: "Years coaching", value: String(a.yearsCoaching) },
    { icon: Award, label: "Best of Fulshear", value: a.award.replace(/^Best of Fulshear\s*/i, "") || a.award },
  ];

  return (
    <div className="px-6 pb-8 pt-10">
      <ScreenHeader title="About Us" subtitle="Aspen Tennis Academy" onBack={() => navigate(-1)} />

      <div className="grid grid-cols-3 gap-2.5">
        {stats.map((s) => (
          <Card key={s.label} className="flex flex-col items-center p-3 text-center">
            <s.icon size={18} className="text-pine-600" />
            <p className="mt-1.5 text-[15px] font-extrabold text-navy-900">{s.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {a.paragraphs.map((p, i) => (
          <p key={i} className="text-[14px] leading-relaxed text-ink-500">
            {p}
          </p>
        ))}
      </div>

      <Card className="mt-6 flex items-center gap-3.5 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-[15px] font-bold text-white">
          {initialsOf(a.coachName)}
        </div>
        <div>
          <p className="text-[15px] font-bold text-navy-900">{a.coachName}</p>
          <p className="text-[12px] text-ink-500">{a.coachTitle}</p>
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-500">
            <MapPin size={12} /> Courts
          </p>
          {a.courts.map((c) => (
            <p key={c} className="text-[14px] font-semibold text-navy-900">
              {c}
            </p>
          ))}
        </Card>
        <Card className="p-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-500">
            <Trophy size={12} /> Leagues
          </p>
          <p className="text-[14px] font-semibold text-navy-900">{a.leagues.join(", ")}</p>
        </Card>
      </div>

      <Button fullWidth className="mt-7" onClick={() => navigate("/book")}>
        Book a session
      </Button>
    </div>
  );
}
