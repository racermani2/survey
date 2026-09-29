/**
 * Simple SVG line-sketch garment icons.
 * Thin rounded strokes, one accent-colored line suggesting contrast piping.
 * Accent color is passed via currentColor on the .accent class.
 */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const accent = {
  ...base,
  strokeWidth: 2.2,
  style: { stroke: "rgb(var(--page-glow-rgb))" },
};

function Svg({ children, label }) {
  return (
    <svg viewBox="0 0 100 120" className="h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

export function ClassicCollaredIcon() {
  return (
    <Svg label="Classic collared shirt with full button placket">
      {/* shoulders + body */}
      <path {...base} d="M30 28 L20 40 L22 96 L78 96 L80 40 L70 28" />
      {/* collar */}
      <path {...base} d="M38 28 L42 36 L50 40 L58 36 L62 28" />
      <path {...base} d="M38 28 L42 36 L50 34 L58 36 L62 28" />
      {/* placket */}
      <line {...base} x1="50" y1="40" x2="50" y2="96" />
      {/* buttons */}
      <circle {...base} cx="50" cy="52" r="1.6" />
      <circle {...base} cx="50" cy="66" r="1.6" />
      <circle {...base} cx="50" cy="80" r="1.6" />
      {/* piping accent on collar */}
      <path {...accent} d="M42 36 L50 40 L58 36" />
    </Svg>
  );
}

export function CrewNeckIcon() {
  return (
    <Svg label="Crew neck tee, oversized fit">
      {/* oversized body */}
      <path {...base} d="M26 30 L14 44 L16 98 L84 98 L86 44 L74 30" />
      {/* crew neckline */}
      <path {...base} d="M40 30 Q50 38 60 30" />
      {/* sleeve hems */}
      <path {...base} d="M14 44 L26 44" />
      <path {...base} d="M74 44 L86 44" />
      {/* piping accent on neckline */}
      <path {...accent} d="M40 30 Q50 38 60 30" />
    </Svg>
  );
}

export function CollaredTwoButtonIcon() {
  return (
    <Svg label="Collared polo with open placket, two buttons">
      {/* body */}
      <path {...base} d="M30 28 L20 40 L22 96 L78 96 L80 40 L70 28" />
      {/* collar - open */}
      <path {...base} d="M38 28 L42 36 L46 34" />
      <path {...base} d="M62 28 L58 36 L54 34" />
      {/* open placket */}
      <path {...base} d="M46 34 L46 44" />
      <path {...base} d="M54 34 L54 44" />
      {/* two buttons */}
      <circle {...base} cx="50" cy="40" r="1.8" />
      <circle {...base} cx="50" cy="48" r="1.8" />
      {/* piping accent on collar */}
      <path {...accent} d="M42 36 L46 34" />
      <path {...accent} d="M58 36 L54 34" />
    </Svg>
  );
}

export function AnkleLengthIcon() {
  return (
    <Svg label="Ankle length pants">
      {/* waistband */}
      <path {...base} d="M28 24 L72 24 L74 32 L26 32 Z" />
      {/* legs to ankle */}
      <path {...base} d="M26 32 L28 104 L46 104 L48 32" />
      <path {...base} d="M74 32 L72 104 L54 104 L52 32" />
      {/* ankle hems */}
      <path {...base} d="M28 104 L46 104" />
      <path {...base} d="M54 104 L72 104" />
      {/* piping accent on side seam */}
      <line {...accent} x1="30" y1="34" x2="31" y2="100" />
      <line {...accent} x1="70" y1="34" x2="69" y2="100" />
    </Svg>
  );
}

export function ShortsIcon() {
  return (
    <Svg label="Shorts">
      {/* waistband */}
      <path {...base} d="M28 24 L72 24 L74 32 L26 32 Z" />
      {/* short legs */}
      <path {...base} d="M26 32 L28 64 L46 64 L48 32" />
      <path {...base} d="M74 32 L72 64 L54 64 L52 32" />
      {/* hem */}
      <path {...base} d="M28 64 L46 64" />
      <path {...base} d="M54 64 L72 64" />
      {/* piping accent on side seam */}
      <line {...accent} x1="30" y1="34" x2="31" y2="60" />
      <line {...accent} x1="70" y1="34" x2="69" y2="60" />
    </Svg>
  );
}

export function ThreeQuarterIcon() {
  return (
    <Svg label="Three quarter length pants">
      {/* waistband */}
      <path {...base} d="M28 24 L72 24 L74 32 L26 32 Z" />
      {/* legs to 3/4 */}
      <path {...base} d="M26 32 L30 78 L46 78 L48 32" />
      <path {...base} d="M74 32 L70 78 L54 78 L52 32" />
      {/* hems */}
      <path {...base} d="M30 78 L46 78" />
      <path {...base} d="M54 78 L70 78" />
      {/* piping accent on side seam */}
      <line {...accent} x1="30" y1="34" x2="32" y2="74" />
      <line {...accent} x1="70" y1="34" x2="68" y2="74" />
    </Svg>
  );
}

export function FullSleeveIcon() {
  return (
    <Svg label="Full sleeve">
      {/* shoulder */}
      <path {...base} d="M20 24 L44 24 L48 30" />
      {/* long sleeve arm */}
      <path {...base} d="M20 24 L12 60 L20 104 L34 102 L28 58 L48 30" />
      {/* cuff */}
      <path {...base} d="M20 104 L34 102" />
      {/* hand hint */}
      <path {...base} d="M20 104 Q27 110 34 102" />
      {/* piping accent on cuff */}
      <line {...accent} x1="20" y1="104" x2="34" y2="102" />
    </Svg>
  );
}

export function HalfSleeveIcon() {
  return (
    <Svg label="Half sleeve">
      {/* shoulder */}
      <path {...base} d="M20 24 L44 24 L48 30" />
      {/* short sleeve arm */}
      <path {...base} d="M20 24 L14 42 L22 48 L28 44 L48 30" />
      {/* sleeve hem */}
      <path {...base} d="M14 42 L22 48" />
      {/* forearm */}
      <path {...base} d="M22 48 L26 104 L36 104 L30 48" />
      {/* hand hint */}
      <path {...base} d="M26 104 Q31 110 36 104" />
      {/* piping accent on sleeve hem */}
      <line {...accent} x1="14" y1="42" x2="22" y2="48" />
    </Svg>
  );
}