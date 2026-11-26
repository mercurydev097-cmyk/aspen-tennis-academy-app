import { motion } from "framer-motion";

const COLORS = ["#c9e23a", "#2f6f55", "#e0b44c", "#14283d", "#ffffff"];

export function Confetti({ count = 36 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.2;
    const dist = 90 + ((i * 37) % 130);
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 60,
      rot: (i * 53) % 360,
      color: COLORS[i % COLORS.length],
      w: 6 + (i % 4) * 2,
    };
  });
  return (
    <div className="pointer-events-none absolute left-1/2 top-24 h-0 w-0">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block rounded-[2px]"
          style={{ background: p.color, width: p.w, height: p.w * 1.6 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 220], opacity: [1, 1, 0], rotate: p.rot * 2 }}
          transition={{ duration: 1.9, ease: "easeOut", delay: 0.15 }}
        />
      ))}
    </div>
  );
}
