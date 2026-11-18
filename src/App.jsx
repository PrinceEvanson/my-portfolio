import { useState } from "react";
import { AnimatePresence } from "motion/react";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Preloader from "@/components/layout/Preloader";
import CustomCursor from "@/components/layout/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <SmoothScroll>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {!loaded && <Preloader key="preloader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <Navbar ready={loaded} />
      <main>
        <Hero ready={loaded} />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
