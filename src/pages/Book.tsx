import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Trophy, Sparkles } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { sessions, type ProgramType } from "../data/mockData";
import { formatCurrency } from "../lib/utils";

export function Book() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ProgramType | "all">("all");

  const filtered = sessions.filter((s) => filter === "all" || s.type === filter);

  return (
    <div className="px-6 pb-8 pt-10">
      <h1 className="text-[26px] font-extrabold text-navy-900">Book a Session</h1>
      <p className="mt-1 text-[13px] text-ink-500">Find your next way to play.</p>

      <div className="mt-6">
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { label: "All", value: "all" },
            { label: "Adult", value: "adult" },
            { label: "Junior", value: "junior" },
          ]}
        />
      </div>

      <div className="mb-3 mt-6 flex items-center justify-between">
        <span className="text-[12px] text-ink-500">{filtered.length} sessions to explore</span>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((s) => (
          <Card
            key={s.id}
            onClick={() => navigate(`/session/${s.id}`)}
            className="flex cursor-pointer items-center gap-3.5 p-4"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: s.type === "adult" ? "var(--color-pine-100)" : "var(--color-gold-100)",
              }}
            >
              {s.type === "adult" ? (
                <Trophy size={18} className="text-pine-600" />
              ) : (
                <Sparkles size={18} className="text-gold-500" />
              )}
            </div>
            <div className="flex-1">
              <Badge tone={s.type === "adult" ? "pine" : "gold"}>{s.type}</Badge>
              <p className="mt-1 text-[15px] font-semibold text-navy-900">{s.title}</p>
              <p className="text-[12px] text-ink-500">
                {s.schedule} · {s.time}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[14px] font-bold text-navy-900">
                {formatCurrency(s.price)}
              </span>
              <ChevronRight size={16} className="text-ink-300" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
