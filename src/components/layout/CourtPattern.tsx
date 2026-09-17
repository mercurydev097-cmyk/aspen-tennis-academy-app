export function CourtPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="white" strokeOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#grid)" />
      <circle cx="330" cy="70" r="90" stroke="white" strokeOpacity="0.12" />
      <path
        d="M20 220 Q 120 140 260 190"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="1.5"
      />
    </svg>
  );
}
