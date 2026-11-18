import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-line px-6 py-8 font-mono text-xs text-muted md:flex-row md:px-12">
      <p>© {new Date().getFullYear()} {profile.name}</p>
      <p>Built with React, Tailwind, Motion & GSAP</p>
    </footer>
  );
}
