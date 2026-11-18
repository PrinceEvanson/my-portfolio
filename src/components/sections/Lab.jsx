import Reveal from "@/components/ui/Reveal";
import AppLink from "@/components/transition/AppLink";
import ChapterStage from "@/components/lab/ChapterStage";
import ProfileBadge from "@/components/lab/ProfileBadge";
import PhysicsDemo from "@/components/lab/demos/PhysicsDemo";
import FieldDemo from "@/components/lab/demos/FieldDemo";
import TypeDemo from "@/components/lab/demos/TypeDemo";
import LayoutDemo from "@/components/lab/demos/LayoutDemo";
import ScrubDemo from "@/components/lab/demos/ScrubDemo";
import { chapters } from "@/data/lab";
import { backendChapters } from "@/data/backend";
import { stamp, useStamps } from "@/lib/stamps";
import { url } from "@/lib/links";

const DEMOS = {
  physics: PhysicsDemo,
  field: FieldDemo,
  type: TypeDemo,
  layout: LayoutDemo,
  scrub: ScrubDemo,
};

// The badge shows a stamp slot for every demo on the page, front end and back end.
const allChapters = [...chapters, ...backendChapters];

// "The Lab" (front end): five interactive chapters plus the badge that collects the stamps.
export default function Lab() {
  const { set: explored, last } = useStamps();

  return (
    <section id="lab" className="px-6 py-32 md:px-12">
      <Reveal>
        <p className="mb-6 font-mono text-sm text-accent">( 02 ) The Lab · Front end</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-tighter md:text-8xl">
          What I can build. <span className="text-accent">Try it.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Play with a demo and it stamps my badge. Drag the badge, flip it over, and collect all{" "}
          {allChapters.length} stamps, front end and back end, to unlock full-stack access.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-12">
        <div className="order-2 flex justify-center lg:order-1 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <ProfileBadge explored={explored} chapters={allChapters} lastStamp={last} />
        </div>

        <div className="order-1 lg:order-2 lg:col-span-8">
          <ChapterStage chapters={chapters} demos={DEMOS} explored={explored} onExplore={stamp} />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-sm">
            <p className="text-muted">
              Stamps collected{" "}
              <b className="text-accent">
                {explored.size}/{allChapters.length}
              </b>
            </p>
            <AppLink
              href={url("work/")}
              label="Work"
              className="rounded-full border border-line px-5 py-2 transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Next stop: the work ↗
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
