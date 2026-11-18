import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { projects } from "@/data/projects";

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <Reveal>
      <motion.article
        ref={ref}
        data-cursor="hover"
        className="group relative grid gap-6 border-t border-line py-10 md:grid-cols-12 md:items-center"
        whileHover="hover"
      >
        <p className="font-mono text-sm text-muted md:col-span-1">0{index + 1}</p>

        <motion.h3
          className="text-4xl font-bold tracking-tight md:col-span-5 md:text-6xl"
          variants={{ hover: { x: 16 } }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          {project.title}
        </motion.h3>

        <div className="md:col-span-4">
          <p className="text-muted">{project.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4 font-mono text-sm md:col-span-2 md:justify-end">
          <a href={project.live} className="hover:text-accent">Live ↗</a>
          <a href={project.repo} className="hover:text-accent">Code ↗</a>
        </div>

        {/* Colour wash that sweeps in on hover */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 origin-left"
          style={{ background: project.color, opacity: 0.06, y: parallax }}
          initial={{ scaleX: 0 }}
          variants={{ hover: { scaleX: 1 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.article>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section id="work" className="px-6 py-32 md:px-12">
      <Reveal>
        <p className="mb-12 font-mono text-sm text-accent">( 02 ) Selected work</p>
      </Reveal>
      <div>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
