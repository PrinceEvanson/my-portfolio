import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";

const GLYPHS = "!<>-_\\/[]{}=+*^?#%&";
const EFFECTS = [
  { id: "wave", label: "Wave" },
  { id: "spin", label: "Flip" },
  { id: "explode", label: "Explode" },
  { id: "scramble", label: "Decode" },
];

// Letters are replaced by random glyphs, then resolve left to right.
function Scramble({ text }) {
  const [out, setOut] = useState("");

  useEffect(() => {
    const total = 24;
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      const reveal = Math.floor((frame / total) * text.length);
      setOut(
        [...text]
          .map((ch, i) =>
            ch === " " || i < reveal ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
      );
      if (frame >= total) {
        clearInterval(id);
        setOut(text);
      }
    }, 35);
    return () => clearInterval(id);
  }, [text]);

  return <span>{out || text}</span>;
}

export default function TypeDemo({ fg, onExplore }) {
  const [text, setText] = useState("Make it move");
  const [effect, setEffect] = useState(null);
  const [run, setRun] = useState(0);

  const letters = useMemo(() => [...text], [text]);
  // Random start positions for "Explode", re-rolled on every press.
  const scatter = useMemo(
    () =>
      letters.map(() => ({
        x: (Math.random() - 0.5) * 380,
        y: (Math.random() - 0.5) * 260,
        r: (Math.random() - 0.5) * 540,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [letters.length, run]
  );

  const play = (id) => {
    setEffect(id);
    setRun((r) => r + 1);
    onExplore();
  };

  const letterProps = (i) => {
    switch (effect) {
      case "wave":
        return {
          initial: { y: 0 },
          animate: { y: [0, -36, 0] },
          transition: { duration: 0.8, delay: i * 0.05, ease: easeOutExpo },
        };
      case "spin":
        return {
          initial: { rotateX: -110, opacity: 0 },
          animate: { rotateX: 0, opacity: 1 },
          transition: { duration: 0.9, delay: i * 0.05, ease: easeOutExpo },
        };
      case "explode":
        return {
          initial: { x: scatter[i].x, y: scatter[i].y, rotate: scatter[i].r, opacity: 0 },
          animate: { x: 0, y: 0, rotate: 0, opacity: 1 },
          transition: { type: "spring", stiffness: 110, damping: 12, delay: i * 0.02 },
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div
        className="flex min-h-[160px] flex-1 items-center justify-center overflow-hidden rounded-xl px-2 text-center text-5xl font-bold leading-tight tracking-tighter md:text-6xl"
        style={{ border: `1px dashed ${fg}55`, perspective: 700 }}
      >
        <div key={run} className="break-words">
          {effect === "scramble" ? (
            <Scramble text={text} />
          ) : (
            letters.map((ch, i) => (
              <motion.span key={i} className="inline-block" {...letterProps(i)}>
                {ch === " " ? " " : ch}
              </motion.span>
            ))
          )}
        </div>
      </div>

      <input
        value={text}
        maxLength={18}
        onChange={(e) => setText(e.target.value)}
        aria-label="Text to animate"
        className="rounded-lg bg-transparent px-4 py-3 font-mono text-sm outline-none"
        style={{ border: `1px solid ${fg}66`, color: fg }}
      />

      <div className="grid grid-cols-4 gap-2 font-mono text-xs">
        {EFFECTS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => play(e.id)}
            className="rounded-lg px-2 py-3 font-medium transition-transform duration-200 hover:-translate-y-0.5"
            style={
              effect === e.id
                ? { background: fg, color: "#0a0a0b" }
                : { border: `1px solid ${fg}66`, color: fg }
            }
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}
