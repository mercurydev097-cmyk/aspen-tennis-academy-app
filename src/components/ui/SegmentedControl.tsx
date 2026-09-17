import { cn } from "../../lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-2xl bg-ink-100 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition-colors",
            value === opt.value
              ? "bg-navy-900 text-white shadow-sm"
              : "text-ink-500 hover:text-navy-900"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
