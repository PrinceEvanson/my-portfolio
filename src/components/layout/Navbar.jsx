import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { isCurrent, url } from "@/lib/links";
import { site } from "@/config/site";
import { profile } from "@/data/profile";
import AppLink from "@/components/transition/AppLink";
import { useReady } from "./ReadyContext";

const links = site.pages.filter((p) => p.key !== "home");

export default function Navbar() {
  const ready = useReady();

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-12"
      initial={{ y: -80, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.2 }}
    >
      <AppLink href={url("")} label="Home" className="text-lg font-bold tracking-tight">
        {profile.name.split(" ")[0]}
        <span className="text-accent">.</span>
      </AppLink>
      <nav className="flex gap-6 font-mono text-sm md:gap-10">
        {links.map((l) => {
          const current = isCurrent(l.path);
          return (
            <AppLink
              key={l.key}
              href={url(l.path)}
              label={l.label}
              aria-current={current ? "page" : undefined}
              className={`group relative overflow-hidden ${current ? "text-accent" : ""}`}
            >
              <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
                {l.label}
              </span>
              <span className="absolute inset-0 block translate-y-full text-accent transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                {l.label}
              </span>
            </AppLink>
          );
        })}
      </nav>
    </motion.header>
  );
}
