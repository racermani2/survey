import { useEffect, useRef } from "react";

// one palette per QUESTION TYPE, not per page number — this matters because the
// sleeve question is skipped for Crew Neck, so page count varies (3 or 4 pages)
const PALETTES = {
  top: { highlightColor: 0x6fa7e8, midtoneColor: 0x2a80b9, lowlightColor: 0x08154a, baseColor: 0xf6ebe4 }, // Blue Raspberry Burst
  bottom: { highlightColor: 0xf4d03f, midtoneColor: 0xe67e22, lowlightColor: 0x872105, baseColor: 0xf6ebe4 }, // Mango Citrus Splash
  sleeve: { highlightColor: 0xf1948a, midtoneColor: 0xd24a75, lowlightColor: 0x64112c, baseColor: 0xf6ebe4 }, // Peach Strawberry Rush
  age: { highlightColor: 0xbb8fce, midtoneColor: 0x8e44ad, lowlightColor: 0x4a235a, baseColor: 0xf6ebe4 }, // Grape Berry Velvet
  thanks: { highlightColor: 0xbb8fce, midtoneColor: 0x8e44ad, lowlightColor: 0x4a235a, baseColor: 0xf6ebe4 }, // stays on last palette
};

function hexToRgb(hex) { return { r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255 }; }
function rgbToHex({ r, g, b }) { return (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b); }
function lerpRgb(a, b, t) { return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t }; }
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function hexToCss(hex) { const r = (hex >> 16) & 255, g = (hex >> 8) & 255, b = hex & 255; return `rgb(${r}, ${g}, ${b})`; }
function hexToRgbString(hex) { return `${(hex >> 16) & 255}, ${(hex >> 8) & 255}, ${hex & 255}`; }

// manually tweens the colors frame-by-frame — Vanta has no built-in transition
function crossfadeVanta(effect, from, to, duration = 750) {
  const start = performance.now();
  function tick(now) {
    const t = easeInOutCubic(Math.min(1, (now - start) / duration));
    const highlightColor = rgbToHex(lerpRgb(hexToRgb(from.highlightColor), hexToRgb(to.highlightColor), t));
    const midtoneColor = rgbToHex(lerpRgb(hexToRgb(from.midtoneColor), hexToRgb(to.midtoneColor), t));
    effect.setOptions({
      highlightColor,
      midtoneColor,
      lowlightColor: rgbToHex(lerpRgb(hexToRgb(from.lowlightColor), hexToRgb(to.lowlightColor), t)),
      baseColor: rgbToHex(lerpRgb(hexToRgb(from.baseColor), hexToRgb(to.baseColor), t)),
    });
    document.documentElement.style.setProperty("--accent-glow", hexToCss(highlightColor));
    document.documentElement.style.setProperty("--page-glow-rgb", hexToRgbString(midtoneColor));
    document.documentElement.style.setProperty("--logo-rgb", hexToRgbString(midtoneColor));
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export default function VantaBackground({ screen }) {
  const elRef = useRef(null);
  const effectRef = useRef(null);
  const prevScreen = useRef(screen);

  // map the kiosk "thankyou" screen to the "thanks" palette key
  const paletteKey = screen === "thankyou" ? "thanks" : screen;

  useEffect(() => {
    // Set glow variables immediately on first mount — before Vanta loads —
    // so the first frame uses the correct palette, not the CSS fallback.
    document.documentElement.style.setProperty("--accent-glow", hexToCss(PALETTES[paletteKey].highlightColor));
    document.documentElement.style.setProperty("--page-glow-rgb", hexToRgbString(PALETTES[paletteKey].midtoneColor));
    document.documentElement.style.setProperty("--logo-rgb", hexToRgbString(PALETTES[paletteKey].midtoneColor));

    if (effectRef.current || !window.VANTA) return; // guard against double-init in dev
    effectRef.current = window.VANTA.FOG({
      el: elRef.current,
      mouseControls: false, // kiosk: no cursor, avoid stray-touch distortion
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      blurFactor: 0.73,
      speed: 1.1,
      zoom: 0.3,
      backgroundAlpha: 1,
      ...PALETTES[paletteKey],
    });
    return () => { effectRef.current?.destroy(); effectRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!effectRef.current || prevScreen.current === screen) return;
    const prevKey = prevScreen.current === "thankyou" ? "thanks" : prevScreen.current;
    crossfadeVanta(effectRef.current, PALETTES[prevKey], PALETTES[paletteKey]);
    prevScreen.current = screen;
  }, [screen, paletteKey]);

  return <div ref={elRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} />;
}