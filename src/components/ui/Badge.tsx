import { cn } from "../../lib/utils";

export function Badge({
  tone = "pine",
  children,
  className,
}: {
  tone?: "pine" | "gold";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        tone === "pine" && "bg-pine-100 text-pine-600",
        tone === "gold" && "bg-gold-100 text-gold-500",
        className
      )}
    >
      {children}
    </span>
  );
}
