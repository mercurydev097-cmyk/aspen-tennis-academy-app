import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Users } from "lucide-react";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { useAppState } from "../context/AppState";

export function Family() {
  const navigate = useNavigate();
  const { family, getSession } = useAppState();

  return (
    <div className="px-6 pb-8 pt-10">
      <h1 className="text-[26px] font-extrabold text-navy-900">Your Family</h1>
      <p className="mt-1 text-[13px] text-ink-500">One account, every player.</p>

      <div className="mt-6 flex flex-col gap-3">
        {family.map((m) => (
          <Card
            key={m.id}
            onClick={() => navigate(`/family/${m.id}`)}
            className="flex cursor-pointer items-center gap-3.5 p-4"
          >
            <Avatar initials={m.initials} color={m.color} size={46} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-navy-900">{m.name}</p>
                <Badge tone={m.type === "adult" ? "pine" : "gold"}>{m.type}</Badge>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {m.enrolledSessionIds.length === 0 && (
                  <span className="text-[12px] text-ink-500">No programs yet</span>
                )}
                {m.enrolledSessionIds.map((sid) => {
                  const s = getSession(sid);
                  if (!s) return null;
                  return (
                    <span
                      key={sid}
                      className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-500"
                    >
                      {s.title}
                    </span>
                  );
                })}
              </div>
            </div>
            <ChevronRight size={18} className="text-ink-300" />
          </Card>
        ))}

        <button
          onClick={() => navigate("/family/add")}
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-300 py-4 text-[14px] font-semibold text-navy-900"
        >
          <Plus size={16} /> Add Family Member
        </button>

        <div className="mt-2 flex items-start gap-3 rounded-2xl bg-pine-50 p-4">
          <Users size={18} className="mt-0.5 shrink-0 text-pine-600" />
          <p className="text-[13px] leading-relaxed text-pine-600">
            <span className="font-bold">Made for the whole family.</span> Everyone stays
            under one login and one easy checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
