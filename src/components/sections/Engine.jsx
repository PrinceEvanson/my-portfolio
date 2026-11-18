import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import AppLink from "@/components/transition/AppLink";
import ChapterStage from "@/components/lab/ChapterStage";
import FlowDemo from "@/components/lab/demos/FlowDemo";
import ApiDemo from "@/components/lab/demos/ApiDemo";
import QueryDemo from "@/components/lab/demos/QueryDemo";
import { chapters } from "@/data/lab";
import { backendChapters, backendChaptersDev } from "@/data/backend";
import { setDevView, useDevView } from "@/lib/devview";
import { stamp, useStamps } from "@/lib/stamps";

const DEMOS = { flow: FlowDemo, api: ApiDemo, query: QueryDemo };
const TOTAL = chapters.length + backendChapters.length;

// "The Engine Room" (back end): the same idea as the Lab, but for what happens after the click.
// Plain English by default, with a switch for the technical version.
export default function Engine() {
  const { set: explored, last } = useStamps();
  const dev = useDevView();
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
        <p className="mb-6 font-mono text-sm text-accent">( 03 ) The Engine Room · Behind the scenes</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-tighter md:text-8xl">
          And what happens <span className="text-accent">after the click.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Every website has a hidden half: the part that stores, checks and delivers things. Same
          rules as the Lab. Try each demo and it stamps the badge.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <div
          className="mt-8 inline-flex rounded-full border border-line p-1 font-mono text-xs"
          role="group"
          aria-label="Level of detail"
        >
          {[false, true].map((v) => (
            <button
              key={String(v)}
              type="button"
              onClick={() => setDevView(v)}
              aria-pressed={dev === v}
              className="rounded-full px-4 py-2 transition-colors duration-300"
              style={dev === v ? { background: "#c6ff3d", color: "#0a0a0b" } : { color: "#8b8b94" }}
            >
              {v ? "Developer view" : "Plain English"}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10">
        <ChapterStage
          chapters={dev ? backendChaptersDev : backendChapters}
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