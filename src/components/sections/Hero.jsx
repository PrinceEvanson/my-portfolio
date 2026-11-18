import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import SplitText from "@/components/ui/SplitText";
import Magnetic from "@/components/ui/Magnetic";
import AppLink from "@/components/transition/AppLink";
import { useReady } from "@/components/layout/ReadyContext";
import { url } from "@/lib/links";
import { profile } from "@/data/profile";

export default function Hero() {
  const ready = useReady();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden px-6 md:px-12"
    >
      {/* Drifting gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-1/4 h-96 w-96 animate-float rounded-full bg-accent-2/30 blur-[120px]" />
        <div className="absolute -right-10 bottom-10 h-80 w-80 animate-float rounded-full bg-accent/20 blur-[120px] [animation-delay:-3s]" />
      </div>

      <motion.div style={{ y, opacity }} className="w-full">
        <motion.p
          className="mb-6 font-mono text-sm text-accent"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          {profile.role} — {profile.location}
        </motion.p>

        <h1 className="text-[13vw] font-bold leading-[0.9] tracking-tighter md:text-[9vw]">
          <SplitText text={profile.name} play={ready} delay={0.3} />
        </h1>
        <h2 className="mt-4 text-[6vw] font-medium leading-tight text-muted md:text-[3vw]">
          <SplitText text={profile.tagline} play={ready} delay={0.7} />
        </h2>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Magnetic>
            <AppLink
              href={url("work/")}
              label="Work"
              className="inline-block rounded-full bg-accent px-8 py-4 font-mono text-sm font-medium text-ink"
            >
              See my work ↗
            </AppLink>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
