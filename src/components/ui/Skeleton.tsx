import { cn } from "../../lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-ink-200/70", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-9 w-20" />
    </div>
  );
}
