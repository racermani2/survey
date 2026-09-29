import { motion } from "framer-motion";
import { useState } from "react";

const ENTER = [0.16, 1, 0.3, 1];

/**
 * A single forced-choice option card with real liquid-glass treatment.
 * On tap: overshoots to ~1.03 then settles back to 1.0 (physical bounce-back).
 * Selected glow uses --page-glow-rgb so it matches the active Vanta palette.
 * Image prop: if provided, shows a product photo with the SVG icon as fallback.
 */
export default function OptionCard({ icon, label, sublabel, image, selected, onTap, delay = 0 }) {
  const [imgError, setImgError] = useState(false);

  const glassBackground = `
    linear-gradient(rgba(255,255,255,0.42), rgba(255,255,255,0.42)) padding-box,
    linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0.02) 100%) border-box
  `;

  const restShadow =
    "inset 0 1px 0 rgba(255,255,255,0.4), 0 12px 36px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)";
  const selectedShadow =
    "inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 1px rgba(var(--page-glow-rgb), 0.3), 0 0 60px rgba(var(--page-glow-rgb), 0.35), 0 16px 50px rgba(var(--page-glow-rgb), 0.2), 0 8px 24px rgba(0,0,0,0.12)";
  const hoverShadow =
    "inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 30px rgba(0,0,0,0.1), 0 0 28px rgba(var(--page-glow-rgb), 0.08)";

  return (
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
      className="group relative flex w-full flex-col items-center overflow-hidden px-6 pb-6 pt-7 text-left"
      style={{
        borderRadius: 30,
        aspectRatio: "3 / 4",
        background: glassBackground,
        border: "1px solid transparent",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        boxShadow: selected ? selectedShadow : restShadow,
        willChange: "transform",
      }}
    >
      {/* inner glow bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: selected
            ? "radial-gradient(120% 90% at 50% 20%, rgba(var(--page-glow-rgb), 0.22), transparent 65%)"
            : "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />

      {/* icon / image area — flex-1 so label sits at the same height on every card */}
      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
        {image && !imgError ? (
          <img
            src={image}
            alt={label}
            onError={() => setImgError(true)}
            style={{
              maxHeight: "100%",
              maxWidth: "82%",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <div
            className="flex h-full max-h-[150px] w-full items-center justify-center"
            style={{ color: "#221e1a" }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* label area — fixed at bottom, same vertical position on every card */}
      <div className="relative flex flex-col items-center gap-1.5 pt-5">
        <span
          className="text-center text-[17px] font-semibold leading-tight"
          style={{ color: "#221e1a", textShadow: "0 1px 2px rgba(0,0,0,0.25), 0 1px 16px rgba(0,0,0,0.15)" }}
        >
          {label}
        </span>
        {sublabel && (
          <span
            className="text-[10px] font-light uppercase tracking-[0.18em]"
            style={{ color: "#928a7d", textShadow: "0 1px 2px rgba(0,0,0,0.25), 0 1px 16px rgba(0,0,0,0.15)" }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </motion.button>
  );
}