import Reveal from "@/components/ui/Reveal";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <section id="about" className="px-6 py-32 md:px-12 md:py-48">
      <Reveal>
        <p className="mb-10 font-mono text-sm text-accent">( 01 ) About</p>
      </Reveal>
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <p className="text-3xl font-medium leading-tight md:text-5xl">
            {profile.about[0]}
          </p>
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-4 md:col-start-9">
          <p className="text-lg leading-relaxed text-muted">{profile.about[1]}</p>
        </Reveal>
      </div>
    </section>
  );
}
