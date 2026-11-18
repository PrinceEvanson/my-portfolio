import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { isCurrent, url } from "@/lib/links";
import { brandDotRef, brandNameRef, wasFlown } from "@/lib/brand";
import { site } from "@/config/site";
import { profile } from "@/data/profile";
import AppLink from "@/components/transition/AppLink";
import { useReady } from "./ReadyContext";

const links = site.pages.filter((p) => p.key !== "home");

export default function Navbar() {
  const ready = useReady();
  // The logo stays hidden until the preloader's name and crown have flown here and landed on it.
  // Instant after the flight (the flying copy disappears in the same frame), a soft fade otherwise.
  const logoStyle = {
    opacity: ready ? 1 : 0,
    transition: wasFlown() ? "none" : "opacity 0.6s ease",
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-12">
      <AppLink href={url("")} label="Home" className="text-lg font-bold tracking-tight">
        {/* The preloader's "Prince" lands exactly on this span */}
        <span ref={brandNameRef} className="inline-block leading-none" style={logoStyle}>
          {profile.name.split(" ")[0]}
        </span>
        {/* ...and the crown shrinks into this dot */}
        <span
          ref={brandDotRef}
          aria-hidden
          className="ml-[0.04em] inline-block h-[0.3em] w-[0.3em] rounded-full bg-accent"
          style={logoStyle}
        />
      </AppLink>

      <motion.nav
        className="flex gap-6 font-mono text-sm md:gap-10"
        initial={{ y: -30, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.1 }}
      >
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
      </motion.nav>
    </header>
  );
}