import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { useAppState } from "../context/AppState";
import { cn } from "../lib/utils";
import type { ProgramType } from "../data/mockData";

export function AddFamilyMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { family, addFamilyMember, updateFamilyMember } = useAppState();
  const editingMember = id ? family.find((m) => m.id === id) : undefined;
  const isEdit = Boolean(editingMember);

  const [name, setName] = useState(editingMember?.name ?? "");
  const [relationship, setRelationship] = useState(editingMember?.relationship ?? "");
  const [type, setType] = useState<ProgramType>(editingMember?.type ?? "adult");
  const [age, setAge] = useState(editingMember?.age?.toString() ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && editingMember) {
      updateFamilyMember(editingMember.id, {
        name,
        relationship,
        type,
        age: age ? Number(age) : undefined,
      });
      navigate(`/family/${editingMember.id}`);
    } else {
      addFamilyMember({
        name,
        relationship,
        type,
        age: age ? Number(age) : undefined,
        color: type === "adult" ? "navy" : "gold",
      });
      navigate("/family");
    }
  };

  return (
    <div className="px-6 pb-8 pt-10">
      <ScreenHeader
        title={isEdit ? "Edit Family Member" : "Add Family Member"}
        subtitle={isEdit ? "Update their details." : "Keep everyone in the same rally."}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Jamie Mitchell"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Relationship"
          placeholder="e.g. Daughter"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          required
        />

        <div>
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-ink-500">
            Program Type
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("adult")}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-colors",
                type === "adult"
                  ? "border-pine-600 bg-pine-50"
                  : "border-ink-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-navy-900">Adult</span>
                {type === "adult" && <Check size={16} className="text-pine-600" />}
              </div>
              <p className="mt-0.5 text-[12px] text-ink-500">18+ programs</p>
            </button>
            <button
              type="button"
              onClick={() => setType("junior")}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-colors",
                type === "junior"
                  ? "border-gold-500 bg-gold-50"
                  : "border-ink-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-navy-900">Junior</span>
                {type === "junior" && <Check size={16} className="text-gold-500" />}
              </div>
              <p className="mt-0.5 text-[12px] text-ink-500">Kids' programs</p>
            </button>
          </div>
        </div>

        <Input
          label="Age (optional)"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <Button fullWidth type="submit" className="mt-4">
          {isEdit ? "Save Changes" : "Save Family Member"} <Check size={16} />
        </Button>
      </form>
    </div>
  );
}
