import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import AppLink from "@/components/transition/AppLink";
import ChapterStage from "@/components/lab/ChapterStage";
import FlowDemo from "@/components/lab/demos/FlowDemo";
import ApiDemo from "@/components/lab/demos/ApiDemo";
import QueryDemo from "@/components/lab/demos/QueryDemo";
import { chapters } from "@/data/lab";
import { backendChapters } from "@/data/backend";
import { stamp, useStamps } from "@/lib/stamps";

const DEMOS = { flow: FlowDemo, api: ApiDemo, query: QueryDemo };
const TOTAL = chapters.length + backendChapters.length;

// "The Engine Room" (back end): the same idea as the Lab, but for what happens after the click.
export default function Engine() {
  const { set: explored, last } = useStamps();
  const [flash, setFlash] = useState(null);

  // Little toast when a back-end stamp is earned (the badge itself is up in the Lab).
  useEffect(() => {
    if (!last) return undefined;
    const c = backendChapters.find((b) => b.id === last.id);
    if (!c) return undefined;
    setFlash({ label: c.stamp, n: last.n });
    const t = setTimeout(() => setFlash(null), 2600);
    return () => clearTimeout(t);
  }, [last]);

  return (
    <section id="engine" className="px-6 py-32 md:px-12">
      <Reveal>
        <p className="mb-6 font-mono text-sm text-accent">( 03 ) The Engine Room · Back end</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-tighter md:text-8xl">
          And what happens <span className="text-accent">after the click.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-6 max-w-xl text-lg text-muted">
          The other half of the stack: requests, APIs and data. Same rules as the Lab. Poke each
          demo and it stamps the badge.
        </p>
      </Reveal>

      <div className="mt-16">
        <ChapterStage
          chapters={backendChapters}
          demos={DEMOS}
          explored={explored}
          onExplore={stamp}
          heightClass="h-[1100px] md:h-[640px]"
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-sm">
          <p className="text-muted">
            Badge stamps{" "}
            <b className="text-accent">
              {explored.size}/{TOTAL}
            </b>
          </p>
          <AnimatePresence>
            {flash && (
              <motion.span
                key={flash.n}
                className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-ink"
                initial={{ y: 12, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 20 }}
              >
                + {flash.label} stamp
              </motion.span>
            )}
          </AnimatePresence>
          <AppLink
            href="#lab"
            className="rounded-full border border-line px-5 py-2 transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            See my badge ↑
          </AppLink>
        </div>
      </div>
    </section>
  );
}
