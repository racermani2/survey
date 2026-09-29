import { motion } from "framer-motion";

/**
 * Persistent glass "chrome" element — the one place glass treatment is bold.
 * Shows brand label.
 * Tap the header 5x to open the staff view.
 */
export default function HeaderBar({ onSecretTap }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-1/2 top-4 z-30 w-[min(920px,calc(100vw-2rem))] -translate-x-1/2"
      onClick={onSecretTap}
    >
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          borderRadius: 24,
          background: `
            linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)) padding-box,
            linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.03) 100%) border-box
          `,
          border: "1px solid transparent",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 30px rgba(168,71,43,0.08), 0 2px 8px rgba(74,32,21,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#221e1a" }}
          >
            Maren
          </span>
          <span className="text-[11px] font-light uppercase tracking-[0.22em]" style={{ color: "#928a7d" }}>
            · Pre-launch
          </span>
        </div>
      </div>
    </motion.header>
  );
}