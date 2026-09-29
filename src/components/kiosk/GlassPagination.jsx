import JellyRadio from "@/components/JellyRadio";

/**
 * Glass pagination circles — non-interactive progress indicator.
 * Uses JellyRadio with interactive={false} so chips can't be tapped to skip.
 * Circular chips (radius 999) with glass styling and spring-physics bounce.
 */
export default function GlassPagination({ total, current }) {
  const items = Array.from({ length: total }, (_, i) => ({
    value: String(i),
    label: String(i + 1),
  }));

  return (
    <JellyRadio
      items={items}
      value={String(current)}
      interactive={false}
      size="lg"
      gap={12}
      radius={999}
      swell={0.12}
      barge={4}
      bounce={0.35}
      jelly={1}
      chipColor="rgba(255,255,255,0.12)"
      activeColor="rgba(255,255,255,0.35)"
      textColor="rgba(26,26,26,0.5)"
      activeTextColor="#1a1a1a"
      chipClassName="text-shadow-fog w-[44px] !px-0 border border-white/40 data-[on=true]:border-white/60 [backdrop-filter:blur(12px)] [-webkit-backdrop-filter:blur(12px)]"
    />
  );
}