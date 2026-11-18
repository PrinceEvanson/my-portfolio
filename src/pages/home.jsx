import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Lab from "@/components/sections/Lab";
import Engine from "@/components/sections/Engine";
import { mount } from "@/lib/mount";

mount(
  <PageShell title="Home" intro="count">
    <Hero />
    <Skills />
    <Lab />
    <Engine />
  </PageShell>
);
