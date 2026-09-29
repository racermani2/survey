import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllResponses, getTallies, clearAllResponses } from "@/lib/surveyStorage";
import { exportCSV, exportJSON } from "@/lib/exporters";
import Counter from "@/components/Counter";

const LABELS = {
  top: {
    classic_collared: "Classic Collared",
    crew_neck: "Crew Neck Tee",
    collared_two_button: "Collared, two-button",
  },
  bottom: {
    ankle: "Ankle length",
    shorts: "Shorts",
    three_quarter: "3/4th length",
  },
  sleeve: {
    full: "Full sleeve",
    half: "Half sleeve",
  },
  age: {
    "14-17": "14–17",
    "18-24": "18–24",
    "25-32": "25–32",
    "33-40": "33–40",
    "40plus": "40+",
  },
};

function TallyRow({ label, counts, total }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#928a7d" }}>
        {label}
      </span>
      <div className="flex flex-col gap-1.5">
        {entries.length === 0 && (
          <span className="text-sm font-light" style={{ color: "#928a7d" }}>
            No data yet
          </span>
        )}
        {entries.map(([key, count]) => {
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
          const display = LABELS[label.toLowerCase()]?.[key] || key;
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-40 text-sm font-medium" style={{ color: "#221e1a" }}>
                {display}
              </span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(34,30,26,0.08)" }}>
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ width: `${pct}%`, background: "#a8472b" }}
                />
              </div>
              <span className="w-16 text-right text-sm font-semibold tabular-nums" style={{ color: "#221e1a" }}>
                {count} · {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StaffView({ onClose }) {
  const [tallies, setTallies] = useState(() => getTallies());
  const [responses, setResponses] = useState(() => getAllResponses());

  const refresh = () => {
    setTallies(getTallies());
    setResponses(getAllResponses());
  };

  useEffect(() => {
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = () => {
    if (window.confirm("Delete ALL responses? This cannot be undone.")) {
      clearAllResponses();
      refresh();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(23,19,16,0.55)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full max-w-2xl flex-col gap-6 p-8"
        style={{
          borderRadius: 32,
          background: "rgba(242,237,227,0.92)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight" style={{ color: "#221e1a" }}>
              Staff View
            </h2>
            <div className="flex items-end gap-3">
              <Counter
                value={responses.length}
                places={[100, 10, 1]}
                fontSize={42}
                fontWeight={800}
                gap={2}
                padding={4}
                textColor="#a8472b"
                gradientFrom="#ffffff"
                gradientTo="transparent"
              />
              <div style={{ fontSize: 12, letterSpacing: "0.04em", color: "#928a7d", textTransform: "uppercase", marginBottom: 4 }}>
                People surveyed
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-semibold"
            style={{ background: "rgba(34,30,26,0.08)", color: "#221e1a" }}
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <TallyRow label="Top" counts={tallies.top} total={tallies.total} />
          <TallyRow label="Bottom" counts={tallies.bottom} total={tallies.total} />
          <TallyRow label="Sleeve" counts={tallies.sleeve} total={tallies.total} />
          <TallyRow label="Age" counts={tallies.age} total={tallies.total} />
        </div>

        <div className="flex flex-wrap gap-3 border-t pt-5" style={{ borderColor: "rgba(34,30,26,0.1)" }}>
          <button
            onClick={() => exportCSV(responses)}
            className="flex-1 rounded-2xl px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "#a8472b" }}
          >
            Export CSV
          </button>
          <button
            onClick={() => exportJSON(responses)}
            className="flex-1 rounded-2xl px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "#221e1a" }}
          >
            Export JSON
          </button>
          <button
            onClick={handleClear}
            className="rounded-2xl px-5 py-3 text-sm font-semibold"
            style={{ background: "rgba(34,30,26,0.08)", color: "#221e1a" }}
          >
            Clear all
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}