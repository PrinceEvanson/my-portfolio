import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { profile } from "@/data/profile";


const JOURNEY = [
  {
    year: "2016",
    title: "The First spark",
    text: "I've always believed that technology began with curiosity. Especially when I was a child I always wanted to know how & why things work. Especially computers, phones, tablets  & TV's. Taking apart my parent's old devices & just looking at the motherboards, the reflective sheet that's usually behind the screen, I think that was my first spark with Tech.",
  },
  {
    year: "2020",
    title: "The First Code",
    text: 'My first "Hello World!" I was using my dad\'s old laptop, running a single HTML file on the browser with some CSS. And now that single "Hello World!" gave me an idea of what I was capable of . And as a creative, I was immediately hooked ! ',
  },
  {
    year: "2022",
    title: "Understanding the Desire",
    text: "I went to Highschool & I was then placed in a computer class where we were taught using applications like excel & word. But the one application that caught my attention was Access. Playing around with queries, forms & reports. Making databases & understanding how they work. I then realized that I wanted to be a software engineer. I wanted to build things that people can use & interact with.",
  },
  {
    year: "2026",
    title: "Foundation of a Career",
    text: "I had just finished Highschool & was just waiting to join University but I decided to enroll for software engineering classes at Moringa School. I was taught the fundamentals of programming, data structures & algorithms, web development, databases & more. Since my graduation from Moringa I've actively been in the Tech Job market & I've been working on personal projects to improve my skills & knowledge.",
  },
  {
    year: "Now",
    title: "Still learning",
    text: "I quickly realized that the tech industry is vast & ever changing, hence I have been teaching myself other technologies such as AI LLM's, Machine Learning, Cybersecurity & more",
  },
];


const SPARKS = [
  {
    label: "Spark",
    hint: "The Curiosity",
    text: "The urge to understand how things work, & the desire for answers",
  },
  {
    label: "Fuel",
    hint: "What keeps me going",
    text: "The idea of building something & being the man to do it ",
  },
  {
    label: "Aim",
    hint: "Where I'm headed",
    text: "Making a difference in every environment I dwell in & leaving a legacy behind",
  },
];

const INTERESTS = [
  "Basketball",
  "Football",
  "Music",
  "Reading Articles",
  "Gaming",
  "Chess",
  "Traveling",
  "Boxing",
];

const {
  journey = JOURNEY,
  sparks = SPARKS,
  interests = INTERESTS,
} = profile;

const ease = [0.22, 1, 0.36, 1];



function SubHeading({ children }) {
  return (
    <Reveal>
      <h3 className="mb-10 font-mono text-sm text-muted">{children}</h3>
    </Reveal>
  );
}


function SpotlightCard({ children, className = "" }) {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const glow = useMotionTemplate`radial-gradient(300px circle at ${x}px ${y}px, rgba(198,255,61,0.14), transparent 70%)`;

  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      className={`group relative overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.03] p-6 transition-colors duration-300 hover:border-accent/40 md:p-8 ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function Journey() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div ref={ref} className="relative">
      {/* Track */}
      <div className="absolute bottom-0 left-[7px] top-0 w-px bg-paper/10 md:left-1/2" />
      {/* Progress */}
      <motion.div
        className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-accent md:left-1/2"
        style={{ scaleY: reduce ? 1 : scaleY }}
      />

      <ul className="space-y-10 md:space-y-16">
        {journey.map((step, i) => {
          const left = i % 2 === 0; // desktop: alternate sides
          return (
            <li
              key={step.title}
              className={`relative pl-10 md:w-1/2 md:pl-0 ${left ? "md:pr-14" : "md:ml-auto md:pl-14"
                }`}
            >
              {/* Node on the line */}
              <motion.span
                aria-hidden
                className={`absolute top-8 left-0 h-3.5 w-3.5 rounded-full border-2 border-accent bg-ink ${left
                  ? "md:left-auto md:right-0 md:translate-x-1/2"
                  : "md:left-0 md:-translate-x-1/2"
                  }`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1, backgroundColor: "#c6ff3d" }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ duration: 0.4, ease }}
              />

              <motion.div
                initial={{ opacity: 0, x: reduce ? 0 : left ? -48 : 48 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 0.7, ease }}
              >
                <SpotlightCard>
                  <p className="font-mono text-sm text-accent">{step.year}</p>
                  <h4 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                    {step.title}
                  </h4>
                  <p className="mt-3 leading-relaxed text-muted">{step.text}</p>
                </SpotlightCard>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Education() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      {education.map((item, i) => (
        <motion.div
          key={item.school}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: i * 0.12, ease }}
          whileHover={{ y: -6 }}
        >
          <SpotlightCard className="h-full">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-muted">{item.level}</p>
              <p className="shrink-0 font-mono text-sm text-accent">{item.years}</p>
            </div>
            <h4 className="mt-8 text-2xl font-semibold tracking-tight md:text-3xl">
              {item.school}
            </h4>
            <p className="mt-2 text-muted">{item.focus}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-paper/15 px-3 py-1 text-sm text-paper/80 transition-colors duration-300 group-hover:border-accent/40"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </motion.div>
      ))}
    </div>
  );
}

function FlipCard({ label, hint, text, index }) {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  const face = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: reduce ? 0 : (index - 1) * 4 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay: index * 0.12, ease }}
      whileHover={{ y: -8 }}
    >
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        className="block h-64 w-full rounded-2xl text-left [perspective:1200px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:h-72"
      >
        <motion.span
          className="relative block h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 16 }
          }
        >
          {/* Front */}
          <span
            style={face}
            className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-paper/10 bg-paper/[0.03] p-6 md:p-8"
          >
            <span className="text-sm text-muted">{hint}</span>
            <span className="text-5xl font-bold tracking-tight md:text-6xl">
              {label}
            </span>
            <span className="font-mono text-xs text-accent">
              {flipped ? "tap to flip back" : "tap to flip"}
            </span>
          </span>

          {/* Back */}
          <span
            style={{ ...face, transform: "rotateY(180deg)" }}
            className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-accent p-6 text-ink md:p-8"
          >
            <span className="text-sm font-medium opacity-70">{label}</span>
            <span className="text-lg font-medium leading-snug md:text-xl">
              {text}
            </span>
            <span className="font-mono text-xs opacity-70">tap to flip back</span>
          </span>
        </motion.span>
      </button>
    </motion.div>
  );
}



function Marquee() {
  const reduce = useReducedMotion();
  const items = reduce ? interests : [...interests, ...interests];

  return (
    <div className="overflow-hidden border-y border-paper/10 py-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <motion.ul
        className={`flex gap-4 ${reduce ? "flex-wrap justify-center" : "w-max"}`}
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className="whitespace-nowrap rounded-full border border-paper/15 px-5 py-2 text-lg text-paper/80 transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            {item}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="px-6 py-32 md:px-12 md:py-48">
      <Reveal>
        <p className="mb-10 font-mono text-sm text-accent">( 01 ) About</p>
      </Reveal>

      {/* Intro (unchanged) */}
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

      {/* The path */}
      <div className="mt-32 md:mt-48">
        <SubHeading>How I got here</SubHeading>
        <Journey />
      </div>

      {/* Spark / fuel / aim */}
      <div className="mt-32 md:mt-48">
        <SubHeading>What drives me</SubHeading>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {sparks.map((s, i) => (
            <FlipCard key={s.label} index={i} {...s} />
          ))}
        </div>
      </div>

      {/* Beyond the code */}
      <div className="mt-32 md:mt-48">
        <SubHeading>Outside the code</SubHeading>
        <Marquee />
      </div>
    </section>
  );
}