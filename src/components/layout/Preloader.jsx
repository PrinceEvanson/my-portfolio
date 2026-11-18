import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { easeInOutExpo } from "@/lib/motion";

// Counts 0 -> 100, then slides up to reveal the page.
export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= 100) {
          clearInterval(id);
          return 100;
        }
        return c + 2;
      });
    }, 25);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (count === 100) {
      const t = setTimeout(onDone, 350);
      return () => clearTimeout(t);
    }
  }, [count, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-between bg-ink p-6 md:p-12"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 1, ease: easeInOutExpo } }}
    >
      <p className="font-mono text-sm text-muted">Loading portfolio</p>
      <p className="text-[22vw] font-bold leading-none text-accent tabular-nums">
        {count}
      </p>
    </motion.div>
  );
}
