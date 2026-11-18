import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import useMediaQuery from "@/hooks/useMediaQuery";

// A dot + trailing ring that grows over anything marked [data-cursor="hover"],
// links and buttons. Only mounts on devices with a fine pointer.
export default function CustomCursor() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 150, damping: 18, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 150, damping: 18, mass: 0.4 });
  const scale = useMotionValue(1);
  const ringScale = useSpring(scale, { stiffness: 200, damping: 20 });

  useEffect(() => {
    if (!finePointer) return;
    document.body.classList.add("has-custom-cursor");

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const hot = e.target.closest?.("a, button, [data-cursor='hover']");
      scale.set(hot ? 2.2 : 1);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [finePointer, x, y, scale]);

  if (!finePointer) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ x, y }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[199] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/60"
        style={{ x: ringX, y: ringY, scale: ringScale }}
      />
    </>
  );
}
