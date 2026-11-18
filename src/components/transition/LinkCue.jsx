import { motion } from "motion/react";
import { easeInOutExpo, easeOutExpo } from "@/lib/motion";

// The animation that plays BEFORE a link opens.
//  mode "tab":  a progress line across the top + a pill saying where you're going
//  mode "wipe": a full-screen colour wipe with the destination name
export default function LinkCue({ label, mode, ms }) {
  const dur = ms / 1000;

  if (mode === "wipe") {
    return (
      <motion.div
        className="fixed inset-0 z-[150] flex items-end justify-between bg-accent p-6 text-ink md:p-12"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: dur, ease: easeInOutExpo }}
      >
        <p className="font-mono text-sm">Up Next: Loading . . . </p>
        <p className="text-[14vw] font-bold leading-none tracking-tighter">{label}</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[150] h-[3px] origin-left bg-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: dur, ease: "linear" }}
      />
      <motion.div
        role="status"
        aria-live="polite"
        className="fixed bottom-6 left-1/2 z-[150] flex items-center gap-3 overflow-hidden rounded-full border border-line bg-ink-2/95 px-6 py-4 font-mono text-sm shadow-2xl backdrop-blur"
        style={{ x: "-50%" }}
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, transition: { duration: 0.25 } }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
      >
        <motion.span
          className="inline-block text-accent"
          animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
        >
          ↗
        </motion.span>
        <span>
          Opening <b className="text-accent">{label}</b> in a new tab
        </span>
        <motion.span
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: dur, ease: "linear" }}
        />
      </motion.div>
    </>
  );
}
