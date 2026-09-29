import { motion } from "framer-motion";

const ENTER = [0.16, 1, 0.3, 1];

/**
 * Square glass tile (icon only) + solid black pill button below it.
 * Shadow uses --accent-glow CSS var so it crossfades with the Vanta palette.
 * Clicking either the tile or the pill selects the option.
 */
export default function TileOption({ icon, label, selected, onTap, delay = 0 }) {
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <motion.button
        type="button"
        onClick={onTap}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={
          selected
            ? { opacity: 1, y: 0, scale: [1, 1.03, 1] }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={
          selected
            ? {
                scale: { duration: 0.4, times: [0, 0.4, 1], ease: ENTER },
                opacity: { duration: 0.2 },
                y: { duration: 0.2 },
              }
            : { duration: 0.4, delay, ease: ENTER }
        }
        whileHover={selected ? undefined : { scale: 1.02 }}
        whileTap={selected ? undefined : { scale: 0.98 }}
        className="relative flex w-full items-center justify-center overflow-hidden"
        style={{
          aspectRatio: "1 / 1",
          borderRadius: 40,
          background: "rgba(255,255,255,0.4)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: selected
            ? "0 24px 60px -12px color-mix(in srgb, var(--accent-glow) 65%, transparent), 0 0 0 2px color-mix(in srgb, var(--accent-glow) 40%, transparent)"
            : "0 24px 60px -12px color-mix(in srgb, var(--accent-glow) 45%, transparent)",
          willChange: "transform",
        }}
      >
        <div style={{ width: "55%", height: "55%", color: "#1a1a1a" }}>
          {icon}
        </div>
      </motion.button>

      <motion.button
        type="button"
        onClick={onTap}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.1, ease: ENTER }}
        className="flex items-center justify-center rounded-full"
        style={{
          width: "80%",
          maxWidth: 220,
          height: 64,
          background: "#1a1a1a",
          color: "#ffffff",
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 22,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </motion.button>
    </div>
  );
}