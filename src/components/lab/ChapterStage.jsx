import { useRef, useState } from "react";
import { motion } from "motion/react";
import Chapter from "./Chapter";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { easeInOutExpo } from "@/lib/motion";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const FULL = (o) => `circle(150% at ${o.x}% ${o.y}%)`;
const NONE = (o) => `circle(0% at ${o.x}% ${o.y}%)`;
const pad = (n) => String(n).padStart(2, "0");

// Chips + a stage that switches between chapters with an iris-wipe growing out of the chip
// you clicked. Used by both the Lab (front end) and the Engine Room (back end).
//   chapters: [{ id, stamp, bg, fg, ... }]   demos: { [id]: Component }
//   explored: Set of chapter ids already tried   onExplore(id): called when a demo is used
export default function ChapterStage({
  chapters,
  demos,
  explored,
  onExplore,
  heightClass = "h-[900px] md:h-[600px]",
}) {
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(null); // chapter we're wiping away from (null = idle)
  const [origin, setOrigin] = useState({ x: 50, y: 0 });
  const [touched, setTouched] = useState(false); // skip the wipe on first paint

  const go = (i, e) => {
    if (i === index || prev !== null) return;
    const stage = stageRef.current.getBoundingClientRect();
    const chip = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: clamp(((chip.left + chip.width / 2 - stage.left) / stage.width) * 100, 0, 100),
      y: clamp(((chip.top + chip.height / 2 - stage.top) / stage.height) * 100, 0, 100),
    });
    setTouched(true);
    setPrev(index);
    setIndex(i);
  };

  const current = chapters[index];
  const layers = prev !== null ? [prev, index] : [index];
  const wipeDur = reduced ? 0.01 : 0.95;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {chapters.map((c, i) => {
          const active = i === index;
          return (
            <button
              key={c.id}
              type="button"
              onClick={(e) => go(i, e)}
              aria-pressed={active}
              className="rounded-full border px-4 py-2 font-mono text-xs transition-colors duration-300"
              style={
                active
                  ? { background: c.bg, color: c.fg, borderColor: c.bg }
                  : { borderColor: "#26262c", color: "#8b8b94" }
              }
            >
              {pad(i + 1)} {c.stamp}
              {explored.has(c.id) ? " ✓" : ""}
            </button>
          );
        })}
      </div>

      <div
        ref={stageRef}
        className={`relative overflow-hidden rounded-3xl ${heightClass}`}
        style={{ background: current.bg }}
      >
        {layers.map((i) => {
          const c = chapters[i];
          const isCurrent = i === index;
          return (
            <motion.div
              key={c.id}
              className="absolute inset-0"
              style={{ background: c.bg }}
              initial={isCurrent && touched ? { clipPath: NONE(origin) } : false}
              animate={{ clipPath: FULL(origin) }}
              transition={{ duration: wipeDur, ease: easeInOutExpo }}
              onAnimationComplete={isCurrent ? () => setPrev(null) : undefined}
            >
              <Chapter
                c={c}
                Demo={demos[c.id]}
                position={pad(i + 1)}
                total={chapters.length}
                onExplore={() => onExplore(c.id)}
              />
            </motion.div>
          );
        })}

        {/* Echo rings that ride the edge of the wipe */}
        {touched &&
          !reduced &&
          [0, 0.12].map((delay, k) => (
            <motion.span
              key={`${index}-${k}`}
              className="pointer-events-none absolute z-20 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
              style={{ left: `${origin.x}%`, top: `${origin.y}%`, borderColor: current.fg }}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 30, opacity: 0 }}
              transition={{ duration: 1.1, delay, ease: easeInOutExpo }}
            />
          ))}
      </div>
    </div>
  );
}
