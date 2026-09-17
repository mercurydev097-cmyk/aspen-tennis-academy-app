import { cn } from "../../lib/utils";

export function Avatar({
  initials,
  color = "navy",
  size = 48,
  className,
}: {
  initials: string;
  color?: "navy" | "gold";
  size?: number;
  className?: string;
}) {
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white shrink-0",
        color === "navy" ? "bg-navy-700" : "bg-gold-500",
        className
      )}
    >
      {initials}
    </div>
  );
}
