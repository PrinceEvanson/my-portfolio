import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion";

// One chapter: explanation on the left, live demo on the right.
export default function Chapter({ c, Demo, position, total, onExplore }) {
  return (
    <div
      className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-6 p-6 md:grid-cols-2 md:grid-rows-1 md:gap-10 md:p-10"
      style={{ color: c.fg }}
    >
      <motion.div
        className="flex flex-col justify-center"
        variants={stagger(0.08, 0.45)}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={fadeUp} className="font-mono text-sm opacity-70">
          {position} / {String(total).padStart(2, "0")} — {c.kicker}
        </motion.p>
        <motion.h3
          variants={fadeUp}
          className="mt-3 text-4xl font-bold leading-[0.95] tracking-tighter md:text-6xl"
        >
          {c.title}
        </motion.h3>
        <motion.p variants={fadeUp} className="mt-5 max-w-md text-base opacity-80 md:text-lg">
          {c.blurb}
        </motion.p>
        <motion.ul variants={fadeUp} className="mt-5 flex flex-wrap gap-2">
          {c.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border px-3 py-1 font-mono text-xs"
              style={{ borderColor: `${c.fg}55` }}
            >
              {t}
            </li>
          ))}
        </motion.ul>
        <motion.p variants={fadeUp} className="mt-5 font-mono text-xs opacity-70">
          ↳ {c.hint}
        </motion.p>
      </motion.div>

      <motion.div
        className="min-h-0 rounded-2xl p-3"
        style={{ background: `${c.fg}14`, border: `1px solid ${c.fg}2e` }}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <Demo fg={c.fg} onExplore={onExplore} />
      </motion.div>
    </div>
  );
}
