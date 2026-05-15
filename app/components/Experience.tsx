// components/Experience.tsx
"use client";

import { LazyMotion, domAnimation, m, Variants } from "framer-motion";
import { Briefcase, Calendar, Building2 } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const EXPERIENCE_DATA = [
    {
        company: "Apply Dreams",
        role: "Frontend Web Developer",
        period: "Jul 2025 - Present",
        description: "Developing high-performance web applications. Integrating Sitecore CMS with Next.js using Sitecore JSS and GraphQL for dynamic content mapping and headless architecture. Converting Figma designs into pixel-perfect, responsive UI components with Tailwind CSS.",
    },
    {
        company: "Hurak Technologies",
        role: "Frontend Web Developer",
        period: "Feb 2025 - Jul 2025",
        description: "Redesigned and maintained LMS and BMS systems utilizing Next.js for the frontend and Laravel for the backend. Built responsive user interfaces, integrated frontend interfaces with backend APIs, and improved system performance and cross-browser compatibility.",
    },
    {
        company: "FoneRep",
        role: "PHP Developer",
        period: "Nov 2024 - Feb 2025",
        description: "Developed custom themes and plugins for Moodle. Collaborated with the team to enhance platform functionality while ensuring strict adherence to coding standards and performance optimization.",
    },
    {
        company: "XOSOFT Technologies",
        role: "FrontEnd Developer",
        period: "2022 - 2023",
        description: "Built and optimized responsive UI components in React.js, improving page load performance. Integrated UI with backend APIs and collaborated with senior developers to refactor legacy code into modular, maintainable components.",
    },
];

// ─── Variants ─────────────────────────────────────────────────────────────

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const nodeVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 },
    },
};

// ─── Sub-components ───────────────────────────────────────────────────────

interface TimelineNodeProps {
    job: typeof EXPERIENCE_DATA[0];
    isLast: boolean;
}

function TimelineNode({ job, isLast }: TimelineNodeProps) {
    return (
        <m.div variants={nodeVariants} className="relative group pl-10 md:pl-16 mb-12 last:mb-0">
            {/* The Animated Timeline Marker */}
            <div className="absolute -left-4 md:-left-5 top-1 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ring-8 ring-zinc-950 bg-zinc-900 border border-zinc-700 z-20 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300">
                <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-300" />
            </div>

            {/* Continuous Line to next item */}
            {!isLast && (
                <div
                    className="
            absolute
            left-4 md:left-5
            top-10 md:top-12
            -bottom-12
            w-px
            -translate-x-1/2
            bg-zinc-800/80
            group-hover:bg-zinc-700
            transition-colors duration-300
            z-0
        "
                />
            )}
            {/* The Content Card */}
            <div className="relative p-6 md:p-8 rounded-3xl bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-900/40 hover:border-zinc-700/80 transition-all duration-300">
                {/* Corner accents */}
                <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-zinc-700/60 rounded-tl-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-zinc-700/60 rounded-tr-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-zinc-700/60 rounded-bl-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-zinc-700/60 rounded-br-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-50 group-hover:text-emerald-400 transition-colors duration-300">
                        {job.role}
                    </h3>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950 border border-zinc-800/80 w-fit">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-mono text-zinc-400 tracking-wide">{job.period}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <Building2 className="w-4 h-4 text-zinc-500" />
                    <h4 className="text-base text-zinc-300 font-medium">{job.company}</h4>
                </div>

                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                    {job.description}
                </p>
            </div>
        </m.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function Experience() {
    return (
        <section id="experience" className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
            <LazyMotion features={domAnimation}>

                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center md:text-left flex flex-col items-center md:items-start"
                >
                    <p className="text-[10px] font-mono tracking-[0.2em] text-emerald-500 uppercase mb-4 select-none">
                        Career Journey
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-50">
                        Experience
                    </h2>
                    <div className="w-16 h-0.5 bg-emerald-500 rounded-full" />
                </m.div>

                {/* Timeline Container */}
                <m.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="relative"
                >
                    {EXPERIENCE_DATA.map((job, index) => (
                        <TimelineNode
                            key={index}
                            job={job}
                            isLast={index === EXPERIENCE_DATA.length - 1}
                        />
                    ))}
                </m.div>

            </LazyMotion>
        </section>
    );
}