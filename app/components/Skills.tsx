"use client";

import { LazyMotion, domAnimation, m, AnimatePresence, Variants, LayoutGroup } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useSkillContext } from "./SkillContext";

const SKILL_CATEGORIES = [
    {
        index: "01",
        title: "Frontend",
        color: "#34d399", // emerald-400
        skills: ["Next.js", "React.js", "TypeScript", "JavaScript", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3"],
    },
    {
        index: "02",
        title: "Architecture & CMS",
        color: "#38bdf8", // sky-400
        skills: ["Headless CMS", "Sitecore JSS", "Strapi", "GraphQL", "REST APIs", "JSON"],
    },
    {
        index: "03",
        title: "Backend & Tools",
        color: "#a78bfa", // violet-400
        skills: ["PHP", "Laravel", "MySQL", "Git", "GitHub", "Mapbox", "Figma to Code", "Vercel"],
    },
    {
        index: "04",
        title: "AI-Augmented Workflow",
        color: "#fbbf24", // amber-400
        skills: ["Claude", "Cursor"],
    },
];

const CATEGORY_OF: Record<string, string> = SKILL_CATEGORIES.reduce((acc, cat) => {
    cat.skills.forEach((s) => (acc[s] = cat.title));
    return acc;
}, {} as Record<string, string>);


const VB = 500;
const CX = VB / 2;
const CY = VB / 2;
const RING_RADII = [72, 112, 152, 192];
const RING_DURATIONS = [46, 36, 54, 24];
const RING_DIRECTIONS: ("cw" | "ccw")[] = ["cw", "ccw", "cw", "ccw"];
const RING_START_OFFSET = [0, 20, 45, 10];
const NUCLEUS_R = 66;


const f = (n: number) => n.toFixed(2);

const CUT = "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

type HoveredSkill = { skill: string; category: string } | null;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const pillVariants: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } },
};

// ─── Atom orbit visual ────────────────────────────────────────────────────────

function AtomOrbit({
    activeSkills,
    hoveredSkill,
    hoveredCategory,
    onSkillClick,
    onHover,
}: {
    activeSkills: string[];
    hoveredSkill: HoveredSkill;
    hoveredCategory: string | null;
    onSkillClick: (skill: string) => void;
    onHover: (val: HoveredSkill) => void;
}) {
    const hasActiveSkills = activeSkills.length > 0;

    const activeCategorySet = new Set(activeSkills.map((s) => CATEGORY_OF[s]).filter(Boolean));
    const isMultiSelection = activeSkills.length > 1;

    const displaySkill = hoveredSkill;
    const displayCategory = hoveredSkill?.category ?? hoveredCategory ?? null;
    const centerTitle = displaySkill
        ? displaySkill.skill
        : hoveredCategory
        ? hoveredCategory
        : isMultiSelection
        ? `${activeSkills.length} Skills`
        : activeSkills[0] ?? "Bilal Amir";
    const centerSub = displaySkill
        ? displaySkill.category
        : hoveredCategory
        ? "Category"
        : isMultiSelection
        ? "Selected"
        : activeSkills[0]
        ? CATEGORY_OF[activeSkills[0]]
        : "Next.js Developer";


    const globalPause = hasActiveSkills;

    return (
        <div className="relative w-full max-w-95 sm:max-w-130 lg:max-w-160 aspect-square mx-auto select-none">
            <style>{`
                @keyframes atom-spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes atom-spin-ccw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
                @keyframes atom-pulse { 0%, 100% { opacity: .35; transform: scale(1); } 50% { opacity: .7; transform: scale(1.06); } }
                @keyframes atom-ping { 0% { opacity: .6; transform: scale(0.9); } 100% { opacity: 0; transform: scale(2); } }
                @keyframes atom-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
                @keyframes reticle-spin { from { transform: rotate(0deg); } to { transform: rotate(90deg); } }
            `}</style>

            {/* Corner brackets + tech tag */}
            <span className="absolute -top-3 -left-3 w-4 h-4 sm:w-5 sm:h-5 border-t border-l border-emerald-500/40 pointer-events-none z-10" />
            <span className="absolute -top-3 -right-3 w-4 h-4 sm:w-5 sm:h-5 border-t border-r border-emerald-500/40 pointer-events-none z-10" />
            <span className="absolute -bottom-3 -left-3 w-4 h-4 sm:w-5 sm:h-5 border-b border-l border-emerald-500/40 pointer-events-none z-10" />
            <span className="absolute -bottom-3 -right-3 w-4 h-4 sm:w-5 sm:h-5 border-b border-r border-emerald-500/40 pointer-events-none z-10" />
            <span className="absolute -top-6 left-0 text-[8px] font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase select-none hidden sm:block">
                skill_matrix // core
            </span>
            <span className="absolute -top-6 right-0 flex items-center gap-1.5 text-[8px] font-mono tracking-[0.2em] uppercase select-none">
                <span className={`w-1 h-1 rounded-full ${globalPause ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
                <span className={globalPause ? "text-amber-600/80 dark:text-amber-400/70" : "text-emerald-600/70 dark:text-emerald-500/60"}>
                    {globalPause ? "locked" : "live"}
                </span>
            </span>

            {/* Slow vertical scan line, clipped to the circle */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-[0.5]">
                <div
                    className="absolute inset-x-0 h-1/3 bg-linear-to-b from-transparent via-emerald-400/10 to-transparent"
                    style={{ animation: "atom-scan 7s linear infinite" }}
                />
            </div>

            <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full h-full overflow-visible relative z-1">
                <defs>
                    <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                    </radialGradient>
                    {SKILL_CATEGORIES.map((cat) => (
                        <radialGradient key={cat.title} id={`glow-${cat.index}`} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={cat.color} stopOpacity="0.9" />
                            <stop offset="100%" stopColor={cat.color} stopOpacity="0" />
                        </radialGradient>
                    ))}
                </defs>

                <circle cx={CX} cy={CY} r={RING_RADII[3] + 24} fill="url(#nucleusGlow)" opacity={0.5} />

                {/* Tick marks around the outer edge for an instrument feel */}
                <g className="text-zinc-300/60 dark:text-zinc-700/60">
                    {Array.from({ length: 60 }).map((_, i) => {
                        const angle = (i / 60) * 360;
                        const isMajor = i % 5 === 0;
                        const rIn = RING_RADII[3] + 14;
                        const rOut = rIn + (isMajor ? 8 : 3);
                        const rad = (angle * Math.PI) / 180;
                        return (
                            <line
                                key={i}
                                x1={f(CX + rIn * Math.cos(rad))}
                                y1={f(CY + rIn * Math.sin(rad))}
                                x2={f(CX + rOut * Math.cos(rad))}
                                y2={f(CY + rOut * Math.sin(rad))}
                                stroke="currentColor"
                                strokeWidth={isMajor ? 1.4 : 0.8}
                                opacity={isMajor ? 0.7 : 0.35}
                            />
                        );
                    })}
                </g>

                {/* Orbit guide rings */}
                {SKILL_CATEGORIES.map((cat, idx) => {
                    const dimmed = hasActiveSkills
                        ? !activeCategorySet.has(cat.title)
                        : displayCategory !== null && displayCategory !== cat.title;
                    return (
                        <circle
                            key={cat.title}
                            cx={CX}
                            cy={CY}
                            r={RING_RADII[idx]}
                            fill="none"
                            stroke={cat.color}
                            strokeWidth={1}
                            strokeDasharray="2 7"
                            opacity={dimmed ? 0.06 : 0.28}
                            style={{ transition: "opacity .3s" }}
                        />
                    );
                })}

                {/* Spokes connecting the nucleus to every active node — makes a
                    multi-category selection legible at a glance */}
                {hasActiveSkills &&
                    SKILL_CATEGORIES.map((cat, ringIdx) => {
                        const radius = RING_RADII[ringIdx];
                        return cat.skills.map((skill, i) => {
                            if (!activeSkills.includes(skill)) return null;
                            const angle = RING_START_OFFSET[ringIdx] + (360 / cat.skills.length) * i;
                            const rad = (angle * Math.PI) / 180;
                            const sx = CX + NUCLEUS_R * Math.cos(rad);
                            const sy = CY + NUCLEUS_R * Math.sin(rad);
                            const nx = CX + radius * Math.cos(rad);
                            const ny = CY + radius * Math.sin(rad);
                            return (
                                <line
                                    key={`spoke-${skill}`}
                                    x1={f(sx)}
                                    y1={f(sy)}
                                    x2={f(nx)}
                                    y2={f(ny)}
                                    stroke={cat.color}
                                    strokeWidth={1}
                                    strokeDasharray="3 4"
                                    opacity={0.55}
                                />
                            );
                        });
                    })}

                {/* Orbiting rings */}
                {SKILL_CATEGORIES.map((cat, ringIdx) => {
                    const radius = RING_RADII[ringIdx];
                    const isCategoryPaused = globalPause || hoveredSkill?.category === cat.title || hoveredCategory === cat.title;
                    const isRingDimmed = hasActiveSkills && !activeCategorySet.has(cat.title);

                    return (
                        <g
                            key={cat.title}
                            style={{
                                transformOrigin: `${CX}px ${CY}px`,
                                animation: `atom-spin-${RING_DIRECTIONS[ringIdx]} ${RING_DURATIONS[ringIdx]}s linear infinite`,
                                animationPlayState: isCategoryPaused ? "paused" : "running",
                            }}
                        >
                            {cat.skills.map((skill, i) => {
                                const angle = RING_START_OFFSET[ringIdx] + (360 / cat.skills.length) * i;
                                const rad = (angle * Math.PI) / 180;
                                const nx = CX + radius * Math.cos(rad);
                                const ny = CY + radius * Math.sin(rad);
                                const isActive = activeSkills.includes(skill);
                                const isHovered = hoveredSkill?.skill === skill || hoveredCategory === cat.title;
                                const isHighlighted = isActive || isHovered;
                                const isDimmed = (hasActiveSkills && !isActive) || (!hasActiveSkills && isRingDimmed);

                                return (
                                    <g key={skill}>
                                        {[10, 20, 30].map((back, ti) => {
                                            const ta = angle - back * (RING_DIRECTIONS[ringIdx] === "cw" ? 1 : -1);
                                            const tr = (ta * Math.PI) / 180;
                                            const tx = CX + radius * Math.cos(tr);
                                            const ty = CY + radius * Math.sin(tr);
                                            return (
                                                <circle
                                                    key={ti}
                                                    cx={f(tx)}
                                                    cy={f(ty)}
                                                    r={f(2.6 - ti * 0.5)}
                                                    fill={cat.color}
                                                    opacity={isDimmed ? 0.05 : 0.22 - ti * 0.06}
                                                />
                                            );
                                        })}

                                        {isHighlighted && (
                                            <>
                                                <circle
                                                    cx={f(nx)}
                                                    cy={f(ny)}
                                                    r={13}
                                                    fill={`url(#glow-${cat.index})`}
                                                    style={{ animation: "atom-ping 1.4s ease-out infinite" }}
                                                />
                                                {/* Targeting reticle — small rotated square bracket instead of a plain ring */}
                                                <rect
                                                    x={f(nx - 11)}
                                                    y={f(ny - 11)}
                                                    width={22}
                                                    height={22}
                                                    fill="none"
                                                    stroke={cat.color}
                                                    strokeWidth={1.1}
                                                    opacity={0.85}
                                                    style={{
                                                        transformOrigin: `${f(nx)}px ${f(ny)}px`,
                                                        animation: "reticle-spin 6s linear infinite",
                                                    }}
                                                />
                                            </>
                                        )}

                                        <rect
                                            x={f(nx - (isHighlighted ? 7 : 5))}
                                            y={f(ny - (isHighlighted ? 7 : 5))}
                                            width={isHighlighted ? 14 : 10}
                                            height={isHighlighted ? 14 : 10}
                                            fill={cat.color}
                                            opacity={isDimmed ? 0.25 : 1}
                                            className="cursor-pointer"
                                            style={{
                                                transition: "width .2s ease, height .2s ease, x .2s ease, y .2s ease, opacity .2s ease",
                                                filter: isHighlighted ? `drop-shadow(0 0 6px ${cat.color})` : undefined,
                                                transform: `rotate(45deg)`,
                                                transformOrigin: `${f(nx)}px ${f(ny)}px`,
                                            }}
                                            onMouseEnter={() => onHover({ skill, category: cat.title })}
                                            onMouseLeave={() => onHover(null)}
                                            onClick={() => onSkillClick(skill)}
                                        >
                                            <title>{skill}</title>
                                        </rect>
                                    </g>
                                );
                            })}
                        </g>
                    );
                })}
            </svg>

            {/* Nucleus — HTML overlay so text scales cleanly at any size */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-2">
                <div
                    className="relative w-[28%] aspect-square flex items-center justify-center bg-zinc-50/95 dark:bg-zinc-950/90 border border-emerald-500/30 backdrop-blur-sm"
                    style={{ clipPath: CUT }}
                >
                    <span
                        className="absolute inset-0 bg-emerald-400/25 blur-md"
                        style={{ animation: "atom-pulse 3s ease-in-out infinite", clipPath: CUT }}
                    />
                    <AnimatePresence mode="wait">
                        <m.div
                            key={centerTitle}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.16 }}
                            className="relative z-10 flex flex-col items-center px-[8%] text-center"
                        >
                            <span className="text-[clamp(9px,2.4vw,16px)] font-bold text-zinc-900 dark:text-zinc-50 leading-tight font-mono">
                                {centerTitle}
                            </span>
                            <span className="text-[clamp(6px,1.4vw,9px)] font-mono tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mt-1">
                                {centerSub}
                            </span>
                        </m.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// ─── Skill pill ──────────────────────────────────────────────────────────────

interface SkillPillProps {
    skill: string;
    color: string;
    isActive: boolean;
    isDimmed: boolean;
    isHovered: boolean;
    onClick: () => void;
    onHoverStart: () => void;
    onHoverEnd: () => void;
}

function SkillPill({ skill, color, isActive, isDimmed, isHovered, onClick, onHoverStart, onHoverEnd }: SkillPillProps) {
    const on = isActive || isHovered;
    return (
        <m.button
            layout
            variants={pillVariants}
            whileHover={!isDimmed ? { y: -2, transition: { type: "spring", stiffness: 300, damping: 18 } } : {}}
            animate={{ scale: isDimmed ? 0.97 : 1, opacity: isDimmed ? 0.3 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={onClick}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            className={`
                relative pl-3 pr-3.5 py-1.5 text-xs font-mono border-l-2 flex items-center gap-2
                transition-colors duration-200 cursor-pointer select-none
                ${isDimmed
                    ? "bg-zinc-100/30 dark:bg-zinc-900/30 border-l-zinc-300/40 dark:border-l-zinc-700/40 text-zinc-400 dark:text-zinc-600 pointer-events-none"
                    : on
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "bg-zinc-100/70 dark:bg-zinc-900/50 border-l-zinc-300/50 dark:border-l-zinc-700/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }
            `}
            style={{
                clipPath: "polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px)",
                borderLeftColor: on && !isDimmed ? color : undefined,
                backgroundColor: on && !isDimmed ? `${color}18` : undefined,
                boxShadow: on && !isDimmed ? `0 0 10px ${color}40` : undefined,
            }}
        >
            {isActive && (
                <m.span
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                />
            )}
            <span className="relative z-10 tracking-tight">{skill}</span>
        </m.button>
    );
}

// ─── Category readout panel ───────────────────────────────────────────────────

function CategoryPanel({
    category,
    activeSkills,
    hoveredSkill,
    isCategoryHovered,
    onSkillClick,
    onSkillHoverStart,
    onSkillHoverEnd,
    onHeaderHoverStart,
    onHeaderHoverEnd,
    onHeaderClick,
}: {
    category: (typeof SKILL_CATEGORIES)[number];
    activeSkills: string[];
    hoveredSkill: HoveredSkill;
    isCategoryHovered: boolean;
    onSkillClick: (skill: string) => void;
    onSkillHoverStart: (skill: string) => void;
    onSkillHoverEnd: () => void;
    onHeaderHoverStart: () => void;
    onHeaderHoverEnd: () => void;
    onHeaderClick: () => void;
}) {
    const hasActiveSkills = activeSkills.length > 0;
    const activeCount = category.skills.filter((s) => activeSkills.includes(s)).length;

    return (
        <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 110, damping: 18 }}
            className="relative flex flex-col gap-3.5 p-4 sm:p-5 bg-zinc-100/30 dark:bg-zinc-900/30 border transition-colors duration-300"
            style={{
                clipPath: CUT,
                borderColor: isCategoryHovered || activeCount > 0 ? `${category.color}80` : undefined,
            }}
        >
            {/* corner tick, echoes the atom's bracket framing */}
            <span
                className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r pointer-events-none"
                style={{ borderColor: `${category.color}90` }}
            />

            <div className="flex items-center justify-between">
                <button
                    onMouseEnter={onHeaderHoverStart}
                    onMouseLeave={onHeaderHoverEnd}
                    onClick={onHeaderClick}
                    className="flex items-center gap-2.5 text-left cursor-pointer group"
                >
                    <span
                        className="w-2.5 h-2.5 shrink-0 transition-transform duration-200 group-hover:scale-125"
                        style={{
                            backgroundColor: category.color,
                            clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
                            boxShadow: isCategoryHovered ? `0 0 8px ${category.color}` : undefined,
                        }}
                    />
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {category.title}
                    </h3>
                </button>
                <span className="text-[9px] font-mono text-zinc-300 dark:text-zinc-700 tabular-nums select-none">
                    {activeCount > 0 ? `${activeCount}/${category.skills.length}` : category.index}
                </span>
            </div>

            <div className="h-px bg-zinc-200/60 dark:bg-zinc-800/60" />

            <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                className="flex flex-wrap gap-2"
            >
                {category.skills.map((skill) => {
                    const isActive = activeSkills.includes(skill);
                    const isDimmed = hasActiveSkills && !isActive;
                    const isHovered = hoveredSkill?.skill === skill;

                    return (
                        <SkillPill
                            key={skill}
                            skill={skill}
                            color={category.color}
                            isActive={isActive}
                            isDimmed={isDimmed}
                            isHovered={isHovered}
                            onClick={() => onSkillClick(skill)}
                            onHoverStart={() => onSkillHoverStart(skill)}
                            onHoverEnd={onSkillHoverEnd}
                        />
                    );
                })}
            </m.div>
        </m.div>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Skills() {
    const { activeSkills, setActiveSkills } = useSkillContext();
    const [hoveredSkill, setHoveredSkill] = useState<HoveredSkill>(null);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const hasActiveSkills = activeSkills.length > 0;

    const handleSkillClick = (skill: string) => {
        if (activeSkills.length === 1 && activeSkills[0] === skill) {
            setActiveSkills([]);
        } else {
            setActiveSkills([skill]);
        }
    };

    const handleCategoryClick = (title: string) => {
        const category = SKILL_CATEGORIES.find((c) => c.title === title);
        if (!category) return;
        const isSameCategorySelected =
            activeSkills.length === category.skills.length && category.skills.every((s) => activeSkills.includes(s));
        setActiveSkills(isSameCategorySelected ? [] : category.skills);
    };

    const totalSkills = SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0);
    const leftCategories = SKILL_CATEGORIES.slice(0, 2);
    const rightCategories = SKILL_CATEGORIES.slice(2);

    return (
        <section id="skills" className="container relative">
            <LazyMotion features={domAnimation}>
                {/* Ambient background grid for the whole section */}
                <div
                    className="absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.2] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                        color: "rgb(161 161 170 / 0.5)",
                        maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
                    }}
                />

                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                >
                    <div>
                        <p className="text-[10px] font-mono tracking-[0.2em] text-emerald-600 dark:text-emerald-500 uppercase mb-4 select-none">
                            Capabilities
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-950 dark:text-zinc-50">
                            Technical Arsenal
                        </h2>
                        <div className="w-16 h-0.5 bg-emerald-500 rounded-full" />
                    </div>

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
                                    className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
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
                                    className="text-xs font-mono text-zinc-400 dark:text-zinc-600 select-none"
                                >
                                    {totalSkills} technologies
                                </m.p>
                            )}
                        </AnimatePresence>
                    </div>
                </m.div>

                {/* Dashboard: atom flanked by category readout panels */}
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-8 lg:gap-6 items-center mb-10">
                    <div className="hidden lg:flex flex-col gap-6 order-1">
                        {leftCategories.map((cat) => (
                            <CategoryPanel
                                key={cat.title}
                                category={cat}
                                activeSkills={activeSkills}
                                hoveredSkill={hoveredSkill}
                                isCategoryHovered={hoveredCategory === cat.title}
                                onSkillClick={handleSkillClick}
                                onSkillHoverStart={(skill) => setHoveredSkill({ skill, category: cat.title })}
                                onSkillHoverEnd={() => setHoveredSkill(null)}
                                onHeaderHoverStart={() => setHoveredCategory(cat.title)}
                                onHeaderHoverEnd={() => setHoveredCategory(null)}
                                onHeaderClick={() => handleCategoryClick(cat.title)}
                            />
                        ))}
                    </div>

                    <div className="order-2 py-4">
                        <AtomOrbit
                            activeSkills={activeSkills}
                            hoveredSkill={hoveredSkill}
                            hoveredCategory={hoveredCategory}
                            onSkillClick={handleSkillClick}
                            onHover={setHoveredSkill}
                        />
                        <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 text-center mt-6">
                            {hasActiveSkills
                                ? "Orbit locked to selection — clear filter to resume"
                                : "Hover a node or a category chip to inspect · click to filter"}
                        </p>
                    </div>

                    <div className="hidden lg:flex flex-col gap-6 order-3">
                        {rightCategories.map((cat) => (
                            <CategoryPanel
                                key={cat.title}
                                category={cat}
                                activeSkills={activeSkills}
                                hoveredSkill={hoveredSkill}
                                isCategoryHovered={hoveredCategory === cat.title}
                                onSkillClick={handleSkillClick}
                                onSkillHoverStart={(skill) => setHoveredSkill({ skill, category: cat.title })}
                                onSkillHoverEnd={() => setHoveredSkill(null)}
                                onHeaderHoverStart={() => setHoveredCategory(cat.title)}
                                onHeaderHoverEnd={() => setHoveredCategory(null)}
                                onHeaderClick={() => handleCategoryClick(cat.title)}
                            />
                        ))}
                    </div>
                </div>

                {/* Mobile / tablet panels — same data, stacked below the atom */}
                <LayoutGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6 mb-10">
                        {SKILL_CATEGORIES.map((cat) => (
                            <CategoryPanel
                                key={cat.title}
                                category={cat}
                                activeSkills={activeSkills}
                                hoveredSkill={hoveredSkill}
                                isCategoryHovered={hoveredCategory === cat.title}
                                onSkillClick={handleSkillClick}
                                onSkillHoverStart={(skill) => setHoveredSkill({ skill, category: cat.title })}
                                onSkillHoverEnd={() => setHoveredSkill(null)}
                                onHeaderHoverStart={() => setHoveredCategory(cat.title)}
                                onHeaderHoverEnd={() => setHoveredCategory(null)}
                                onHeaderClick={() => handleCategoryClick(cat.title)}
                            />
                        ))}
                    </div>
                </LayoutGroup>

                {/* Active skill callout */}
                <AnimatePresence>
                    {hasActiveSkills && (
                        <m.div
                            key="active-callout"
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 24 }}
                            className="overflow-hidden"
                        >
                            <div
                                className="flex items-center gap-3 px-4 py-3 bg-emerald-500/5 border border-emerald-500/15"
                                style={{ clipPath: CUT }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                                    Viewing{" "}
                                    <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                                        {activeSkills.length === 1 ? activeSkills[0] : `${activeSkills.length} skills`}
                                    </span>
                                    {" "}— click again or{" "}
                                    <button
                                        onClick={() => setActiveSkills([])}
                                        className="text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                                    >
                                        clear
                                    </button>{" "}
                                    to reset.
                                </p>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </LazyMotion>
        </section>
    );
}