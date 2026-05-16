// components/Skills.tsx
"use client";

import { LazyMotion, domAnimation, m, AnimatePresence, Variants, LayoutGroup } from "framer-motion";
import { X } from "lucide-react";
import { useSkillContext } from "./SkillContext";

const SKILL_CATEGORIES = [
    {
        index: "01",
        title: "Frontend",
        skills: ["Next.js", "React.js", "TypeScript", "JavaScript", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3"],
    },
    {
        index: "02",
        title: "Architecture & CMS",
        skills: ["Headless CMS", "Sitecore JSS", "Strapi", "GraphQL", "REST APIs", "JSON"],
    },
    {
        index: "03",
        title: "Backend & Tools",
        skills: ["PHP", "Laravel", "MySQL", "Git", "GitHub", "Mapbox", "Figma to Code", "Vercel"],
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
};

const pillVariants: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.92 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 220, damping: 18 },
    },
};

interface SkillPillProps {
    skill: string;
    isActive: boolean;
    isDimmed: boolean;
    onClick: () => void;
}

function SkillPill({ skill, isActive, isDimmed, onClick }: SkillPillProps) {
    return (
        <m.button
            layout
            variants={pillVariants}
            whileHover={
                !isDimmed
                    ? { y: -3, scale: 1.04, transition: { type: "spring", stiffness: 300, damping: 18 } }
                    : {}
            }
            animate={{
                scale: isDimmed ? 0.96 : isActive ? 1.06 : 1,
                opacity: isDimmed ? 0.3 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={onClick}
            className={`
                relative px-4 py-2 text-sm font-medium rounded-full border
                transition-colors duration-250 cursor-pointer select-none overflow-hidden
                ${isActive
                    ? "bg-emerald-500/15 border-emerald-400/70 text-emerald-300"
                    : isDimmed
                        ? "bg-zinc-900/30 border-zinc-800/40 text-zinc-600 grayscale pointer-events-none"
                        : "bg-zinc-900 border-zinc-700/50 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-500/5"
                }
            `}
        >
            {/* Active shimmer sweep */}
            {isActive && (
                <m.span
                    className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-400/10 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                />
            )}
            {/* Active glow ring */}
            {isActive && (
                <span className="absolute inset-0 rounded-full shadow-[0_0_14px_rgba(52,211,153,0.35)] pointer-events-none" />
            )}
            <span className="relative z-10">{skill}</span>
        </m.button>
    );
}

export default function Skills() {
    const { activeSkills, setActiveSkills } = useSkillContext();
    const hasActiveSkills = activeSkills.length > 0;
    const activeSkill = activeSkills[0] ?? null;

    const handleSkillClick = (skill: string) => {
        if (activeSkills.length === 1 && activeSkills[0] === skill) {
            setActiveSkills([]);
        } else {
            setActiveSkills([skill]);
        }
    };

    const totalSkills = SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0);

    return (
        <section id="skills" className="container">
            <LazyMotion features={domAnimation}>
                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                >
                    <div>
                        <p className="text-[10px] font-mono tracking-[0.2em] text-emerald-500 uppercase mb-4 select-none">
                            Capabilities
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-50">
                            Technical Arsenal
                        </h2>
                        <div className="w-16 h-0.5 bg-emerald-500 rounded-full" />
                    </div>

                    {/* Skill count + clear filter */}
                    <div className="flex items-center gap-3 h-fit pb-1">
                        <AnimatePresence mode="wait">
                            {hasActiveSkills ? (
                                <m.button
                                    key="clear"
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => setActiveSkills([])}
                                    className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                                >
                                    <X className="w-3 h-3" />
                                    Clear filter
                                </m.button>
                            ) : (
                                <m.p
                                    key="count"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xs font-mono text-zinc-600 select-none"
                                >
                                    {totalSkills} technologies
                                </m.p>
                            )}
                        </AnimatePresence>
                    </div>
                </m.div>

                {/* Active skill callout */}
                <AnimatePresence>
                    {activeSkill && (
                        <m.div
                            key={activeSkill}
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 24 }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                <p className="text-sm text-zinc-400">
                                    Viewing{" "}
                                    <span className="text-emerald-300 font-medium">{activeSkill}</span>
                                    {" "}— click again or{" "}
                                    <button
                                        onClick={() => setActiveSkills([])}
                                        className="text-zinc-500 underline underline-offset-2 hover:text-zinc-300 transition-colors cursor-pointer"
                                    >
                                        clear
                                    </button>{" "}
                                    to reset.
                                </p>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Categories grid */}
                <LayoutGroup>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                        {SKILL_CATEGORIES.map((category, idx) => (
                            <m.div
                                key={idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 18,
                                    delay: idx * 0.1,
                                }}
                                className="flex flex-col gap-5"
                            >
                                {/* Category header */}
                                <div className="flex items-baseline gap-3">
                                    <span className="text-[9px] font-mono text-zinc-700 select-none tabular-nums">
                                        {category.index}
                                    </span>
                                    <h3 className="text-base font-semibold text-zinc-200 tracking-tight">
                                        {category.title}
                                    </h3>
                                    <span className="ml-auto text-[9px] font-mono text-zinc-700 tabular-nums select-none">
                                        {category.skills.length}
                                    </span>
                                </div>

                                {/* Separator */}
                                <div className="h-px bg-zinc-800/60" />

                                {/* Pills */}
                                <m.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-40px" }}
                                    className="flex flex-wrap gap-2.5"
                                >
                                    {category.skills.map((skill) => {
                                        const isActive = activeSkills.includes(skill);
                                        const isDimmed = hasActiveSkills && !isActive;

                                        return (
                                            <SkillPill
                                                key={skill}
                                                skill={skill}
                                                isActive={isActive}
                                                isDimmed={isDimmed}
                                                onClick={() => handleSkillClick(skill)}
                                            />
                                        );
                                    })}
                                </m.div>
                            </m.div>
                        ))}
                    </div>
                </LayoutGroup>
            </LazyMotion>
        </section>
    );
}