import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { profile } from "@/data/profile";

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ ready }) {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-12"
      initial={{ y: -80, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.2 }}
    >
      <a href="#top" className="text-lg font-bold tracking-tight">
        {profile.name.split(" ")[0]}<span className="text-accent">.</span>
      </a>
      <nav className="flex gap-6 font-mono text-sm md:gap-10">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="group relative overflow-hidden"
          >
            <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
              {l.label}
            </span>
            <span className="absolute inset-0 block translate-y-full text-accent transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
              {l.label}
            </span>
          </a>
        ))}
      </nav>
    </motion.header>
  );
}
