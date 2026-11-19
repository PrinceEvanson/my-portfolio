import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { easeInOutExpo, easeOutExpo } from "@/lib/motion";
import { cameByWipe, clearArrival, readHandoff } from "@/lib/arrival";

const GLIDE = 1.05; // seconds the word takes to travel from the wipe spot to the centre

// Shown on page load. If you arrived through an internal link's wipe, the big word on that wipe
// is handed over: it starts exactly where it was (bottom corner, same size) and glides to the
// centre, so the two pages read as one continuous motion. Otherwise the title simply rises in.
export default function PageIntro({ title, onDone }) {
  const [continued] = useState(cameByWipe);
  const [handoff] = useState(() => {
    if (!cameByWipe()) return null;
    const h = readHandoff();
    return h && String(h.word).toLowerCase() === String(title).toLowerCase() ? h : null;
  });
  const wordRef = useRef(null);
  const [flying, setFlying] = useState(Boolean(handoff));

  // Runs before the first paint, so there is never a frame with the word in the wrong place.
  useLayoutEffect(() => {
    if (!handoff || !wordRef.current) {
      setFlying(false);
      return undefined;
    }
    const el = wordRef.current;
    const to = el.getBoundingClientRect(); // natural (centred) position, no transform yet
    const scale = handoff.fs / parseFloat(getComputedStyle(el).fontSize);
    const dx = handoff.left - to.left;
    const dy = handoff.top - to.top;
    el.style.transformOrigin = "0 0";
    el.style.opacity = "1";
    const controls = animate(
      el,
      { x: [dx, 0], y: [dy, 0], scale: [scale, 1] },
      { duration: GLIDE, ease: easeInOutExpo }
    );
    return () => controls.stop();
  }, [handoff]);

  useEffect(() => {
    const t = setTimeout(() => {
      clearArrival();
      onDone();
    }, handoff ? 1500 : continued ? 700 : 1000);
    return () => clearTimeout(t);
  }, [onDone, continued, handoff]);

  return (
    <motion.div
      className={`fixed inset-0 z-[100] flex items-center justify-center ${continued ? "bg-accent" : "bg-ink"
        }`}
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 1, ease: easeInOutExpo } }}
    >
      <div className={flying ? "" : "overflow-hidden"}>
        {handoff ? (
          <p
            ref={wordRef}
            style={{ opacity: 0 }}
            className="text-[16vw] font-bold leading-none tracking-tighter text-ink"
          >
            {title}
          </p>
        ) : (
          <motion.p
            className={`text-[16vw] font-bold leading-none tracking-tighter ${continued ? "text-ink" : "text-accent"
              }`}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: easeOutExpo }}
          >
            {title}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}