"use client";

import { LazyMotion, domAnimation, m, AnimatePresence, Variants, LayoutGroup } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import anime from "animejs";
import { useSkillContext } from "./SkillContext";

const SKILL_CATEGORIES = [
    {
        index: "01",
        title: "Frontend",
        short: "FE",
        color: "#34d399", // emerald-400
        skills: ["Next.js", "React.js", "TypeScript", "JavaScript", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3"],
    },
    {
        index: "02",
        title: "Architecture & CMS",
        short: "CMS",
        color: "#38bdf8", // sky-400
        skills: ["Headless CMS", "Sitecore JSS", "Strapi", "GraphQL", "REST APIs", "JSON"],
    },
    {
        index: "03",
        title: "Backend & Tools",
        short: "BE",
        color: "#a78bfa", // violet-400
        skills: ["Node.js", "PHP", "Laravel", "MySQL", "PostgreSQL", "Git", "GitHub", "Mapbox", "Figma to Code", "Vercel"],
    },
    {
        index: "04",
        title: "AI-Augmented Workflow",
        short: "AI",
        color: "#fbbf24", // amber-400
        skills: ["Claude", "Cursor"],
    },
];

const CATEGORY_OF: Record<string, string> = SKILL_CATEGORIES.reduce((acc, cat) => {
    cat.skills.forEach((s) => (acc[s] = cat.title));
    return acc;
}, {} as Record<string, string>);

// ── Board geometry — all integers, purely arithmetic (no trig), so there is
// no server/client floating-point mismatch to guard against. ──
const VB_W = 1000;
const VB_H = 640;
const CPU_X = 500;
const CPU_Y = 320;
const CPU_W = 170;
const CPU_H = 104;
const TRUNK_LEFT = 300;
const TRUNK_RIGHT = 700;
const PAD_W = 176;
const PAD_LEFT_X = 20;
const PAD_RIGHT_X = VB_W - 20 - PAD_W;
const ROW_H = 32;
const GROUP_GAP = 44;

type HoveredSkill = { skill: string; category: string } | null;
type Side = "left" | "right";

interface SkillLayout {
    skill: string;
    category: (typeof SKILL_CATEGORIES)[number];
    side: Side;
    padX: number;
    skillY: number;
    d: string;
}

interface CategoryLabel {
    title: string;
    short: string;
    color: string;
    x: number;
    y: number;
    anchor: "start" | "end";
}

function computeLayout(): { items: SkillLayout[]; labels: CategoryLabel[] } {
    const leftCats = SKILL_CATEGORIES.slice(0, 2);
    const rightCats = SKILL_CATEGORIES.slice(2);
    const items: SkillLayout[] = [];
    const labels: CategoryLabel[] = [];

    const buildSide = (cats: typeof SKILL_CATEGORIES, side: Side) => {
        const totalRows = cats.reduce((a, c) => a + c.skills.length, 0);
        const totalHeight = totalRows * ROW_H + (cats.length - 1) * GROUP_GAP;
        let y = CPU_Y - totalHeight / 2;
        const trunkX = side === "left" ? TRUNK_LEFT : TRUNK_RIGHT;
        const cpuEdgeX = side === "left" ? CPU_X - CPU_W / 2 : CPU_X + CPU_W / 2;
        const padX = side === "left" ? PAD_LEFT_X : PAD_RIGHT_X;
        const padEdgeX = side === "left" ? padX + PAD_W : padX;

        cats.forEach((cat) => {
            const groupStartY = y;
            cat.skills.forEach((skill) => {
                const skillY = y + ROW_H / 2;
                const d = `M ${cpuEdgeX} ${CPU_Y} H ${trunkX} V ${skillY} H ${padEdgeX}`;
                items.push({ skill, category: cat, side, padX, skillY, d });
                y += ROW_H;
            });
            // Anchored to the pad column itself (not the trunk, where every
            // trace's vertical run overlaps) so it reads as a fixed section
            // header sitting directly above its own group of pads.
            labels.push({
                title: cat.title,
                short: cat.short,
                color: cat.color,
                x: side === "left" ? padX : padX + PAD_W,
                y: groupStartY - 14,
                anchor: side === "left" ? "start" : "end",
            });
            y += GROUP_GAP;
        });
    };

    buildSide(leftCats, "left");
    buildSide(rightCats, "right");
    return { items, labels };
}

// The layout is fully static — it only depends on the SKILL_CATEGORIES
// constant above, never on props or state — so compute it exactly once at
// module load instead of recalculating it on every render.
const BOARD_LAYOUT = computeLayout();

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const pillVariants: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } },
};

// ─── Static board decoration — memoized so it renders once and never again,
// regardless of how often hover/selection state changes above it. ──────────────

const BoardStatic = memo(function BoardStatic({
    cpuGlowRef,
}: {
    cpuGlowRef: React.RefObject<SVGRectElement | null>;
}) {
    return (
        <>
            <defs>
                <radialGradient id="cpuHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* faint board grid */}
            <g opacity={0.06} className="text-zinc-400 dark:text-zinc-600">
                {Array.from({ length: 20 }).map((_, i) => (
                    <line key={`v${i}`} x1={(i + 1) * (VB_W / 21)} y1={0} x2={(i + 1) * (VB_W / 21)} y2={VB_H} stroke="currentColor" strokeWidth={1} />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                    <line key={`h${i}`} x1={0} y1={(i + 1) * (VB_H / 13)} x2={VB_W} y2={(i + 1) * (VB_H / 13)} stroke="currentColor" strokeWidth={1} />
                ))}
            </g>

            {/* PCB board outline with corner mounting holes */}
            <rect x={10} y={10} width={VB_W - 20} height={VB_H - 20} fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth={1} />
            {[
                [30, 30],
                [VB_W - 30, 30],
                [30, VB_H - 30],
                [VB_W - 30, VB_H - 30],
            ].map(([hx, hy], i) => (
                <g key={i}>
                    <circle cx={hx} cy={hy} r={7} fill="none" stroke="rgba(52,211,153,0.35)" strokeWidth={1} />
                    <circle cx={hx} cy={hy} r={2.4} fill="rgba(52,211,153,0.35)" />
                </g>
            ))}

            <circle cx={CPU_X} cy={CPU_Y} r={190} fill="url(#cpuHalo)" opacity={0.6} />

            {/* CPU shell — the breathing glow rect still needs its ref for Anime.js */}
            <rect
                ref={cpuGlowRef}
                x={CPU_X - CPU_W / 2 - 14}
                y={CPU_Y - CPU_H / 2 - 14}
                width={CPU_W + 28}
                height={CPU_H + 28}
                fill="none"
                stroke="#34d399"
                strokeWidth={1}
                opacity={0.3}
            />
            <rect
                x={CPU_X - CPU_W / 2}
                y={CPU_Y - CPU_H / 2}
                width={CPU_W}
                height={CPU_H}
                className="fill-zinc-50/95 dark:fill-zinc-950/90"
                stroke="#34d399"
                strokeOpacity={0.5}
                strokeWidth={1.2}
            />
            {Array.from({ length: 7 }).map((_, i) => {
                const px = CPU_X - CPU_W / 2 + 18 + i * ((CPU_W - 36) / 6);
                return (
                    <g key={i} className="text-emerald-500/40">
                        <line x1={px} y1={CPU_Y - CPU_H / 2 - 9} x2={px} y2={CPU_Y - CPU_H / 2} stroke="currentColor" strokeWidth={1.5} />
                        <line x1={px} y1={CPU_Y + CPU_H / 2} x2={px} y2={CPU_Y + CPU_H / 2 + 9} stroke="currentColor" strokeWidth={1.5} />
                    </g>
                );
            })}
        </>
    );
});

// ─── Per-skill node — trace, current-flow dot, via, and pad in one memoized
// unit, so hovering one skill doesn't force the other 23 to re-render too. ────

const SkillNode = memo(function SkillNode({
    layout,
    isHighlighted,
    isDimmed,
    onHoverStart,
    onHoverEnd,
    onSkillClick,
    pathElRefs,
    dotElRefs,
    glowElRefs,
    padElRefs,
    flashElRefs,
    ringElRefs,
}: {
    layout: SkillLayout;
    isHighlighted: boolean;
    isDimmed: boolean;
    onHoverStart: (skill: string, category: string) => void;
    onHoverEnd: () => void;
    onSkillClick: (skill: string) => void;
    pathElRefs: React.MutableRefObject<Record<string, SVGPathElement | null>>;
    dotElRefs: React.MutableRefObject<Record<string, SVGCircleElement | null>>;
    glowElRefs: React.MutableRefObject<Record<string, SVGCircleElement | null>>;
    padElRefs: React.MutableRefObject<Record<string, SVGRectElement | null>>;
    flashElRefs: React.MutableRefObject<Record<string, SVGRectElement | null>>;
    ringElRefs: React.MutableRefObject<Record<string, SVGCircleElement | null>>;
}) {
    const { skill, category, side, padX, skillY, d } = layout;

    return (
        <g>
            <path
                ref={(el) => {
                    pathElRefs.current[skill] = el;
                }}
                d={d}
                fill="none"
                stroke={category.color}
                strokeWidth={isHighlighted ? 1.8 : 1}
                opacity={isDimmed ? 0.08 : isHighlighted ? 0.9 : 0.35}
                style={{ transition: "opacity .25s, stroke-width .25s" }}
            />
            <circle
                ref={(el) => {
                    dotElRefs.current[skill] = el;
                }}
                r={3.4}
                fill={category.color}
                opacity={0}
                style={{ filter: `drop-shadow(0 0 4px ${category.color})` }}
            />
            <circle cx={side === "left" ? padX + PAD_W : padX} cy={skillY} r={2} fill={category.color} opacity={0.5} />

            <circle
                ref={(el) => {
                    glowElRefs.current[skill] = el;
                }}
                cx={padX + PAD_W / 2}
                cy={skillY}
                r={20}
                fill={category.color}
                opacity={0}
                style={{ filter: "blur(6px)" }}
            />
            {/* One-shot "target lock" ring — expands and fades the moment a skill is newly selected/hovered */}
            <circle
                ref={(el) => {
                    ringElRefs.current[skill] = el;
                }}
                cx={padX + PAD_W / 2}
                cy={skillY}
                r={0}
                fill="none"
                stroke={category.color}
                strokeWidth={1.5}
                opacity={0}
                style={{ transformOrigin: `${padX + PAD_W / 2}px ${skillY}px` }}
            />
            <rect
                ref={(el) => {
                    padElRefs.current[skill] = el;
                }}
                x={padX}
                y={skillY - 13}
                width={PAD_W}
                height={26}
                fill={isHighlighted ? `${category.color}22` : `${category.color}10`}
                stroke={isHighlighted ? category.color : `${category.color}45`}
                strokeWidth={isHighlighted ? 1.4 : 1}
                style={{
                    transformOrigin: `${padX + PAD_W / 2}px ${skillY}px`,
                    opacity: isDimmed ? 0.25 : 1,
                    cursor: "pointer",
                    transition: "opacity .2s, stroke .2s, fill .2s",
                }}
                onMouseEnter={() => onHoverStart(skill, category.title)}
                onMouseLeave={onHoverEnd}
                onClick={() => onSkillClick(skill)}
            >
                <title>{skill}</title>
            </rect>
            {/* Bright one-shot flash overlay on selection — pointer-events none so it never steals the pad's own hover/click */}
            <rect
                ref={(el) => {
                    flashElRefs.current[skill] = el;
                }}
                x={padX}
                y={skillY - 13}
                width={PAD_W}
                height={26}
                fill="#ffffff"
                opacity={0}
                pointerEvents="none"
            />
            <text
                x={side === "left" ? padX + 12 : padX + PAD_W - 12}
                y={skillY + 4}
                textAnchor={side === "left" ? "start" : "end"}
                className="font-mono pointer-events-none fill-zinc-700 dark:fill-zinc-300"
                style={{
                    fontSize: 12,
                    fill: isHighlighted ? category.color : undefined,
                    fillOpacity: isDimmed ? 0.35 : 1,
                    fontWeight: isHighlighted ? 700 : 500,
                }}
            >
                {skill}
            </text>
        </g>
    );
});

// ─── Circuit board visual — animated by Anime.js ──────────────────────────────

function CircuitBoard({
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
    const hasHover = hoveredSkill !== null || hoveredCategory !== null;
    const activeCategorySet = new Set(activeSkills.map((s) => CATEGORY_OF[s]).filter(Boolean));
    const selectedColors = Array.from(
        new Set(
            activeSkills
                .map((skill) => {
                    const categoryTitle = CATEGORY_OF[skill];
                    return SKILL_CATEGORIES.find((cat) => cat.title === categoryTitle)?.color;
                })
                .filter(Boolean)
        )
    );

    const cpuBackground =
        selectedColors.length === 0
            ? undefined
            : selectedColors.length === 1
                ? `radial-gradient(circle at center, ${selectedColors[0]}30 0%, ${selectedColors[0]}12 45%, transparent 100%)`
                : `conic-gradient(from 180deg at 50% 50%, ${selectedColors
                    .map((color, i) => {
                        const start = (i / selectedColors.length) * 100;
                        const end = ((i + 1) / selectedColors.length) * 100;
                        return `${color}28 ${start}%, ${color}12 ${end}%`;
                    })
                    .join(", ")})`;
    const isMultiSelection = activeSkills.length > 1;

    const displaySkill = hoveredSkill;
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
                    : "Full-stack Developer";

    const { items, labels } = BOARD_LAYOUT;

    // ── Anime.js refs ──
    const pathElRefs = useRef<Record<string, SVGPathElement | null>>({});
    const padElRefs = useRef<Record<string, SVGRectElement | null>>({});
    const dotElRefs = useRef<Record<string, SVGCircleElement | null>>({});
    const glowElRefs = useRef<Record<string, SVGCircleElement | null>>({});
    const flashElRefs = useRef<Record<string, SVGRectElement | null>>({});
    const ringElRefs = useRef<Record<string, SVGCircleElement | null>>({});
    const loopInstances = useRef<Record<string, anime.AnimeInstance[]>>({});
    const cpuGlowRef = useRef<SVGRectElement | null>(null);
    const idleDotRef = useRef<SVGCircleElement | null>(null);
    const prevHighlighted = useRef<Set<string>>(new Set());

    // Always holds the latest interaction state without needing to be a
    // dependency of anything — lets the idle-pulse interval below check
    // "is the board idle right now?" without a stale closure or having to
    // tear down and rebuild the interval on every hover.
    const liveState = useRef({ hasActiveSkills, hoveredSkill, hoveredCategory });
    liveState.current = { hasActiveSkills, hoveredSkill, hoveredCategory };

    // CPU breathing glow — one continuous loop, set up once.
    useEffect(() => {
        if (!cpuGlowRef.current) return;
        const inst = anime({
            targets: cpuGlowRef.current,
            opacity: [0.25, 0.55],
            duration: 1700,
            direction: "alternate",
            loop: true,
            easing: "easeInOutSine",
        });
        return () => anime.remove(cpuGlowRef.current);
    }, []);

    // Pop the pad, and start/stop the current-flow pulse + pad glow, whenever
    // a skill's highlighted state changes.
    useEffect(() => {
        const current = new Set<string>();
        items.forEach(({ skill, category, side }) => {
            const isActive = activeSkills.includes(skill);
            const isHovered = hoveredSkill?.skill === skill || hoveredCategory === category.title;
            if (isActive || isHovered) current.add(skill);
        });

        current.forEach((skill) => {
            if (prevHighlighted.current.has(skill)) return;
            const padEl = padElRefs.current[skill];
            const pathEl = pathElRefs.current[skill];
            const dotEl = dotElRefs.current[skill];
            const glowEl = glowElRefs.current[skill];
            const flashEl = flashElRefs.current[skill];
            const ringEl = ringElRefs.current[skill];
            const loops: anime.AnimeInstance[] = [];

            if (padEl) {
                anime.remove(padEl);
                anime({ targets: padEl, scale: [1, 1.08, 1.02], duration: 480, easing: "easeOutElastic(1, .55)" });
            }
            if (flashEl) {
                anime.remove(flashEl);
                anime({ targets: flashEl, opacity: [0.65, 0], duration: 320, easing: "easeOutQuad" });
            }
            if (ringEl) {
                anime.remove(ringEl);
                anime.set(ringEl, { r: 4, opacity: 0.9 });
                anime({ targets: ringEl, r: 26, opacity: 0, duration: 650, easing: "easeOutQuad" });
            }
            if (glowEl) {
                loops.push(
                    anime({
                        targets: glowEl,
                        opacity: [0.15, 0.55],
                        duration: 900,
                        direction: "alternate",
                        loop: true,
                        easing: "easeInOutSine",
                    })
                );
            }
            if (pathEl && dotEl) {
                anime.remove(dotEl);
                anime.set(dotEl, { opacity: 0 });
                const path = anime.path(pathEl);
                // A quick bright burst races to the pad first, then the
                // animation settles into the steady looping current-flow —
                // gives selection a distinct "power-on" moment instead of
                // just fading straight into the ambient loop.
                const timeline = anime.timeline();
                timeline
                    .add({ targets: dotEl, opacity: [0, 1], duration: 120, easing: "easeOutQuad" })
                    .add({ targets: dotEl, translateX: path("x"), translateY: path("y"), duration: 420, easing: "easeOutQuad" })
                    .add({ targets: dotEl, translateX: path("x"), translateY: path("y"), duration: 1100, loop: true, easing: "linear" });
                loops.push(timeline);
            }
            loopInstances.current[skill] = loops;
        });

        prevHighlighted.current.forEach((skill) => {
            if (current.has(skill)) return;
            const padEl = padElRefs.current[skill];
            const dotEl = dotElRefs.current[skill];
            const glowEl = glowElRefs.current[skill];
            const flashEl = flashElRefs.current[skill];
            const ringEl = ringElRefs.current[skill];

            if (padEl) anime({ targets: padEl, scale: 1, duration: 250, easing: "easeOutQuad" });
            if (dotEl) anime({ targets: dotEl, opacity: 0, duration: 200, easing: "easeOutQuad" });
            if (glowEl) anime.set(glowEl, { opacity: 0 });
            if (flashEl) anime.set(flashEl, { opacity: 0 });
            if (ringEl) anime.set(ringEl, { opacity: 0 });

            (loopInstances.current[skill] || []).forEach((inst) => inst.pause());
            delete loopInstances.current[skill];
        });

        prevHighlighted.current = current;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSkills, hoveredSkill, hoveredCategory]);

    // Idle ambient pulse — when nothing is hovered or selected, send a faint
    // signal traveling a random trace every few seconds, so the board reads
    // as powered-on rather than static. Reads liveState.current each tick
    // instead of depending on hover/selection state directly, so this effect
    // only needs to run once and never has a stale view of that state.
    useEffect(() => {
        const idleDot = idleDotRef.current;
        if (!idleDot) return;

        const interval = window.setInterval(() => {
            const { hasActiveSkills: busy, hoveredSkill: hs, hoveredCategory: hc } = liveState.current;
            if (busy || hs || hc) return; // stay quiet during real interaction

            const candidate = items[Math.floor(Math.random() * items.length)];
            const pathEl = pathElRefs.current[candidate.skill];
            if (!pathEl) return;

            anime.remove(idleDot);
            anime.set(idleDot, { opacity: 0, translateX: 0, translateY: 0 });
            const path = anime.path(pathEl);
            anime({
                targets: idleDot,
                translateX: path("x"),
                translateY: path("y"),
                opacity: [0, 0.65, 0],
                duration: 950,
                easing: "easeInOutSine",
            });
        }, 2600);

        return () => {
            window.clearInterval(interval);
            anime.remove(idleDot);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Stable across renders (empty deps + functional form) so it never busts
    // SkillNode's memoization just because CircuitBoard itself re-rendered.
    const handleHoverStart = useCallback((skill: string, category: string) => onHover({ skill, category }), [onHover]);
    const handleHoverEnd = useCallback(() => onHover(null), [onHover]);

    return (
        <div className="relative w-full select-none">
            {/* Corner brackets + tech tag */}
            <span className="absolute -top-3 -left-3 w-4 h-4 sm:w-5 sm:h-5 border-t border-l border-emerald-500/40 pointer-events-none z-10" />
            <span className="absolute -top-3 -right-3 w-4 h-4 sm:w-5 sm:h-5 border-t border-r border-emerald-500/40 pointer-events-none z-10" />
            <span className="absolute -bottom-3 -left-3 w-4 h-4 sm:w-5 sm:h-5 border-b border-l border-emerald-500/40 pointer-events-none z-10" />
            <span className="absolute -bottom-3 -right-3 w-4 h-4 sm:w-5 sm:h-5 border-b border-r border-emerald-500/40 pointer-events-none z-10" />
            <span className="absolute -top-6 left-0 text-[8px] font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase select-none">
                skill_matrix // board_v1
            </span>
            <span className="absolute -top-6 right-0 flex items-center gap-1.5 text-[8px] font-mono tracking-[0.2em] uppercase select-none">
                <span className={`w-1 h-1 rounded-full ${hasActiveSkills ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
                <span className={hasActiveSkills ? "text-amber-600/80 dark:text-amber-400/70" : "text-emerald-600/70 dark:text-emerald-500/60"}>
                    {hasActiveSkills ? "filtered" : "live"}
                </span>
            </span>

            <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto overflow-visible relative z-1" style={{ aspectRatio: `${VB_W}/${VB_H}` }}>
                <BoardStatic cpuGlowRef={cpuGlowRef} />

                {/* Category labels — dynamic (dim state), so these stay outside BoardStatic */}
                {labels.map((l) => {
                    const dimmed = hasActiveSkills
                        ? !activeCategorySet.has(l.title)
                        : hasHover && hoveredSkill?.category !== l.title && hoveredCategory !== l.title;
                    return (
                        <text
                            key={l.title}
                            x={l.x}
                            y={l.y}
                            textAnchor={l.anchor}
                            className="font-mono uppercase tracking-widest"
                            style={{ fontSize: 11, fill: l.color, opacity: dimmed ? 0.15 : 0.85, transition: "opacity .3s" }}
                        >
                            {l.short} // {l.title}
                        </text>
                    );
                })}

                {/* Skill nodes — each one memoized, only re-renders when its own highlight state changes */}
                {items.map((layout) => {
                    const isActive = activeSkills.includes(layout.skill);
                    const isHighlighted = isActive || hoveredSkill?.skill === layout.skill || hoveredCategory === layout.category.title;
                    const isDimmed = hasActiveSkills ? !isActive : hasHover && !isHighlighted;
                    return (
                        <SkillNode
                            key={layout.skill}
                            layout={layout}
                            isHighlighted={isHighlighted}
                            isDimmed={isDimmed}
                            onHoverStart={handleHoverStart}
                            onHoverEnd={handleHoverEnd}
                            onSkillClick={onSkillClick}
                            pathElRefs={pathElRefs}
                            dotElRefs={dotElRefs}
                            glowElRefs={glowElRefs}
                            padElRefs={padElRefs}
                            flashElRefs={flashElRefs}
                            ringElRefs={ringElRefs}
                        />
                    );
                })}

                {/* Idle ambient pulse — a single shared dot, repositioned onto a
                    random trace every cycle while the board is untouched */}
                <circle
                    ref={idleDotRef}
                    r={2.6}
                    fill="#34d399"
                    opacity={0}
                    style={{ filter: "drop-shadow(0 0 3px #34d399)" }}
                />

                {/* CPU readout — the only part of the chip that needs to re-render on hover */}
                <foreignObject
                    x={CPU_X - CPU_W / 2}
                    y={CPU_Y - CPU_H / 2}
                    width={CPU_W}
                    height={CPU_H}
                >
                    <div
                        className="w-full h-full flex items-center justify-center px-3 relative overflow-hidden"
                        style={{
                            background: cpuBackground,
                            transition: "background 0.5s ease",
                        }}
                    >
                        {/* Soft color glow */}
                        {selectedColors.length > 0 && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        selectedColors.length === 1
                                            ? `radial-gradient(circle, ${selectedColors[0]}25 0%, transparent 70%)`
                                            : `linear-gradient(135deg, ${selectedColors
                                                .map((color) => `${color}20`)
                                                .join(", ")})`,
                                    filter: "blur(8px)",
                                }}
                            />
                        )}

                        <AnimatePresence mode="wait">
                            <m.div
                                key={centerTitle}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.16 }}
                                className="relative z-10 flex flex-col items-center text-center"
                            >
                                <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-50 leading-tight font-mono">
                                    {centerTitle}
                                </span>

                                <span
                                    className="text-[9px] font-mono tracking-widest uppercase mt-1"
                                    style={{
                                        color:
                                            selectedColors.length === 1
                                                ? selectedColors[0]
                                                : selectedColors.length > 1
                                                    ? "#a1a1aa"
                                                    : undefined,
                                    }}
                                >
                                    {centerSub}
                                </span>
                            </m.div>
                        </AnimatePresence>
                    </div>
                </foreignObject>
            </svg>
        </div>
    );
}

// ─── Compact circuit variant — mobile/tablet ──────────────────────────────────
// The landscape fan-out layout above needs real width to stay legible. Below
// the lg breakpoint we swap to this: CPU on top, a simple vertical spine, and
// each category's skills as normal wrapping HTML chips underneath. Real text
// and native flex-wrap mean it can never become too small to read.

function CircuitBoardCompact({
    activeSkills,
    hoveredSkill,
    onSkillClick,
    onHover,
}: {
    activeSkills: string[];
    hoveredSkill: HoveredSkill;
    onSkillClick: (skill: string) => void;
    onHover: (val: HoveredSkill) => void;
}) {
    const hasActiveSkills = activeSkills.length > 0;
    const isMultiSelection = activeSkills.length > 1;
    const centerTitle = hoveredSkill
        ? hoveredSkill.skill
        : isMultiSelection
            ? `${activeSkills.length} Skills`
            : activeSkills[0] ?? "Bilal Amir";
    const centerSub = hoveredSkill
        ? hoveredSkill.category
        : isMultiSelection
            ? "Selected"
            : activeSkills[0]
                ? CATEGORY_OF[activeSkills[0]]
                : "Next.js Developer";

    return (
        <div className="relative">
            <span className="absolute -top-6 left-0 text-[8px] font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase select-none">
                skill_matrix // board_v1
            </span>
            <span className="absolute -top-6 right-0 flex items-center gap-1.5 text-[8px] font-mono tracking-[0.2em] uppercase select-none">
                <span className={`w-1 h-1 rounded-full ${hasActiveSkills ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
                <span className={hasActiveSkills ? "text-amber-600/80 dark:text-amber-400/70" : "text-emerald-600/70 dark:text-emerald-500/60"}>
                    {hasActiveSkills ? "filtered" : "live"}
                </span>
            </span>

            <div className="pt-8">
                <div className="mx-auto w-full max-w-70 border border-emerald-500/40 bg-zinc-50/95 dark:bg-zinc-950/90 px-4 py-3 text-center">
                    <AnimatePresence mode="wait">
                        <m.div
                            key={centerTitle}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.16 }}
                        >
                            <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-50 font-mono">{centerTitle}</span>
                            <span className="block text-[9px] font-mono tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mt-1">
                                {centerSub}
                            </span>
                        </m.div>
                    </AnimatePresence>
                </div>

                <div className="w-px h-6 bg-emerald-500/40 mx-auto" />

                {SKILL_CATEGORIES.map((cat, idx) => {
                    const activeCount = cat.skills.filter((s) => activeSkills.includes(s)).length;
                    return (
                        <div key={cat.title}>
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="w-2 h-2 rotate-45 shrink-0" style={{ backgroundColor: cat.color }} />
                                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: cat.color }}>
                                    {cat.title}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 tabular-nums">
                                    {activeCount > 0 ? `${activeCount}/${cat.skills.length}` : cat.index}
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 pb-5">
                                {cat.skills.map((skill) => {
                                    const isActive = activeSkills.includes(skill);
                                    const isDimmed = hasActiveSkills && !isActive;
                                    const isHovered = hoveredSkill?.skill === skill;
                                    return (
                                        <SkillPill
                                            key={skill}
                                            skill={skill}
                                            color={cat.color}
                                            isActive={isActive}
                                            isDimmed={isDimmed}
                                            isHovered={isHovered}
                                            onClick={() => onSkillClick(skill)}
                                            onHoverStart={() => onHover({ skill, category: cat.title })}
                                            onHoverEnd={() => onHover(null)}
                                        />
                                    );
                                })}
                            </div>

                            {idx < SKILL_CATEGORIES.length - 1 && (
                                <div className="w-px h-4 bg-zinc-300/40 dark:bg-zinc-700/40 mx-auto -mt-2 mb-1" />
                            )}
                        </div>
                    );
                })}
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
                relative pl-3 pr-3.5 py-1.5 text-xs font-mono border flex items-center gap-2
                transition-colors duration-200 cursor-pointer select-none
                ${isDimmed
                    ? "bg-zinc-100/30 dark:bg-zinc-900/30 border-zinc-200/40 dark:border-zinc-800/40 text-zinc-400 dark:text-zinc-600 pointer-events-none"
                    : on
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "bg-zinc-100/70 dark:bg-zinc-900/50 border-zinc-300/50 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }
            `}
            style={{
                borderLeftWidth: 2,
                borderLeftColor: on && !isDimmed ? color : undefined,
                backgroundColor: on && !isDimmed ? `${color}18` : undefined,
                borderColor: on && !isDimmed ? `${color}aa` : undefined,
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
    const isLit = isCategoryHovered || activeCount > 0;

    return (
        <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 110, damping: 18 }}
            className="relative flex flex-col gap-3.5 p-4 sm:p-5 bg-zinc-100/30 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-300"
            style={{
                borderColor: isLit ? `${category.color}80` : undefined,
                boxShadow: isLit ? `inset 0 0 0 1px ${category.color}25` : undefined,
            }}
        >
            <span className="absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: category.color }} />
            <span className="absolute -top-px -right-px w-2.5 h-2.5 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: category.color }} />
            <span className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: category.color }} />
            <span className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: category.color }} />

            <div className="flex items-center justify-between">
                <button
                    onMouseEnter={onHeaderHoverStart}
                    onMouseLeave={onHeaderHoverEnd}
                    onClick={onHeaderClick}
                    className="flex items-center gap-2.5 text-left cursor-pointer group"
                >
                    <span
                        className="w-2.5 h-2.5 shrink-0 rotate-45 transition-transform duration-200 group-hover:scale-125"
                        style={{ backgroundColor: category.color, boxShadow: isCategoryHovered ? `0 0 8px ${category.color}` : undefined }}
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
                className="flex flex-wrap content-start gap-2"
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

    const handleSkillClick = useCallback(
        (skill: string) => {
            setActiveSkills(activeSkills.length === 1 && activeSkills[0] === skill ? [] : [skill]);
        },
        [activeSkills, setActiveSkills]
    );

    const handleCategoryClick = useCallback(
        (title: string) => {
            const category = SKILL_CATEGORIES.find((c) => c.title === title);
            if (!category) return;
            const isSameCategorySelected =
                activeSkills.length === category.skills.length && category.skills.every((s) => activeSkills.includes(s));
            setActiveSkills(isSameCategorySelected ? [] : category.skills);
        },
        [activeSkills, setActiveSkills]
    );

    const totalSkills = SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0);

    return (
        <section id="skills" className="container relative">
            <LazyMotion features={domAnimation}>
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

                {/* Circuit board — full fan-out diagram at lg+, compact vertical version below it */}
                <div className="hidden lg:block mb-6 py-6">
                    <CircuitBoard
                        activeSkills={activeSkills}
                        hoveredSkill={hoveredSkill}
                        hoveredCategory={hoveredCategory}
                        onSkillClick={handleSkillClick}
                        onHover={setHoveredSkill}
                    />
                </div>
                <div className="lg:hidden mb-6">
                    <CircuitBoardCompact
                        activeSkills={activeSkills}
                        hoveredSkill={hoveredSkill}
                        onSkillClick={handleSkillClick}
                        onHover={setHoveredSkill}
                    />
                </div>
                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 text-center mb-10 sm:mb-14">
                    {hasActiveSkills ? "Traces filtered to selection — clear to reset" : "Hover a pad or a category chip to inspect · click to filter"}
                </p>

                {/* Category panels — readable list + click/hover source of truth on every screen size */}
                <LayoutGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch gap-4 lg:gap-5 mb-10">
                        {SKILL_CATEGORIES.map((cat) => (
                            <CategoryPanel
                                key={cat.title}
                                category={cat}
                                activeSkills={activeSkills}
                                hoveredSkill={hoveredSkill}
                                isCategoryHovered={hoveredCategory === cat.title}
                                onSkillClick={handleSkillClick}
                                onSkillHoverStart={(skill) =>
                                    setHoveredSkill({ skill, category: cat.title })
                                }
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
                            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/5 border border-emerald-500/15">
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