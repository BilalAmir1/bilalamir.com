
"use client";

import { LazyMotion, domAnimation, m, Variants } from "framer-motion";
import { ArrowUpRight, FolderGit2 } from "lucide-react";
import { useSkillContext } from "./SkillContext";

const PROJECTS_DATA = [
    {
        title: "ADQ Corporate Web Platform",
        role: "White-label Frontend Contractor",
        description: "Translated complex Figma design systems into highly reusable Next.js components. Mapped dynamic data utilizing both the Sitecore API (Layout Service) and GraphQL. Implemented structural layout switching for English and Arabic (LTR/RTL) localization.",
        tech: ["Next.js", "Sitecore JSS", "GraphQL", "Tailwind CSS"],
    },
    {
        title: "Hurak Learning LMS Migration",
        role: "Frontend Web Developer",
        description: "Collaborated with senior engineering leadership to migrate the Hurak Learning LMS from a legacy Laravel monolith to a decoupled Next.js frontend, including modifying backend REST APIs.",
        tech: ["Next.js", "React.js", "Laravel", "Tailwind CSS", "Bootstrap", "REST APIs"],
    },
    {
        title: "IHPC Global Web Platform",
        role: "White-label Frontend Contractor",
        description: "Delivered the Next.js UI within a decoupled headless architecture. Focused on building pixel-perfect, reusable React components and cleanly mapped data from the Sitecore CMS backend via REST APIs and GraphQL queries.",
        tech: ["Next.js", "React.js", "Sitecore JSS", "GraphQL", "Tailwind CSS", "REST APIs", "Mapbox"],
    },
    {
        title: "Innovation Challenge Platform",
        role: "Full-Stack / Headless CMS Developer",
        description:
            "Built a headless CMS-driven platform using Strapi and Next.js. Designed scalable content structures and relationships within Strapi, consumed content through GraphQL APIs, implemented dynamic content rendering, reusable frontend components, and integrated user engagement features including voting and challenge participation.",
        tech: [
            "Next.js",
            "Strapi",
            "GraphQL",
            "TypeScript",
            "Tailwind CSS",
            "Headless CMS"
        ],
    },
];

export default function Projects() {
    const { activeSkills, setActiveSkills } = useSkillContext();

    const handleProjectClick = (techStack: string[]) => {
        const isExactMatch = activeSkills.length === techStack.length &&
            techStack.every(skill => activeSkills.includes(skill));

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

    const pillContainerVariants: Variants = {
        hidden: { opacity: 1 },
        show: { transition: { staggerChildren: 0.1 } }
    };

    const pillVariants: Variants = {
        hidden: { opacity: 0, y: 15, scale: 0.8 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
    };

    return (
        <section id="projects" className="container scroll-m-10">
            <LazyMotion features={domAnimation}>

                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center md:text-left flex flex-col items-center md:items-start"
                >
                    <p className="text-[10px] font-mono tracking-[0.2em] text-emerald-600 dark:text-emerald-500 uppercase mb-4 select-none">
                        Portfolio
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-950 dark:text-zinc-50">
                        Selected Projects
                    </h2>
                    <div className="w-16 h-0.5 bg-emerald-500 rounded-full" />
                </m.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {PROJECTS_DATA.map((project, index) => {
                        const isExactMatch = activeSkills.length === project.tech.length && project.tech.every(skill => activeSkills.includes(skill));
                        const hasActiveSkill = activeSkills.length > 0 && activeSkills.every(skill => project.tech.includes(skill));
                        const isDimmed = activeSkills.length > 0 && !hasActiveSkill;

                        return (
                            <m.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
                                onClick={() => handleProjectClick(project.tech)}
                                animate={isExactMatch ? "show" : "hidden"}
                                whileHover="show"
                                className={`
                                    relative group cursor-pointer flex flex-col justify-between rounded-3xl border p-8 
                                    transition-all duration-500 ease-out
                                    ${isExactMatch
                                        ? "bg-zinc-200/60 dark:bg-zinc-800/60 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.02] z-10"
                                        : hasActiveSkill
                                            ? "bg-zinc-200/40 dark:bg-zinc-800/40 border-emerald-500/30 shadow-none scale-100"
                                            : "border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100/20 dark:bg-zinc-900/20 hover:bg-zinc-100/40 dark:hover:bg-zinc-900/40 hover:border-zinc-300/80 dark:hover:border-zinc-700/80"
                                    } 
                                    ${isDimmed ? "opacity-30 grayscale" : ""}
                                `}
                            >
                                <span className={`absolute top-4 left-4 w-4 h-4 border-t border-l rounded-tl-lg pointer-events-none transition-all duration-500 ${isExactMatch ? "border-emerald-500/50 opacity-100" : "border-zinc-300/60 dark:border-zinc-700/60 opacity-0 group-hover:opacity-100"}`} />
                                <span className={`absolute top-4 right-4 w-4 h-4 border-t border-r rounded-tr-lg pointer-events-none transition-all duration-500 ${isExactMatch ? "border-emerald-500/50 opacity-100" : "border-zinc-300/60 dark:border-zinc-700/60 opacity-0 group-hover:opacity-100"}`} />
                                <span className={`absolute bottom-4 left-4 w-4 h-4 border-b border-l rounded-bl-lg pointer-events-none transition-all duration-500 ${isExactMatch ? "border-emerald-500/50 opacity-100" : "border-zinc-300/60 dark:border-zinc-700/60 opacity-0 group-hover:opacity-100"}`} />
                                <span className={`absolute bottom-4 right-4 w-4 h-4 border-b border-r rounded-br-lg pointer-events-none transition-all duration-500 ${isExactMatch ? "border-emerald-500/50 opacity-100" : "border-zinc-300/60 dark:border-zinc-700/60 opacity-0 group-hover:opacity-100"}`} />

                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 rounded-2xl transition-colors duration-500 ${isExactMatch ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"}`}>
                                            <FolderGit2 className="w-6 h-6" />
                                        </div>
                                        <ArrowUpRight className={`w-5 h-5 transition-all duration-500 ${isExactMatch ? "text-emerald-600 dark:text-emerald-400 translate-x-1 -translate-y-1" : "text-zinc-400 dark:text-zinc-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1"}`} />
                                    </div>

                                    <p className="text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider mb-3">{project.role}</p>
                                    <h3 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${isExactMatch ? "text-emerald-950 dark:text-emerald-50" : "text-zinc-950 dark:text-zinc-50"}`}>{project.title}</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base mb-8">
                                        {project.description}
                                    </p>
                                </div>

                                <m.div
                                    variants={pillContainerVariants}
                                    className="flex flex-wrap gap-2 mt-auto min-h-7"
                                >
                                    {project.tech.map((tech) => {
                                        const isTechActive = activeSkills.includes(tech);

                                        return (
                                            <m.span
                                                key={tech}
                                                variants={pillVariants}
                                                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-500 ${isTechActive
                                                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                                    : "bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                                                    }`}
                                            >
                                                {tech}
                                            </m.span>
                                        )
                                    })}
                                </m.div>
                            </m.div>
                        )
                    })}
                </div>
            </LazyMotion>
        </section>
    );
}