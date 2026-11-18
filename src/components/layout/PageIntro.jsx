import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { easeInOutExpo, easeOutExpo } from "@/lib/motion";
import { cameByWipe, clearArrival } from "@/lib/arrival";

// Shown on page load: the page title rises up, then the whole curtain lifts away.
// If you got here through an internal link's wipe, it starts in that same accent colour so
// the two animations read as one continuous motion.
export default function PageIntro({ title, onDone }) {
  const [continued] = useState(cameByWipe);

  useEffect(() => {
    const t = setTimeout(() => {
      clearArrival();
      onDone();
    }, continued ? 700 : 1000);
    return () => clearTimeout(t);
  }, [onDone, continued]);

  return (
    <motion.div
      className={`fixed inset-0 z-[100] flex items-center justify-center ${
        continued ? "bg-accent" : "bg-ink"
      }`}
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 1, ease: easeInOutExpo } }}
    >
      <div className="overflow-hidden">
        <motion.p
          className={`text-[16vw] font-bold leading-none tracking-tighter ${
            continued ? "text-ink" : "text-accent"
          }`}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          {title}
        </motion.p>
      </div>
    </motion.div>
  );
}
