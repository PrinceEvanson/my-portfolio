import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const BALL = 44;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Damping ratio -> a human word for how the spring feels.
const feel = (k, c) => {
  const z = c / (2 * Math.sqrt(k));
  return z < 0.3 ? "Wobbly" : z < 0.6 ? "Bouncy" : z < 1 ? "Snappy" : "Heavy";
};

// Click anywhere: a chain of balls springs to that point. Sliders change the spring itself.
export default function PhysicsDemo({ fg, onExplore }) {
  const arena = useRef(null);
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const [stiffness, setStiffness] = useState(180);
  const [damping, setDamping] = useState(12);
  const [shots, setShots] = useState(0);

  // Start in the middle (the balls fly in from the corner on first paint).
  useEffect(() => {
    const r = arena.current.getBoundingClientRect();
    setTarget({ x: r.width / 2 - BALL / 2, y: r.height / 2 - BALL / 2 });
  }, []);

  const aim = (e) => {
    const r = arena.current.getBoundingClientRect();
    setTarget({
      x: clamp(e.clientX - r.left - BALL / 2, 0, r.width - BALL),
      y: clamp(e.clientY - r.top - BALL / 2, 0, r.height - BALL),
    });
    setShots((s) => s + 1);
    onExplore();
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div
        ref={arena}
        onClick={aim}
        className="relative min-h-[200px] flex-1 cursor-crosshair overflow-hidden rounded-xl"
        style={{ border: `1px dashed ${fg}55` }}
      >
        {shots === 0 && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-xs opacity-60">
            click anywhere
          </p>
        )}
        {[1, 0.6, 0.36, 0.2].map((k, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute left-0 top-0 rounded-full"
            style={{
              width: BALL,
              height: BALL,
              background: fg,
              opacity: 1 - i * 0.2,
              zIndex: 10 - i,
            }}
            animate={{ x: target.x, y: target.y, scale: 1 - i * 0.12 }}
            transition={{
              type: "spring",
              stiffness: stiffness * k,
              damping: Math.max(2, damping * Math.sqrt(k)),
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <label className="flex flex-col gap-1">
          Stiffness {stiffness}
          <input
            type="range"
            min="40"
            max="600"
            value={stiffness}
            onChange={(e) => {
              setStiffness(Number(e.target.value));
              onExplore();
            }}
            style={{ accentColor: fg }}
          />
        </label>
        <label className="flex flex-col gap-1">
          Damping {damping}
          <input
            type="range"
            min="2"
            max="40"
            value={damping}
            onChange={(e) => {
              setDamping(Number(e.target.value));
              onExplore();
            }}
            style={{ accentColor: fg }}
          />
        </label>
      </div>
      <p className="font-mono text-xs opacity-70">
        Feel: <b>{feel(stiffness, damping)}</b>
      </p>
    </div>
  );
}
