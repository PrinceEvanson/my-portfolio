import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";
import { badge } from "@/data/lab";
import { profile } from "@/data/profile";

const W = 300;
const H = 460;
const BADGE_TOP = 70;
const CLIP_Y = BADGE_TOP + 14;

const face = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };
const initials = profile.name
  .split(" ")
  .map((w) => w[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();


function Barcode({ seed }) {
  const bars = useMemo(() => {
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return Array.from({ length: 40 }, () => {
      h = (h * 1664525 + 1013904223) >>> 0;
      return 1 + ((h >>> 28) % 4);
    });
  }, [seed]);

  return (
    <div className="flex h-10 items-stretch gap-[2px]">
      {bars.map((w, i) => (
        <span key={i} className="block bg-ink" style={{ width: w }} />
      ))}
    </div>
  );
}

function Stamp({ chapter, got }) {
  return (
    <div className="relative flex h-12 items-center justify-center rounded-lg border border-dashed border-line font-mono text-[10px] text-muted">
      {chapter.num}
      <AnimatePresence>
        {got && (
          <motion.div
            key="stamp"
            className="absolute inset-0.5 flex items-center justify-center rounded-md text-[10px] font-bold uppercase tracking-wide"
            style={{ background: chapter.bg, color: chapter.fg }}
            initial={{ scale: 2.6, rotate: -28, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
          >
            {chapter.stamp}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const BURST_COLORS = ["#c6ff3d", "#7c5cff", "#ff6b6b", "#f4f4f0"];

function Burst() {
  const parts = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const d = 150 + Math.random() * 90;
        return { x: Math.cos(a) * d, y: Math.sin(a) * d, c: BURST_COLORS[i % 4] };
      }),
    []
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-30">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-2.5 w-2.5 rounded-full"
          style={{ background: p.c }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
          transition={{ duration: 1.2, ease: easeOutExpo }}
        />
      ))}
    </div>
  );
}


export default function ProfileBadge({ explored, chapters, lastStamp }) {
  const reduced = usePrefersReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [flash, setFlash] = useState(null);
  const dragged = useRef(false);
  const total = chapters.length;
  const cleared = explored.size === total;


  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const swing = useSpring(useTransform(x, [-140, 0, 140], [16, 0, -16]), {
    stiffness: 140,
    damping: 10,
  });
  const cord = useTransform(
    [x, y],
    ([lx, ly]) =>
      `M ${W / 2} 0 C ${W / 2} ${CLIP_Y * 0.55}, ${W / 2 + lx * 0.55} ${CLIP_Y * 0.35 + ly * 0.4
      }, ${W / 2 + lx} ${CLIP_Y + ly}`
  );

  // Pointer tilt + moving sheen
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotX = useSpring(useTransform(py, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(px, [0, 1], [-14, 14]), { stiffness: 200, damping: 20 });
  const sx = useTransform(px, (v) => v * 100);
  const sy = useTransform(py, (v) => v * 100);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.30), transparent 55%)`;

  // "+ Physics stamp" toast whenever a new stamp is earned
  useEffect(() => {
    if (!lastStamp) return;
    setFlash(lastStamp);
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [lastStamp]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };
  const toggle = () => setFlipped((f) => !f);

  const flashChapter = flash && chapters.find((c) => c.id === flash.id);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative"
        style={{ width: W, height: BADGE_TOP + H, transformOrigin: "50% 0%" }}
        animate={reduced ? {} : { rotate: [-1.4, 1.4, -1.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Lanyard */}
        <svg
          className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
          width={W}
          height={BADGE_TOP + 40}
          aria-hidden
        >
          <motion.path d={cord} fill="none" stroke="#c6ff3d" strokeWidth="12" strokeLinecap="round" />
          <motion.path
            d={cord}
            fill="none"
            stroke="#0a0a0b"
            strokeWidth="2"
            strokeDasharray="3 7"
            strokeLinecap="round"
          />
        </svg>

        {/* New-stamp toast */}
        <AnimatePresence>
          {flashChapter && (
            <motion.div
              key={flash.n}
              className="absolute -top-3 right-0 z-40 rounded-full bg-accent px-4 py-2 font-mono text-xs font-bold text-ink shadow-xl"
              initial={{ y: 14, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
            >
              + {flashChapter.stamp} stamp
            </motion.div>
          )}
        </AnimatePresence>

        {cleared && <Burst key="burst" />}

        {/* The draggable badge */}
        <motion.div
          className="absolute left-0 z-10 cursor-grab touch-none outline-none active:cursor-grabbing"
          style={{ top: BADGE_TOP, width: W, height: H, x, y, rotate: swing, transformOrigin: "50% 14px" }}
          drag
          dragSnapToOrigin
          dragElastic={0.22}
          dragConstraints={{ left: -110, right: 110, top: -10, bottom: 50 }}
          dragTransition={{ bounceStiffness: 120, bounceDamping: 9 }}
          transition={{ type: "spring", stiffness: 90, damping: 7 }}
          whileDrag={{ scale: 1.03 }}
          onPointerDown={() => {
            dragged.current = false;
          }}
          onDragStart={() => {
            dragged.current = true;
          }}
          onClick={() => {
            if (!dragged.current) toggle();
          }}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={flipped ? "Badge back. Press to flip to the front" : "Badge front. Press to flip over"}
        >
          <div style={{ perspective: 1200, width: W, height: H }}>
            <motion.div
              style={{ width: W, height: H, rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="relative"
                style={{ width: W, height: H, transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 130, damping: 16 }}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] bg-paper text-ink shadow-2xl"
                  style={face}
                >
                  <div className="relative flex h-[92px] shrink-0 items-end justify-between bg-ink px-6 pb-4 text-paper">
                    <span className="absolute left-1/2 top-3 h-2.5 w-14 -translate-x-1/2 rounded-full bg-[#2a2a31]" />
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-lg font-bold text-ink">
                        {badge.mark}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                        {badge.company}
                      </span>
                    </div>
                    <span className="text-right font-mono text-[10px] leading-tight text-muted">
                      STAMPS
                      <br />
                      <b className="text-sm text-accent">
                        {explored.size}/{total}
                      </b>
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-between px-6 pb-5 pt-5">
                    <div className="relative h-[124px] w-[124px]">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "conic-gradient(from 0deg, #c6ff3d, #7c5cff, #ff6b6b, #c6ff3d)",
                        }}
                        animate={reduced ? {} : { rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-[5px] flex items-center justify-center overflow-hidden rounded-full bg-paper text-4xl font-bold tracking-tighter">
                        {badge.photo ? (
                          <img src={badge.photo} alt={profile.name} className="h-full w-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-[28px] font-bold leading-none tracking-tight">{profile.name}</p>
                      <p className="mt-2 font-mono text-xs">{profile.role}</p>
                    </div>

                    <div className="grid w-full grid-cols-3 gap-2 font-mono text-[10px]">
                      <div>
                        <p className="text-ink/50">ID </p>
                        <p className="font-bold">{badge.idNo}</p>
                      </div>
                      <div>
                        <p className="text-ink/50">DEPT</p>
                        <p className="font-bold">{badge.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-ink/50">SINCE</p>
                        <p className="font-bold">{badge.since}</p>
                      </div>
                    </div>

                    <div className="flex w-full items-end justify-between">
                      <Barcode seed={badge.idNo} />
                      <span className="font-mono text-[8px] text-ink/50">tap to flip ↻</span>
                    </div>
                  </div>

                  {cleared && (
                    <>
                      <motion.div
                        className="pointer-events-none absolute -inset-1/2 opacity-25"
                        style={{
                          background:
                            "conic-gradient(from 0deg, #ff6b6b, #c6ff3d, #4dd2ff, #7c5cff, #ff6b6b)",
                        }}
                        animate={reduced ? {} : { rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute right-[-44px] top-[120px] w-[200px] rotate-45 bg-accent py-1 text-center font-mono text-[10px] font-bold tracking-widest text-ink">
                        FULL STACK ✦
                      </div>
                    </>
                  )}
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[28px]"
                    style={{ background: sheen }}
                  />
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] border border-line bg-ink-2 p-6 text-paper shadow-2xl"
                  style={{ ...face, transform: "rotateY(180deg)" }}
                >
                  <span className="mx-auto h-2.5 w-14 rounded-full bg-[#2a2a31]" />
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    Credentials
                  </p>
                  <dl className="mt-3 space-y-3">
                    {badge.credentials.map((c) => (
                      <div key={c.label}>
                        <dt className="font-mono text-[10px] uppercase text-muted">{c.label}</dt>
                        <dd className="text-sm font-medium leading-snug">{c.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    Access stamps · {explored.size}/{total}
                  </p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {chapters.map((c) => (
                      <Stamp key={c.id} chapter={c} got={explored.has(c.id)} />
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between font-mono text-[10px]">
                    <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
                      <span className="h-2 w-0.5 animate-pulse rounded-full bg-accent" />
                      {badge.status}
                    </span>
                    <span className="text-muted">{profile.email}</span>
                  </div>

                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[28px]"
                    style={{ background: sheen }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <p className="mt-4 font-mono text-xs text-muted">Drag me : tap to flip</p>
    </div>
  );
}
