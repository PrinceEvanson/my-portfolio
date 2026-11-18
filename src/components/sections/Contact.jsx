import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import AppLink from "@/components/transition/AppLink";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-32 md:px-12 md:py-48">
      <Reveal>
        <p className="mb-10 font-mono text-sm text-accent">( 01 ) Contact</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="text-[11vw] font-bold leading-[0.9] tracking-tighter md:text-[8vw]">
          Let&apos;s build something.
        </h2>
      </Reveal>
      <Reveal delay={0.2} className="mt-12">
        <Magnetic>
          <AppLink
            href={`mailto:${profile.email}`}
            className="inline-block rounded-full border border-accent px-8 py-4 font-mono text-sm text-accent transition-colors duration-300 hover:bg-accent hover:text-ink"
          >
            {profile.email}
          </AppLink>
        </Magnetic>
      </Reveal>
      <Reveal delay={0.3} className="mt-16">
        <ul className="flex gap-8 font-mono text-sm text-muted">
          {socials.map((s) => (
            <li key={s.label}>
              <AppLink href={s.href} className="transition-colors hover:text-accent">
                {s.label} ↗
              </AppLink>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
