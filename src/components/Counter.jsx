import { useEffect, useRef, useState } from "react";

/**
 * Rolling-digit counter. Each place is a vertical strip of 0–9 that
 * translates upward to the current digit. Only `transform` is animated.
 */
function DigitColumn({ digit, fontSize, fontWeight, textColor, blank = false }) {
  const [mounted, setMounted] = useState(false);
  const innerRef = useRef(null);

  useEffect(() => {
    // mount first, then set transform so the initial roll animates from 0
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div
      style={{
        overflow: "hidden",
        height: "1em",
        width: "0.62em",
        fontSize,
        fontWeight,
        color: textColor,
        lineHeight: "1em",
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum"',
      }}
    >
      <div
        ref={innerRef}
        style={{
          transform: mounted ? `translateY(-${digit}em)` : "translateY(0)",
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
          visibility: blank ? "hidden" : "visible",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <div key={d} style={{ height: "1em", lineHeight: "1em" }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Counter({
  value = 0,
  places,
  fontSize = 42,
  fontWeight = 800,
  gap = 2,
  padding = 4,
  textColor = "#a8472b",
  gradientFrom = "#ffffff",
  gradientTo = "transparent",
  digitPlaceHolders = true,
}) {
  const clamped = Math.max(0, Math.min(value, 999));
  // Auto-detect places from value when not explicitly provided
  const effectivePlaces = places ?? (
    clamped >= 100 ? [100, 10, 1] :
    clamped >= 10 ? [10, 1] : [1]
  );
  const digits = effectivePlaces.map((p) => Math.floor(clamped / p) % 10);

  // When placeholders are off, blank out leading zeros (keep at least the last digit)
  const blanks = digitPlaceHolders
    ? digits.map(() => false)
    : digits.map((d, i) => {
        const isLeading = digits.slice(0, i).every((x) => x === 0);
        return d === 0 && isLeading && i < digits.length - 1;
      });

  const mask = `linear-gradient(to bottom, ${gradientTo} 0%, ${gradientFrom} 22%, ${gradientFrom} 78%, ${gradientTo} 100%)`;

  return (
    <div
      style={{
        display: "inline-flex",
        gap,
        padding,
        WebkitMaskImage: mask,
        maskImage: mask,
        lineHeight: 1,
      }}
    >
      {digits.map((d, i) => (
        <DigitColumn
          key={i}
          digit={d}
          fontSize={fontSize}
          fontWeight={fontWeight}
          textColor={textColor}
          blank={blanks[i]}
        />
      ))}
    </div>
  );
}