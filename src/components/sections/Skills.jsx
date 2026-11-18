import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import { skills } from "@/data/skills";

export default function Skills() {
  const items = skills.map((s) => (
    <span key={s} className="text-6xl font-bold tracking-tighter md:text-8xl">
      {s}
    </span>
  ));

  return (
    <section id="skills" className="py-32">
      <Reveal>
        <p className="mb-12 px-6 font-mono text-sm text-accent md:px-12">( 03 ) Toolbox</p>
      </Reveal>
      <Marquee items={items} className="py-6" />
    </section>
  );
}
