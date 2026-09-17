import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Pencil, X } from "lucide-react";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { useAppState } from "../context/AppState";

export function FamilyMemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { family, getSession, removeFamilyMember, updateFamilyMember } = useAppState();
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const member = family.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="flex min-h-full items-center justify-center p-8 text-center text-ink-500">
        Family member not found.
      </div>
    );
  }

  const handleUnenroll = (sessionId: string) => {
    updateFamilyMember(member.id, {
      enrolledSessionIds: member.enrolledSessionIds.filter((s) => s !== sessionId),
    });
  };

  const handleRemove = () => {
    removeFamilyMember(member.id);
    navigate("/family");
  };

  return (
    <div className="px-6 pb-8 pt-10">
      <ScreenHeader title="Family Member" onBack={() => navigate("/family")} />

      <div className="flex flex-col items-center text-center">
        <Avatar initials={member.initials} color={member.color} size={72} />
        <h2 className="mt-3 text-[20px] font-extrabold text-navy-900">{member.name}</h2>
        <div className="mt-2 flex items-center gap-2">
          <Badge tone={member.type === "adult" ? "pine" : "gold"}>{member.type}</Badge>
          <span className="text-[13px] text-ink-500">
            {member.relationship}
            {member.age ? ` · Age ${member.age}` : ""}
          </span>
        </div>
      </div>

      <Button
        variant="secondary"
        fullWidth
        className="mt-6"
        onClick={() => navigate(`/family/${member.id}/edit`)}
      >
        <Pencil size={15} /> Edit Details
      </Button>

      <div className="mt-8">
        <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-500">
          Enrolled Programs
        </h3>
        <div className="flex flex-col gap-2.5">
          {member.enrolledSessionIds.length === 0 && (
            <p className="text-[13px] text-ink-500">Not enrolled in anything yet.</p>
          )}
          {member.enrolledSessionIds.map((sid) => {
            const s = getSession(sid);
            if (!s) return null;
            return (
              <Card key={sid} className="flex items-center gap-3 p-3.5">
                <div className="flex-1">
                  <Badge tone={s.type === "adult" ? "pine" : "gold"}>{s.type}</Badge>
                  <p className="mt-1 text-[14px] font-semibold text-navy-900">{s.title}</p>
                  <p className="text-[12px] text-ink-500">
                    {s.schedule} · {s.time}
                  </p>
                </div>
                <button
                  onClick={() => handleUnenroll(sid)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-ink-500"
                  aria-label="Unenroll"
                >
                  <X size={14} />
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        {!confirmingRemove ? (
          <Button variant="destructive" fullWidth onClick={() => setConfirmingRemove(true)}>
            Remove Family Member
          </Button>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" />
              <p className="text-[13px] leading-relaxed text-red-700">
                Remove <span className="font-bold">{member.name}</span> from your family
                account? Their enrolled programs will also be removed. This can't be undone.
              </p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setConfirmingRemove(false)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                className="!bg-red-600 hover:!bg-red-700"
                onClick={handleRemove}
              >
                Confirm Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
