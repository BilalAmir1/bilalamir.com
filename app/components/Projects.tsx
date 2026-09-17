"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  Variants,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, FolderGit2, Sparkles, X } from "lucide-react";
import { useEffect, useRef, MouseEvent } from "react";
import anime from "animejs";
import { useSkillContext } from "./SkillContext";

const PROJECTS_DATA = [
  {
    title: "ADQ Corporate Web Platform",
    role: "White-label Frontend Contractor",
    description:
      "Translated complex Figma design systems into highly reusable Next.js components. Mapped dynamic data utilizing both the Sitecore API (Layout Service) and GraphQL. Implemented structural layout switching for English and Arabic (LTR/RTL) localization.",
    tech: ["Next.js", "Sitecore JSS", "GraphQL", "Tailwind CSS", "Claude", "Cursor"],
  },
  {
    title: "Hurak Learning LMS Migration",
    role: "Frontend Web Developer",
    description:
      "Collaborated with senior engineering leadership to migrate the Hurak Learning LMS from a legacy Laravel monolith to a decoupled Next.js frontend, including modifying backend REST APIs.",
    tech: [
      "Next.js",
      "React.js",
      "Laravel",
      "Tailwind CSS",
      "Bootstrap",
      "REST APIs",
      "Claude",
      "Cursor",
      "Chat GPT",
    ],
  },
  {
    title: "IHPC Global Web Platform",
    role: "White-label Frontend Contractor",
    description:
      "Delivered the Next.js UI within a decoupled headless architecture. Focused on building pixel-perfect, reusable React components and cleanly mapped data from the Sitecore CMS backend via REST APIs and GraphQL queries.",
    tech: [
      "Next.js",
      "React.js",
      "Sitecore JSS",
      "GraphQL",
      "Claude",
      "Cursor",
      "Tailwind CSS",
      "REST APIs",
      "Mapbox",
    ],
  },
  {
    title: "Innovation Challenge Platform",
    role: "Full-Stack / Headless CMS Developer",
    description:
      "Built a headless CMS-driven platform using Strapi and Next.js. Designed scalable content structures and relationships within Strapi, consumed content through GraphQL APIs, implemented dynamic content rendering, and integrated voting features.",
    tech: [
      "Next.js",
      "Strapi",
      "GraphQL",
      "TypeScript",
      "Tailwind CSS",
      "Headless CMS",
      "Claude",
      "Cursor",
    ],
  },
  {
    title: "Full-Stack Car Detailing Business Platform",
    role: "Full-Stack / Headless CMS Developer",
    description:
      "Built a full-stack business website and e-commerce platform with Next.js and Strapi, featuring a secure checkout flow with server-side price verification, zone-based delivery pricing, and automated WhatsApp/email order notifications. Implemented near-instant CMS content synchronization using Strapi lifecycle hooks and Next.js on-demand cache revalidation.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Strapi 5",
      "GraphQL",
      "Tailwind CSS",
      "REST APIs",
      "E-Commerce",
      "SVG",
      "SEO",
    ],
  },
];

const pillContainerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 22 },
  },
};

interface ProjectCardProps {
  project: (typeof PROJECTS_DATA)[number];
  index: number;
  activeSkills: string[];
  onProjectClick: (tech: string[]) => void;
}

function ProjectCard({ project, index, activeSkills, onProjectClick }: ProjectCardProps) {
  const isExactMatch =
    activeSkills.length === project.tech.length &&
    project.tech.every((skill) => activeSkills.includes(skill));
  const hasActiveSkill =
    activeSkills.length > 0 && activeSkills.every((skill) => project.tech.includes(skill));
  const isDimmed = activeSkills.length > 0 && !hasActiveSkill;

  // Stationary outer container ref for stable event bounds (prevents edge flickering)
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const cornerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const wasExactMatch = useRef(false);

  // ─── 3D Tilt Spring Physics Setup ──────────────────────────────────────────
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);

    if (cardRef.current) {
      cardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
      cardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Anime.js trigger for exact match selection flourish
  useEffect(() => {
    if (isExactMatch && !wasExactMatch.current) {
      const targets = [flashRef.current, ringRef.current, cardRef.current, ...cornerRefs.current].filter(Boolean);
      anime.remove(targets);

      if (flashRef.current) {
        anime({
          targets: flashRef.current,
          opacity: [0.5, 0],
          duration: 500,
          easing: "easeOutQuad",
        });
      }
      if (ringRef.current) {
        anime.set(ringRef.current, { opacity: 0.9, scale: 0.95 });
        anime({
          targets: ringRef.current,
          scale: 1.08,
          opacity: 0,
          duration: 700,
          easing: "easeOutQuad",
        });
      }
      if (cardRef.current) {
        anime({
          targets: cardRef.current,
          scale: [0.98, 1.02, 1],
          duration: 500,
          easing: "easeOutElastic(1, .6)",
        });
      }
      const corners = cornerRefs.current.filter(Boolean);
      if (corners.length) {
        anime.set(corners, { scale: 0.3, opacity: 0 });
        anime({
          targets: corners,
          scale: 1,
          opacity: 1,
          duration: 450,
          delay: anime.stagger(70),
          easing: "easeOutBack",
        });
      }
    }
    wasExactMatch.current = isExactMatch;
  }, [isExactMatch]);

  useEffect(() => {
    return () => {
      anime.remove(
        [flashRef.current, ringRef.current, cardRef.current, iconRef.current, ...cornerRefs.current].filter(Boolean)
      );
    };
  }, []);

  const handleIconEnter = () => {
    if (!iconRef.current) return;
    anime.remove(iconRef.current);
    anime({
      targets: iconRef.current,
      scale: [1, 1.25, 1],
      rotate: [0, -14, 0],
      duration: 500,
      easing: "easeOutElastic(1, .5)",
    });
  };

  return (
    /* Stationary outer wrapper div captures mouse events safely without moving boundaries */
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-[1000px] w-full h-full"
    >
      <m.div
        ref={cardRef}
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: index * 0.08 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onClick={() => onProjectClick(project.tech)}
        className={`
          relative group cursor-pointer flex flex-col justify-between overflow-hidden rounded-3xl p-7 md:p-8
          backdrop-blur-md border transition-colors duration-500 ease-out select-none h-full
          [--mouse-x:50%] [--mouse-y:50%]
          ${
            isExactMatch
              ? "bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/70 shadow-[0_0_40px_rgba(16,185,129,0.25)] scale-[1.02] z-10"
              : hasActiveSkill
              ? "bg-zinc-100/80 dark:bg-zinc-900/80 border-emerald-500/40 shadow-xl scale-100"
              : "bg-zinc-100/40 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/70"
          }
          ${isDimmed ? "opacity-35 grayscale scale-[0.98]" : "opacity-100"}
        `}
      >
        {/* Interactive Cursor Spotlight Gradient Layer */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
          style={{
            background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.14), transparent 80%)`,
          }}
        />

        {/* Subtle Index Watermark */}
        <span
          style={{ transform: "translateZ(10px)" }}
          className={`absolute -bottom-6 -right-2 text-9xl font-extrabold font-mono pointer-events-none select-none transition-colors duration-500 ${
            isExactMatch
              ? "text-emerald-500/15 dark:text-emerald-400/10"
              : "text-zinc-900/4 dark:text-zinc-100/3 group-hover:text-emerald-500/10"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Anime.js Flash & Expand Ring Overlay */}
        <div ref={flashRef} className="absolute inset-0 bg-emerald-400/30 pointer-events-none opacity-0 rounded-3xl" />
        <div ref={ringRef} className="absolute inset-0 rounded-3xl border-2 border-emerald-400 pointer-events-none opacity-0" />

        {/* Corner Brackets */}
        {[0, 1, 2, 3].map((i) => {
          const pos = [
            "top-4 left-4 border-t-2 border-l-2 rounded-tl-md",
            "top-4 right-4 border-t-2 border-r-2 rounded-tr-md",
            "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-md",
            "bottom-4 right-4 border-b-2 border-r-2 rounded-br-md",
          ][i];
          return (
            <span
              key={i}
              ref={(el) => {
                cornerRefs.current[i] = el;
              }}
              style={{ transform: "translateZ(20px)" }}
              className={`absolute w-3.5 h-3.5 pointer-events-none transition-all duration-500 ${pos} ${
                isExactMatch
                  ? "border-emerald-500 opacity-100"
                  : "border-zinc-400 dark:border-zinc-600 opacity-0 group-hover:opacity-100"
              }`}
            />
          );
        })}

        {/* Main Content Area */}
        <div className="relative z-10" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          <div className="flex justify-between items-center mb-6">
            <div
              ref={iconRef}
              onMouseEnter={handleIconEnter}
              style={{ transform: "translateZ(20px)" }}
              className={`p-3.5 rounded-2xl transition-all duration-300 shadow-sm ${
                isExactMatch
                  ? "bg-emerald-500 text-white shadow-emerald-500/30"
                  : "bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300/50 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
              }`}
            >
              <FolderGit2 className="w-5 h-5" />
            </div>

            <div
              style={{ transform: "translateZ(20px)" }}
              className={`p-2 rounded-full transition-all duration-300 ${
                isExactMatch
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              }`}
            >
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          <div
            style={{ transform: "translateZ(15px)" }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-medium tracking-wider uppercase mb-3 shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            {project.role}
          </div>

          <h3
            style={{ transform: "translateZ(25px)" }}
            className={`text-2xl font-bold tracking-tight mb-3 transition-colors duration-300 ${
              isExactMatch
                ? "text-emerald-950 dark:text-emerald-100"
                : "text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
            }`}
          >
            {project.title}
          </h3>

          <p
            style={{ transform: "translateZ(15px)" }}
            className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base mb-8"
          >
            {project.description}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <m.div
          variants={pillContainerVariants}
          initial="hidden"
          animate="show"
          style={{ transform: "translateZ(40px)" }}
          className="relative z-10 flex flex-wrap gap-2 mt-auto"
        >
          {project.tech.map((tech) => {
            const isTechActive = activeSkills.includes(tech);
            return (
              <m.span
                key={tech}
                variants={pillVariants}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-full border transition-all duration-300 ${
                  isTechActive
                    ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : "bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-300/40 dark:border-zinc-700/40 group-hover:border-zinc-400/60 dark:group-hover:border-zinc-600/60"
                }`}
              >
                {tech}
              </m.span>
            );
          })}
        </m.div>
      </m.div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function Projects() {
  const { activeSkills, setActiveSkills } = useSkillContext();

  const handleProjectClick = (techStack: string[]) => {
    const isExactMatch =
      activeSkills.length === techStack.length &&
      techStack.every((skill) => activeSkills.includes(skill));

    if (isExactMatch) {
      setActiveSkills([]);
    } else {
      setActiveSkills(techStack);
      setTimeout(() => {
        const skillsSection = document.getElementById("skills");
        if (skillsSection) {
          skillsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  return (
    <section id="projects" className="container scroll-m-10 relative py-12">
      <LazyMotion features={domAnimation}>
        {/* Subtle Background Radial Grid Mask */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.25] dark:opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            color: "rgb(161 161 170)",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 80%)",
          }}
        />

        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs font-mono tracking-[0.25em] text-emerald-600 dark:text-emerald-400 uppercase mb-3 select-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Portfolio Showcase
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
              Selected Projects
            </h2>
          </div>

          {/* Dynamic Active Filter Badge / Reset button */}
          {activeSkills.length > 0 && (
            <m.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setActiveSkills([])}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-all cursor-pointer self-start md:self-auto"
            >
              <span>Filtering by {activeSkills.length} skill(s)</span>
              <X className="w-3.5 h-3.5" />
            </m.button>
          )}
        </m.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              activeSkills={activeSkills}
              onProjectClick={handleProjectClick}
            />
          ))}
        </div>
      </LazyMotion>
    </section>
  );
}