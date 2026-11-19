import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { site } from "@/config/site";
import { labelFor } from "@/lib/links";
import { captureCueWord, markLeaving } from "@/lib/arrival";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import LinkCue from "./LinkCue";

const TransitionContext = createContext({
  navigate: (href) => {
    window.location.href = href;
  },
});

export const usePageTransition = () => useContext(TransitionContext);

// Plays the cue animation, THEN opens the link (new tab or same tab, see src/config/site.js).
export default function TransitionProvider({ children }) {
  const [cue, setCue] = useState(null);
  const busy = useRef(false);
  const timer = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Coming back with the browser's Back button restores the page from cache; clear any stuck cue.
  useEffect(() => {
    const reset = (e) => {
      if (!e.persisted) return;
      clearTimeout(timer.current);
      busy.current = false;
      setCue(null);
    };
    window.addEventListener("pageshow", reset);
    return () => {
      window.removeEventListener("pageshow", reset);
      clearTimeout(timer.current);
    };
  }, []);

  const navigate = useCallback(
    (href, { label, kind } = {}) => {
      if (busy.current) return;
      busy.current = true;

      const target = new URL(href, window.location.href).href;
      // External links -> cue, then a new tab. Internal links -> wipe, same tab.
      const newTab = kind === "external" ? site.externalNewTab : site.internalNewTab;
      const mode = newTab ? "tab" : "wipe";
      const ms = reduced ? 150 : mode === "tab" ? site.cueMs : site.wipeMs;

      const shown = label ?? labelFor(href);
      setCue({ label: shown, mode, ms });

      timer.current = setTimeout(() => {
        if (mode === "tab") {
          const w = window.open(target, "_blank");
          if (w) {
            try {
              w.opener = null; // same protection as rel="noopener"
            } catch {
              /* cross-origin: nothing to do */
            }
            busy.current = false;
            setCue(null);
            return;
          }
          // Pop-up blocker said no -> fall back to the same tab so the click is never lost.
        }
        markLeaving(mode === "wipe" ? captureCueWord(shown) : null); // tells the next page to continue the wipe instead of flashing dark
        window.location.href = target;
      }, ms);
    },
    [reduced]
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <AnimatePresence>{cue && <LinkCue key="cue" {...cue} />}</AnimatePresence>
    </TransitionContext.Provider>
  );
}