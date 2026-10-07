import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import VantaBackground from "@/components/VantaBackground";
import OptionCard from "@/components/kiosk/OptionCard";
import ThankYouScreen from "@/components/kiosk/ThankYouScreen";
import StaffView from "@/components/kiosk/StaffView";
import GlassPagination from "@/components/kiosk/GlassPagination";
import Counter from "@/components/Counter";
import Logo from "@/components/kiosk/Logo";
import { saveResponse, getAllResponses } from "@/lib/surveyStorage";
import {
  ClassicCollaredIcon,
  CrewNeckIcon,
  CollaredTwoButtonIcon,
  AnkleLengthIcon,
  ShortsIcon,
  ThreeQuarterIcon,
  FullSleeveIcon,
  HalfSleeveIcon,
} from "@/components/kiosk/GarmentIcons";

const SCREENS = [
  { key: "top", label: "Top" },
  { key: "bottom", label: "Bottom" },
  { key: "sleeve", label: "Sleeve" },
  { key: "age", label: "Age" },
];

const CLASSIC_COLLARED_IMG = "https://media.base44.com/images/public/6ab9370302b206e05eb4eac9/7918cd761_top-classic-collared.webp";

const TOP_OPTIONS = [
  { value: "classic_collared", label: "Classic Collared", sublabel: "Full button placket", Icon: ClassicCollaredIcon, image: CLASSIC_COLLARED_IMG },
  { value: "crew_neck", label: "Crew Neck Tee", sublabel: "Oversized fit", Icon: CrewNeckIcon, image: "https://media.base44.com/images/public/6ab9370302b206e05eb4eac9/bdcf7cb3e_top-crew-neck.webp" },
  { value: "collared_two_button", label: "Collared, two-button", sublabel: "Open placket · polo", Icon: CollaredTwoButtonIcon, image: "https://media.base44.com/images/public/6ab9370302b206e05eb4eac9/b915ed331_top-collared-two-button.webp" },
];

const BOTTOM_OPTIONS = [
  { value: "ankle", label: "Ankle length", sublabel: "Full length", Icon: AnkleLengthIcon, image: "https://media.base44.com/images/public/6ab9370302b206e05eb4eac9/d50e7d616_bottom-ankle.webp" },
  { value: "shorts", label: "Shorts", sublabel: "Above knee", Icon: ShortsIcon, image: "https://media.base44.com/images/public/6ab9370302b206e05eb4eac9/0b827bf4c_bottom-shorts.webp" },
  { value: "three_quarter", label: "3/4th length", sublabel: "Cropped", Icon: ThreeQuarterIcon, image: "https://media.base44.com/images/public/6ab9370302b206e05eb4eac9/0e52a0d8d_bottom-three-quarter.webp" },
];

const SLEEVE_OPTIONS = [
  { value: "full", label: "Full sleeve", sublabel: "Long", Icon: FullSleeveIcon, image: "https://media.base44.com/images/public/6ab9370302b206e05eb4eac9/ff4d956b1_sleeve-full.webp" },
  { value: "half", label: "Half sleeve", sublabel: "Short", Icon: HalfSleeveIcon, image: CLASSIC_COLLARED_IMG },
];

const AGE_OPTIONS = [
  { value: "14-17", label: "14–17" },
  { value: "18-24", label: "18–24" },
  { value: "25-32", label: "25–32" },
  { value: "33-40", label: "33–40" },
  { value: "40plus", label: "40+" },
];

const SERIF = "Georgia, 'Times New Roman', serif";
const ENTER = [0.16, 1, 0.3, 1];
const EXIT = [0.7, 0, 0.84, 0];

export default function Kiosk() {
  const [screen, setScreen] = useState("top");
  const [responses, setResponses] = useState({});
  const [selectedValue, setSelectedValue] = useState(null);
  const [staffOpen, setStaffOpen] = useState(false);
  const [responseCount, setResponseCount] = useState(() => getAllResponses().length);
  const [counterKey, setCounterKey] = useState(0);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  // Determine active steps (sleeve is conditional)
  const sleeveActive = responses.top === "classic_collared" || responses.top === "collared_two_button";
  const activeSteps = sleeveActive
    ? SCREENS
    : SCREENS.filter((s) => s.key !== "sleeve");

  const currentIndex = activeSteps.findIndex((s) => s.key === screen);
  // Before top is chosen, assume 4 steps for the progress bar
  const displaySteps = responses.top ? activeSteps : SCREENS;
  const displayIndex = displaySteps.findIndex((s) => s.key === screen);

  const handleHeaderTap = useCallback(() => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 1500);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setStaffOpen(true);
    }
  }, []);

  const advance = useCallback(
    (value) => {
      const newResponses = { ...responses, [screen]: value };
      setResponses(newResponses);
      setSelectedValue(value);

      // determine next screen after a brief confirmation
      setTimeout(() => {
        let next;
        if (screen === "top") next = "bottom";
        else if (screen === "bottom") {
          next =
            newResponses.top === "crew_neck" ? "age" : "sleeve";
        } else if (screen === "sleeve") next = "age";
        else if (screen === "age") {
          // save and go to thank you
          saveResponse(newResponses);
          next = "thankyou";
        } else next = "thankyou";

        setSelectedValue(null);
        setScreen(next);

        // auto-reset from thank you
        if (next === "thankyou") {
          setTimeout(() => {
            setScreen("top");
            setResponses({});
            setResponseCount(getAllResponses().length);
            setCounterKey((k) => k + 1);
          }, 4000);
        }
      }, 240);
    },
    [screen, responses]
  );

  const goBack = useCallback(() => {
    let prev;
    if (screen === "bottom") prev = "top";
    else if (screen === "sleeve") prev = "bottom";
    else if (screen === "age") prev = sleeveActive ? "sleeve" : "bottom";
    else return;
    setSelectedValue(responses[prev] || null);
    setScreen(prev);
  }, [screen, responses, sleeveActive]);

  const renderScreen = () => {
    if (screen === "thankyou") {
      return (
        <div key="thankyou" className="flex items-center justify-center">
          <ThankYouScreen />
        </div>
      );
    }

    let options = [];
    let heading = null;
    let stepLabel = "";

    if (screen === "top") {
      options = TOP_OPTIONS;
      stepLabel = "Step 1 of 4 · Top style";
      heading = (
        <>
          Which top would you{" "}
          <em style={{ fontFamily: SERIF, fontWeight: 400 }} className="italic">
            wear
          </em>
          ?
        </>
      );
    } else if (screen === "bottom") {
      options = BOTTOM_OPTIONS;
      stepLabel = "Step 2 of 4 · Bottom style";
      heading = (
        <>
          Which bottom{" "}
          <em style={{ fontFamily: SERIF, fontWeight: 400 }} className="italic">
            fit
          </em>
          ?
        </>
      );
    } else if (screen === "sleeve") {
      options = SLEEVE_OPTIONS;
      stepLabel = "Step 3 of 4 · Sleeve";
      heading = (
        <>
          Full or{" "}
          <em style={{ fontFamily: SERIF, fontWeight: 400 }} className="italic">
            half
          </em>{" "}
          sleeve?
        </>
      );
    } else if (screen === "age") {
      stepLabel = sleeveActive ? "Step 4 of 4 · Age" : "Step 3 of 3 · Age";
      heading = (
        <>
          What's your{" "}
          <em style={{ fontFamily: SERIF, fontWeight: 400 }} className="italic">
            age
          </em>
          ?
        </>
      );
    }

    return (
      <div key={screen} className="flex w-full flex-col items-center gap-8">
        {/* eyebrow step label */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: ENTER }}
          className="text-on-fog text-[11px] font-light uppercase tracking-[0.24em]"
          style={{ color: "#928a7d" }}
        >
          {stepLabel}
        </motion.span>

        {/* heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: ENTER }}
          className="text-on-fog text-center text-[clamp(28px,5vw,42px)] font-bold leading-[1.1] tracking-tight"
          style={{ color: "#221e1a" }}
        >
          {heading}
        </motion.h2>

        {/* option cards */}
        {screen === "age" ? (
          <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3">
            {AGE_OPTIONS.map((opt, i) => (
              <AgeOption
                key={opt.value}
                label={opt.label}
                delay={0.2 + i * 0.05}
                selected={selectedValue === opt.value}
                onTap={() => advance(opt.value)}
              />
            ))}
            <div className="hidden sm:block" />
          </div>
        ) : screen === "sleeve" ? (
          <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            {options.map((opt, i) => (
              <OptionCard
                key={opt.value}
                icon={<opt.Icon />}
                image={opt.image}
                imageMaxWidth={opt.value === "half" ? "80%" : "92%"}
                label={opt.label}
                sublabel={opt.sublabel}
                delay={0.2 + i * 0.05}
                selected={selectedValue === opt.value}
                onTap={() => advance(opt.value)}
              />
            ))}
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {options.map((opt, i) => (
              <OptionCard
                key={opt.value}
                icon={<opt.Icon />}
                image={opt.image}
                label={opt.label}
                sublabel={opt.sublabel}
                delay={0.2 + i * 0.05}
                selected={selectedValue === opt.value}
                onTap={() => advance(opt.value)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      <VantaBackground screen={screen} />

      {/* Counter pill — true left edge of viewport, respecting safe-area insets */}
      <div
        className="absolute z-20 flex items-center justify-center rounded-full px-3.5 py-1.5"
        style={{
          top: "calc(1.5rem + env(safe-area-inset-top))",
          left: "calc(1.5rem + env(safe-area-inset-left))",
          width: "fit-content",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        }}
      >
        <Counter
          key={counterKey}
          value={responseCount}
          fontSize={18}
          fontWeight={800}
          gap={1}
          padding={0}
          textColor="#1a1a1a"
          digitPlaceHolders={false}
        />
      </div>

      {/* ONE shared container — centered in viewport */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col px-6">
        {/* Header row — logo center */}
        <div className="flex shrink-0 items-center justify-center pt-6 pb-2">
          <div onClick={handleHeaderTap}>
            <Logo
              className="logo"
              style={{
                height: "clamp(36px, 6vw, 56px)",
                width: "auto",
              }}
            />
          </div>
        </div>

        {/* Main content — vertically centered between header and footer */}
        <main className="flex flex-1 flex-col items-center justify-center py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.25, ease: ENTER } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25, ease: EXIT } }}
              className="w-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer row — pagination center */}
        <div className="flex shrink-0 items-center justify-center pb-6 pt-2">
          {screen !== "thankyou" && (
            <GlassPagination
              total={displaySteps.length}
              current={displayIndex === -1 ? displaySteps.length - 1 : displayIndex}
            />
          )}
        </div>
      </div>

      {/* Back button — true left edge of viewport, respecting safe-area insets */}
      {screen !== "top" && screen !== "thankyou" && (
        <button
          type="button"
          onClick={goBack}
          className="absolute z-20 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
          style={{
            bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            left: "calc(1.5rem + env(safe-area-inset-left))",
            background:
              "linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)) padding-box, linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.03) 100%) border-box",
            border: "1px solid transparent",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            color: "#221e1a",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 30px rgba(var(--page-glow-rgb), 0.08)",
            textShadow: "0 1px 2px rgba(0,0,0,0.25), 0 1px 16px rgba(0,0,0,0.15)",
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}

      <AnimatePresence>
        {staffOpen && <StaffView onClose={() => setStaffOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AgeOption({ label, delay = 0, selected, onTap }) {
  const glassBackground = `
    linear-gradient(rgba(255,255,255,0.42), rgba(255,255,255,0.42)) padding-box,
    linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0.02) 100%) border-box
  `;
  const restShadow =
    "inset 0 1px 0 rgba(255,255,255,0.4), 0 12px 36px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)";
  const selectedShadow =
    "inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 1px rgba(var(--page-glow-rgb), 0.3), 0 0 50px rgba(var(--page-glow-rgb), 0.35), 0 12px 40px rgba(var(--page-glow-rgb), 0.18), 0 6px 20px rgba(0,0,0,0.1)";
  const hoverShadow =
    "inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 30px rgba(0,0,0,0.1), 0 0 24px rgba(var(--page-glow-rgb), 0.1)";

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
      whileHover={selected ? undefined : { scale: 1.02, boxShadow: hoverShadow }}
      whileTap={selected ? undefined : { scale: 0.98 }}
      className="relative flex items-center justify-center overflow-hidden px-6 py-10"
      style={{
        borderRadius: 28,
        minHeight: 88,
        background: glassBackground,
        border: "1px solid transparent",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        boxShadow: selected ? selectedShadow : restShadow,
        willChange: "transform",
      }}
    >
      <span
        className="relative text-2xl font-bold tracking-tight"
        style={{ color: "#221e1a", textShadow: "0 1px 2px rgba(0,0,0,0.25), 0 1px 16px rgba(0,0,0,0.15)" }}
      >
        {label}
      </span>
    </motion.button>
  );
}