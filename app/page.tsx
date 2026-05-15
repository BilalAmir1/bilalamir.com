
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import { SkillProvider } from "./components/SkillContext";
import Skills from "./components/Skills";
import Architecture from "./components/Architecture";
import Contact from "./components/Contact";


export default function Home() {
  return (
    <main className="bg-zinc-950 min-h-screen text-zinc-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Hero />
      <Architecture />
      <Experience />

      <SkillProvider>
        <Projects />
        <Skills />
      </SkillProvider>

      <Contact />
    </main>
  );
}