"use client";

import { LazyMotion, domAnimation, m, Variants, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const EXPERIENCE_DATA = [
    {
        company: "Apply Dreams",
        role: "Frontend Web Developer",
        period: "Jul 2025 – Present",
        current: true,
        tags: ["Next.js", "Sitecore JSS", "GraphQL", "Tailwind CSS"],
        description:
            "Integrating Sitecore CMS with Next.js using Sitecore JSS and GraphQL for dynamic content mapping and headless architecture. Converting Figma designs into pixel-perfect, responsive UI components at scale.",
        highlight: "Headless Architecture",
    },
    {
        company: "Hurak Technologies",
        role: "Frontend Web Developer",
        period: "Feb – Jul 2025",
        current: false,
        tags: ["Next.js", "Laravel", "REST APIs"],
        description:
            "Redesigned LMS and BMS systems end-to-end. Built responsive interfaces, integrated frontend with backend APIs, and drove measurable improvements in system performance and cross-browser compatibility.",
        highlight: "LMS & BMS Systems",
    },
    {
        company: "FoneRep",
        role: "PHP Developer",
        period: "Nov 2024 – Feb 2025",
        current: false,
        tags: ["PHP", "Moodle", "Plugin Dev"],
        description:
            "Developed custom Moodle themes and plugins while collaborating cross-functionally to enhance platform functionality. Maintained strict adherence to coding standards throughout.",
        highlight: "Moodle Platform",
    },
    {
        company: "XOSOFT Technologies",
        role: "Frontend Developer",
        period: "2022 – 2023",
        current: false,
        tags: ["React.js", "API Integration", "Refactoring"],
        description:
            "Built and optimised responsive React.js components, improving page load performance. Integrated frontend with backend APIs and refactored legacy code into modular, maintainable architecture.",
        highlight: "React.js Foundations",
    },
];

// ─── Variants ─────────────────────────────────────────────────────────────────

const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20 },
    },
};

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────

function CareerProgress() {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
    });

    return (
        <div ref={ref} className="relative mb-16">
            <div className="relative h-px w-full overflow-hidden rounded-full bg-zinc-200/60 dark:bg-zinc-800/60">
                <m.div
                    className="absolute inset-y-0 left-0 origin-left bg-emerald-500"
                    style={{ scaleX }}
                />
            </div>
        </div>
    );
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────

interface ChapterCardProps {
    job: (typeof EXPERIENCE_DATA)[0];
    index: number;
}

function ChapterCard({ job, index }: ChapterCardProps) {
    return (
        <m.article
            variants={cardVariants}
            className="group relative grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300/60 dark:hover:border-zinc-700/60 transition-colors duration-500"
        >
            {/* Left panel — identity */}
            <div className="relative flex flex-col justify-between p-7 md:p-8 bg-zinc-100/40 dark:bg-zinc-900/40 border-b md:border-b-0 md:border-r border-zinc-200/50 dark:border-zinc-800/50">
                {/* Giant step number watermark */}
                <span
                    aria-hidden
                    className="absolute -top-3 -left-2 text-[7rem] md:text-[9rem] font-black text-zinc-200/30 dark:text-zinc-800/30 select-none leading-none pointer-events-none tracking-tighter tabular-nums"
                >
                    {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative z-10 flex flex-col gap-5">
                    {/* Current badge */}
                    {job.current && (
                        <div className="flex items-center gap-2 w-fit">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            <span className="text-[9px] font-mono tracking-[0.18em] text-emerald-600 dark:text-emerald-500 uppercase">
                                Current Role
                            </span>
                        </div>
                    )}

                    <div>
                        <p className="text-[10px] font-mono tracking-widest text-zinc-400 dark:text-zinc-600 uppercase mb-2">
                            {job.period}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                            {job.role}
                        </h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-5 h-px bg-zinc-300 dark:bg-zinc-700" />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">{job.company}</span>
                    </div>
                </div>

                {/* Highlight pill */}
                <div className="relative z-10 mt-8 md:mt-0">
                    <span className="inline-block text-[10px] font-mono tracking-wider text-emerald-700/80 dark:text-emerald-400/70 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-1.5">
                        {job.highlight}
                    </span>
                </div>
            </div>

            {/* Right panel — content */}
            <div className="relative flex flex-col justify-between p-7 md:p-8 bg-zinc-50/20 dark:bg-zinc-950/20">
                {/* Subtle dot-grid texture */}
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle, var(--dot-grid) 1px, transparent 1px)`,
                        backgroundSize: "24px 24px",
                    }}
                />

                <p className="relative text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                    {job.description}
                </p>

                {/* Footer — tags + arrow */}
                <div className="relative flex items-end justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-full px-2.5 py-1 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 group-hover:text-zinc-500 transition-colors duration-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 transition-all duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </m.article>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Experience() {
    return (
        <section id="experience" className="container relative">
            <LazyMotion features={domAnimation}>

                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                >
                    <div>
                        <p className="text-[10px] font-mono tracking-[0.2em] text-emerald-600 dark:text-emerald-500 uppercase mb-4 select-none">
                            Career Journey
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-950 dark:text-zinc-50">
                            Experience
                        </h2>
                        <div className="w-16 h-0.5 bg-emerald-500 rounded-full" />
                    </div>
                    <p className="text-xs font-mono text-zinc-400 dark:text-zinc-600 pb-1 select-none tabular-nums">
                        {EXPERIENCE_DATA.length} positions
                    </p>
                </m.div>

                {/* Scroll-driven progress bar */}
                <CareerProgress />

                {/* Chapter cards */}
                <m.div
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="flex flex-col gap-4"
                >
                    {EXPERIENCE_DATA.map((job, index) => (
                        <ChapterCard key={index} job={job} index={index} />
                    ))}
                </m.div>

            </LazyMotion>
        </section>
    );
}