import { motion } from "motion/react";
import { maskUp } from "@/lib/motion";

// Splits text into words, each sliding up out of an overflow mask.
export default function SplitText({ text, className = "", delay = 0, play = true }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            variants={maskUp}
            custom={delay + i * 0.06}
            initial="hidden"
            animate={play ? "show" : "hidden"}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
