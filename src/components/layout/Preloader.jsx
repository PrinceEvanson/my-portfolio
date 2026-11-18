import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Crown3D from "./Crown3D";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { computeFlight, getBrandRects, markFlown } from "@/lib/brand";
import { easeInOutExpo, easeOutExpo } from "@/lib/motion";

const HOLD_MS = 1800; // how long the preloader sits before the flight starts
const FLIGHT = 1.25; // seconds the name and crown take to reach the navbar

// Shows a 3D spinning crown and "Prince". Then the curtain lifts, "Prince" flies up to the
// navbar logo, and the crown shrinks into the green dot next to it.
export default function Preloader({ onDone }) {
  const reduced = usePrefersReducedMotion();
  const nameRef = useRef(null);
  const crownRef = useRef(null);
  const [fly, setFly] = useState(null); // null = waiting; otherwise the flight (or { simple: true })

  // Refs so the timers never restart if the parent re-renders.
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    let finish;
    const hold = setTimeout(() => {
      const flight = reducedRef.current
        ? null
        : computeFlight(
          getBrandRects(),
          nameRef.current?.getBoundingClientRect(),
          crownRef.current?.getBoundingClientRect()
        );
      // No navbar to land on (or reduced motion): just fade out and lift the curtain.
      if (flight) markFlown();
      setFly(flight ?? { simple: true });
      finish = setTimeout(() => doneRef.current(), flight ? FLIGHT * 1000 + 150 : 900);
    }, HOLD_MS);

    return () => {
      clearTimeout(hold);
      clearTimeout(finish);
    };
  }, []);

  const flying = fly !== null;
  const landing = fly && !fly.simple ? fly : null;

  return (
    <>
      {/* Curtain: just the dark background, it lifts away while the logo flies */}
      <motion.div
        className="fixed inset-0 z-[100] bg-ink"
        initial={{ y: 0 }}
        animate={{ y: flying ? "-100%" : 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: easeInOutExpo }}
      />

      {/* Content sits above the curtain so it can fly over the page as the curtain lifts */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[101] flex flex-col items-center justify-center text-paper"
        animate={{ opacity: fly?.simple ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6 flex flex-col items-center">
          {/* The crown. This box is what shrinks into the navbar dot. */}
          <motion.div
            ref={crownRef}
            className="relative h-28 w-28"
            style={{ transformOrigin: "50% 50%" }}
            animate={landing ? { x: landing.crown.x, y: landing.crown.y, scale: landing.crown.scale } : { x: 0, y: 0, scale: 1 }}
            transition={{
              x: { duration: FLIGHT, ease: easeInOutExpo },
              y: { duration: FLIGHT, ease: easeOutExpo }, // different curve = a curved path
              scale: { duration: FLIGHT, ease: easeInOutExpo },
            }}
          >
            {/* Hovering bounce (stops once the flight starts) */}
            <motion.div
              className="relative h-full w-full"
              animate={flying ? { y: 0 } : { y: [-6, 6, -6] }}
              transition={flying ? { duration: 0.3 } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* The 3D crown fades out as it gets small... */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: landing ? 0 : 1 }}
                transition={{ duration: FLIGHT * 0.3, delay: landing ? FLIGHT * 0.55 : 0 }}
              >
                <Crown3D />
              </motion.div>
              {/* ...while the green dot it becomes grows in underneath */}
              <motion.div
                className="absolute inset-0 rounded-full bg-accent"
                initial={{ scale: 0 }}
                animate={{ scale: landing ? 1 : 0 }}
                transition={{ duration: FLIGHT * 0.35, delay: landing ? FLIGHT * 0.55 : 0, ease: easeOutExpo }}
              />
            </motion.div>
          </motion.div>

          {/* Soft contact floor shadow */}
          <motion.div
            className="mt-3 h-2 w-12 rounded-full bg-accent/30 blur-sm"
            animate={
              flying
                ? { opacity: 0, scale: 0.4 }
                : { scale: [0.7, 1.1, 0.7], opacity: [0.3, 0.6, 0.3] }
            }
            transition={
              flying ? { duration: 0.35 } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </div>

        {/* Brand name. The inner span is what flies to the navbar. */}
        <motion.h1
          className="text-4xl font-bold tracking-tight text-paper md:text-6xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.span
            ref={nameRef}
            className="inline-block leading-none"
            style={{ transformOrigin: "0 0" }}
            animate={landing ? { x: landing.name.x, y: landing.name.y, scale: landing.name.scale } : { x: 0, y: 0, scale: 1 }}
            transition={{ duration: FLIGHT, delay: 0.1, ease: easeInOutExpo }}
          >
            Prince
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: flying ? 0 : 1 }}
          transition={{ duration: flying ? 0.3 : 0.5, delay: flying ? 0 : 0.4 }}
        >
          welcome to my portfolio
        </motion.p>
      </motion.div>
    </>
  );
}