import { motion } from "framer-motion";

export default function ThankYouScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center gap-8"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-40 w-40 items-center justify-center rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 35%, rgba(var(--page-glow-rgb),0.25), rgba(var(--page-glow-rgb),0.05))",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 0 60px rgba(var(--page-glow-rgb),0.3), inset 0 1px 1px rgba(255,255,255,0.5)",
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl"
        >
          🍫
        </motion.span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#221e1a", textShadow: "0 1px 2px rgba(0,0,0,0.25), 0 1px 16px rgba(0,0,0,0.15)" }}
        >
          Thank you
        </h2>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] font-light uppercase tracking-[0.2em]"
          style={{ color: "#928a7d", textShadow: "0 1px 2px rgba(0,0,0,0.25), 0 1px 16px rgba(0,0,0,0.15)" }}
        >
          Starting next survey…
        </motion.span>
      </motion.div>
    </motion.div>
  );
}