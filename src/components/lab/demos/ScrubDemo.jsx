import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";

const DOTS = 6;

// One number (0-100) drives every property of the scene. Drag it, or let it play.
export default function ScrubDemo({ fg, onExplore }) {
  const [pct, setPct] = useState(0);
  const controls = useRef(null);

  useEffect(() => () => controls.current?.stop(), []);

  const play = () => {
    controls.current?.stop();
    onExplore();
    const to = pct >= 100 ? 0 : 100;
    controls.current = animate(pct, to, {
      duration: 3.2 * (Math.abs(to - pct) / 100) + 0.4,
      ease: "easeInOut",
      onUpdate: (v) => setPct(Math.round(v * 10) / 10),
    });
  };

  const p = pct / 100;
  const hue = 70 + p * 280;
  const orbit = 70 + 50 * Math.sin(p * Math.PI);

  return (
    <div className="flex h-full flex-col gap-3">
      <div
        className="relative flex min-h-[200px] flex-1 items-center justify-center overflow-hidden rounded-xl"
        style={{ border: `1px dashed ${fg}55` }}
      >
        {Array.from({ length: DOTS }, (_, i) => {
          const a = (i / DOTS) * Math.PI * 2 + p * Math.PI * 3;
          return (
            <span
              key={i}
              className="absolute h-3 w-3 rounded-full"
              style={{
                background: fg,
                opacity: 0.35 + 0.65 * p,
                transform: `translate(${Math.cos(a) * orbit}px, ${Math.sin(a) * orbit}px) scale(${
                  0.6 + p * 0.9
                })`,
              }}
            />
          );
        })}
        <div
          className="h-24 w-24"
          style={{
            background: `hsl(${hue} 90% 60%)`,
            borderRadius: `${50 - 38 * p}%`,
            transform: `rotate(${p * 270}deg) scale(${0.7 + 0.6 * Math.sin(p * Math.PI)})`,
          }}
        />
      </div>

      <div className="flex items-center gap-4 font-mono text-xs">
        <button
          type="button"
          onClick={play}
          className="rounded-full px-5 py-2 font-medium"
          style={{ background: fg, color: "#0a0a0b" }}
        >
          {pct >= 100 ? "↺ Reverse" : "▶ Play"}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={pct}
          aria-label="Timeline"
          onChange={(e) => {
            controls.current?.stop();
            setPct(Number(e.target.value));
            onExplore();
          }}
          className="flex-1"
          style={{ accentColor: fg }}
        />
        <span className="w-10 text-right tabular-nums">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}
