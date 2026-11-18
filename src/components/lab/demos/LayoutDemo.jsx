import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const CARDS = [
  {
    id: "fade",
    num: "A",
    title: "Fade",
    tone: "#c6ff3d",
    body: "Opacity and position, staggered. The quiet workhorse of every polished interface.",
  },
  {
    id: "morph",
    num: "B",
    title: "Morph",
    tone: "#7c5cff",
    body: "One element becomes another. Size, position and radius travel together, so nothing pops.",
  },
  {
    id: "flow",
    num: "C",
    title: "Flow",
    tone: "#ff6b6b",
    body: "Layouts reflow around the change. The eye follows the motion instead of hunting for what moved.",
  },
];

// The grid card and the expanded card share a layoutId, so Motion animates one into the other.
export default function LayoutDemo({ onExplore }) {
  const [open, setOpen] = useState(null);
  const active = CARDS.find((c) => c.id === open);

  return (
    <div className="relative h-full min-h-[260px] overflow-hidden rounded-xl">
      <div className="grid h-full grid-cols-3 gap-3">
        {CARDS.map((c) => (
          <motion.button
            key={c.id}
            type="button"
            layoutId={`card-${c.id}`}
            onClick={() => {
              setOpen(c.id);
              onExplore();
            }}
            className="flex flex-col justify-between p-4 text-left text-ink"
            style={{ background: c.tone, borderRadius: 16 }}
            whileHover={{ y: -6 }}
          >
            <span className="font-mono text-xs">{c.num}</span>
            <span className="text-2xl font-bold tracking-tight">{c.title}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            layoutId={`card-${active.id}`}
            onClick={() => setOpen(null)}
            className="absolute inset-0 z-10 flex cursor-pointer flex-col justify-between p-6 text-ink"
            style={{ background: active.tone, borderRadius: 16 }}
          >
            <motion.p
              className="font-mono text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              {active.num} — tap to close
            </motion.p>
            <div>
              <motion.p
                className="text-5xl font-bold tracking-tighter md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                {active.title}
              </motion.p>
              <motion.p
                className="mt-3 max-w-sm text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                {active.body}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
