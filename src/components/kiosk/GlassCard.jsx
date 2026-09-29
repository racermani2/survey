import { motion } from "framer-motion";

/**
 * Glass surface with almost no visible border — the glass reads through
 * blur + a soft inner colored glow. 28–32px radius everywhere.
 */
export default function GlassCard({
  children,
  className = "",
  selected = false,
  accent = false,
  onClick,
  style,
}) {
  return (
    <motion.div
      onClick={onClick}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: 30,
        background: "rgba(255, 255, 255, 0.42)",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        boxShadow: selected
          ? "0 0 0 1px rgba(168,71,43,0.25), 0 0 50px rgba(168,71,43,0.35), 0 12px 40px rgba(168,71,43,0.18), inset 0 1px 1px rgba(255,255,255,0.6)"
          : "0 1px 0 rgba(255,255,255,0.5) inset, 0 8px 30px rgba(34,30,26,0.06), 0 2px 8px rgba(34,30,26,0.04)",
        border: "1px solid rgba(255,255,255,0.28)",
        ...style,
      }}
    >
      {/* inner glow bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: selected
            ? "radial-gradient(120% 100% at 50% 0%, rgba(168,71,43,0.18), transparent 60%)"
            : accent
            ? "radial-gradient(120% 100% at 50% 100%, rgba(168,71,43,0.10), transparent 65%)"
            : "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />
      <div className="relative h-full w-full">{children}</div>
    </motion.div>
  );
}