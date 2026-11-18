import { useCallback, useState } from "react";
import { AnimatePresence } from "motion/react";
import TransitionProvider from "@/components/transition/TransitionProvider";
import SmoothScroll from "./SmoothScroll";
import CustomCursor from "./CustomCursor";
import Preloader from "./Preloader";
import PageIntro from "./PageIntro";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ReadyContext } from "./ReadyContext";
import { cameByWipe } from "@/lib/arrival";

// Wraps every page: smooth scroll, cursor, intro animation, navbar, footer.
// intro="count" -> number counter (use on the home page); intro="title" -> title wipe.
export default function PageShell({ title, intro = "title", children }) {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  // Arrived through an internal link's wipe? Then use the matching title wipe, even on Home.
  const [viaWipe] = useState(cameByWipe);

  return (
    <TransitionProvider>
      <ReadyContext.Provider value={ready}>
        <SmoothScroll>
          <CustomCursor />
          <AnimatePresence mode="wait">
            {!ready &&
              (intro === "count" && !viaWipe ? (
                <Preloader key="intro" onDone={done} />
              ) : (
                <PageIntro key="intro" title={title} onDone={done} />
              ))}
          </AnimatePresence>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </ReadyContext.Provider>
    </TransitionProvider>
  );
}
