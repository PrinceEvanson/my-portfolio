import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

// Fades + slides children up the first time they scroll into view.
export default function Reveal({ children, delay = 0, className = "", as = "div" }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Tag>
  );
}
