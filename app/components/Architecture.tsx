"use client";

import { LazyMotion, domAnimation, m, Variants, useInView } from "framer-motion";
import { Database, Layout, Share2, Globe, Server, Smartphone } from "lucide-react";
import { useRef, useEffect } from "react";
import anime from "animejs";

// ─── Variants ─────────────────────────────────────────────────────────────

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.18, delayChildren: 0.1 },
    },
};

const nodeVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 120, damping: 16 },
    },
};

const propCardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 18, delay: i * 0.12 },
    }),
};

// ─── Sub-components ───────────────────────────────────────────────────────

interface NodeProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    step: string;
    accent?: boolean;
    iconRef?: (el: HTMLDivElement | null) => void;
    flashRef?: (el: HTMLDivElement | null) => void;
    ringRef?: (el: HTMLDivElement | null) => void;
}

function ArchNode({ icon, title, subtitle, step, accent = false, iconRef, flashRef, ringRef }: NodeProps) {
    return (
        <m.div variants={nodeVariants} className="flex flex-col items-center gap-3 w-44 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 dark:text-zinc-600 uppercase select-none">
                {step}
            </span>
            <div
                ref={iconRef}
                className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center relative
                    transition-all duration-300
                    ${accent
                        ? "bg-emerald-500/10 border border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.12)]"
                        : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-700/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:border-zinc-500 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                    }
                `}
            >
                {accent && (
                    <>
                        <span className="absolute inset-0 rounded-2xl border border-emerald-500/30 animate-[ping_3.5s_linear_infinite] opacity-40" />
                        <span className="absolute -inset-1.5 rounded-[20px] border border-emerald-500/10 animate-[ping_3.5s_linear_infinite_0.5s] opacity-20" />
                    </>
                )}
                {/* One-shot power-on flash — driven by Anime.js, fires once when the diagram scrolls into view */}
                <div ref={flashRef} className="absolute inset-0 rounded-2xl bg-white pointer-events-none opacity-0" />
                {/* Accent-only "specialization" ring — expands and fades once, after the node pops in */}
                {accent && (
                    <div
                        ref={ringRef}
                        className="absolute inset-0 rounded-2xl border-2 border-emerald-400 pointer-events-none opacity-0"
                    />
                )}
                {icon}
            </div>
            <div className="flex flex-col items-center gap-1">
                <h3 className={`font-semibold text-base ${accent ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                    {title}
                </h3>
                <p className="text-zinc-500 text-xs text-center leading-relaxed">{subtitle}</p>
                {accent && (
                    <span className="mt-1 text-[8px] font-mono tracking-widest uppercase text-emerald-600/70 dark:text-emerald-500/60 select-none">
                        Specialization
                    </span>
                )}
            </div>
        </m.div>
    );
}

// ─── Circuit-style connector — track draws itself in, then a two-dot comet
// trail flows continuously, using the same Anime.js techniques as the
// Skills section's circuit board for a consistent visual language. ──────────

interface ConnectorProps {
    delay?: number;
    label?: string;
    isInView: boolean;
}

function Connector({ delay = 0, label, isInView }: ConnectorProps) {
    const hTrackRef = useRef<SVGLineElement | null>(null);
    const hDotRefs = useRef<(SVGCircleElement | null)[]>([]);
    const vTrackRef = useRef<SVGLineElement | null>(null);
    const vDotRefs = useRef<(SVGCircleElement | null)[]>([]);
    const fired = useRef(false);

    useEffect(() => {
        if (!isInView || fired.current) return;
        fired.current = true;
        const cleanupTargets: (SVGElement | null)[] = [];

        const setupFlow = (trackEl: SVGLineElement | null, dots: (SVGCircleElement | null)[], drawDuration: number, flowDuration: number) => {
            if (!trackEl) return;
            cleanupTargets.push(trackEl, ...dots);
            const len = trackEl.getTotalLength();
            anime.set(trackEl, { strokeDasharray: len, strokeDashoffset: len });
            anime({
                targets: trackEl,
                strokeDashoffset: 0,
                duration: drawDuration,
                delay: delay * 1000,
                easing: "easeInOutSine",
                complete: () => {
                    const path = anime.path(trackEl);
                    dots.forEach((dot, i) => {
                        if (!dot) return;
                        anime.set(dot, { opacity: 0 });
                        anime({
                            targets: dot,
                            translateX: path("x"),
                            translateY: path("y"),
                            opacity: [0, 0.9, 0],
                            duration: flowDuration,
                            delay: i * (flowDuration / dots.length),
                            loop: true,
                            easing: "linear",
                        });
                    });
                },
            });
        };

        setupFlow(hTrackRef.current, hDotRefs.current, 700, 2200);
        setupFlow(vTrackRef.current, vDotRefs.current, 550, 1700);

        return () => {
            anime.remove(cleanupTargets.filter(Boolean) as SVGElement[]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView]);

    return (
        <>
            {/* Desktop / Tablet Landscape Connector (Horizontal) */}
            <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative z-0 mx-4 mt-8">
                {label && (
                    <span className="absolute -top-6 text-[9px] font-mono text-zinc-500 tracking-widest uppercase select-none whitespace-nowrap">
                        {label}
                    </span>
                )}
                <svg className="w-full h-4 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <line x1={0} y1={5} x2={100} y2={5} className="stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth={1} />
                    <line ref={hTrackRef} x1={0} y1={5} x2={100} y2={5} stroke="#34d399" strokeWidth={1.5} opacity={0.7} />
                    {[0, 1].map((i) => (
                        <circle
                            key={i}
                            ref={(el) => {
                                hDotRefs.current[i] = el;
                            }}
                            r={1.7}
                            fill="#34d399"
                            opacity={0}
                            style={{ filter: "drop-shadow(0 0 3px #34d399)" }}
                        />
                    ))}
                </svg>
            </div>

            {/* Mobile / Tablet Portrait Connector (Vertical) */}
            <div className="flex lg:hidden flex-col items-center justify-center w-full relative z-0 my-2 py-4 h-24">
                {label && (
                    <span className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase mb-3 select-none text-center">
                        {label}
                    </span>
                )}
                <svg className="h-full w-4 overflow-visible" preserveAspectRatio="none" viewBox="0 0 10 100">
                    <line x1={5} y1={0} x2={5} y2={100} className="stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth={1} />
                    <line ref={vTrackRef} x1={5} y1={0} x2={5} y2={100} stroke="#34d399" strokeWidth={1.5} opacity={0.7} />
                    {[0, 1].map((i) => (
                        <circle
                            key={i}
                            ref={(el) => {
                                vDotRefs.current[i] = el;
                            }}
                            r={1.7}
                            fill="#34d399"
                            opacity={0}
                            style={{ filter: "drop-shadow(0 0 3px #34d399)" }}
                        />
                    ))}
                </svg>
            </div>
        </>
    );
}

// ─── Value Card ──────────────────────────────────────────────────────────

interface ValueCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    tag: string;
    index: number;
}

function ValueCard({ icon, title, description, tag, index }: ValueCardProps) {
    return (
        <m.div
            custom={index}
            variants={propCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="
                group flex flex-col gap-4 p-5 rounded-2xl
                bg-zinc-100/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60
                hover:border-zinc-300/80 dark:hover:border-zinc-700/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60
                transition-colors duration-300 cursor-default
            "
        >
            <div className="flex items-start justify-between">
                <div className="p-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-colors">
                    {icon}
                </div>
                <span className="text-[9px] font-mono tracking-widest text-emerald-700/80 dark:text-emerald-500/70 uppercase bg-emerald-500/5 border border-emerald-500/10 rounded-full px-2 py-1">
                    {tag}
                </span>
            </div>
            <div className="flex flex-col gap-1.5">
                <h4 className="text-zinc-950 dark:text-zinc-50 font-semibold text-base">{title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
            </div>
        </m.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function Architecture() {
    const diagramRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(diagramRef, { once: true, margin: "-80px" });

    // Node power-on refs — fired once, staggered left to right, when the diagram enters view.
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
    const flashRefs = useRef<(HTMLDivElement | null)[]>([]);
    const accentRingRef = useRef<HTMLDivElement | null>(null);
    const powerOnFired = useRef(false);

    useEffect(() => {
        if (!isInView || powerOnFired.current) return;
        powerOnFired.current = true;
        const cleanupTargets: (HTMLDivElement | null)[] = [...iconRefs.current, ...flashRefs.current, accentRingRef.current];

        iconRefs.current.forEach((el, i) => {
            if (!el) return;
            anime({ targets: el, scale: [0.9, 1.08, 1], duration: 520, delay: 300 + i * 380, easing: "easeOutElastic(1, .55)" });
        });
        flashRefs.current.forEach((el, i) => {
            if (!el) return;
            anime({ targets: el, opacity: [0.5, 0], duration: 380, delay: 300 + i * 380, easing: "easeOutQuad" });
        });
        if (accentRingRef.current) {
            anime({
                targets: accentRingRef.current,
                scale: [1, 1.4],
                opacity: [0.8, 0],
                duration: 700,
                delay: 300 + 2 * 380 + 150,
                easing: "easeOutQuad",
            });
        }

        return () => anime.remove(cleanupTargets.filter(Boolean) as HTMLDivElement[]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView]);

    return (
        <section id="architecture" className="container relative">
            <LazyMotion features={domAnimation}>

                {/* Ambient background — matches the faint dot grid used in Hero/Skills for cross-section consistency */}
                <div
                    className="absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.2] pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                        color: "rgb(161 161 170 / 0.5)",
                        maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
                    }}
                />

                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center md:text-left flex flex-col items-center md:items-start"
                >
                    <p className="text-[10px] font-mono tracking-[0.2em] text-emerald-600 dark:text-emerald-500 uppercase mb-4 select-none">
                        System Design
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-950 dark:text-zinc-50">
                        Full-Stack Architecture, Frontend-Led.
                    </h2>
                    <div className="w-16 h-0.5 bg-emerald-500 rounded-full mb-5" />
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl text-base leading-relaxed">
                        I build across the full stack — backend logic and data in Node.js, Laravel, or MySQL,
                        content in headless CMS platforms like Sitecore and Strapi — connected through typed
                        APIs to fast, accessible Next.js frontends, which is where my focus and strongest work sit.
                    </p>
                </m.div>

                {/* Architecture Diagram */}
                <m.div
                    ref={diagramRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="
                        relative flex flex-col lg:flex-row items-center justify-between
                        w-full px-6 py-10 lg:p-10 rounded-3xl
                        bg-zinc-100/20 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/50
                    "
                >
                    {/* Corner accents */}
                    <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-zinc-300/60 dark:border-zinc-700/60 rounded-tl-lg pointer-events-none" />
                    <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-zinc-300/60 dark:border-zinc-700/60 rounded-tr-lg pointer-events-none" />
                    <span className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-zinc-300/60 dark:border-zinc-700/60 rounded-bl-lg pointer-events-none" />
                    <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-zinc-300/60 dark:border-zinc-700/60 rounded-br-lg pointer-events-none" />

                    {/* Status tags — same mono/pulse language used on the Skills circuit board */}
                    <span className="absolute -top-6 left-3 text-[8px] font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase select-none hidden sm:block">
                        system_flow // v1
                    </span>
                    <span className="absolute -top-6 right-3 flex items-center gap-1.5 text-[8px] font-mono tracking-[0.2em] uppercase select-none">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-600/70 dark:text-emerald-500/60">live</span>
                    </span>

                    <ArchNode
                        step="01 — Source"
                        icon={<Database className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />}
                        title="Backend & Data"
                        subtitle="Laravel · Node.js · Headless CMS"
                        iconRef={(el) => {
                            iconRefs.current[0] = el;
                        }}
                        flashRef={(el) => {
                            flashRefs.current[0] = el;
                        }}
                    />

                    <Connector delay={0} label="REST · GraphQL" isInView={isInView} />

                    <ArchNode
                        step="02 — Gateway"
                        icon={<Share2 className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />}
                        title="API Layer"
                        subtitle="Schema & data mapping"
                        iconRef={(el) => {
                            iconRefs.current[1] = el;
                        }}
                        flashRef={(el) => {
                            flashRefs.current[1] = el;
                        }}
                    />

                    <Connector delay={1} label="Typed Data" isInView={isInView} />

                    <ArchNode
                        step="03 — Output"
                        icon={<Layout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
                        title="Frontend"
                        subtitle="Next.js · React · TypeScript"
                        accent
                        iconRef={(el) => {
                            iconRefs.current[2] = el;
                        }}
                        flashRef={(el) => {
                            flashRefs.current[2] = el;
                        }}
                        ringRef={(el) => {
                            accentRingRef.current = el;
                        }}
                    />
                </m.div>

                {/* Value Propositions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
                    <ValueCard
                        index={0}
                        icon={<Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                        title="Omnichannel Delivery"
                        tag="Multi-target"
                        description="The same backend or CMS content served simultaneously to web, mobile, and IoT — no business logic duplicated across channels."
                    />
                    <ValueCard
                        index={1}
                        icon={<Server className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                        title="Unmatched Performance"
                        tag="SSG · ISR · Edge"
                        description="Pages pre-rendered at build time on the edge, eliminating runtime database queries and maximising Core Web Vitals."
                    />
                    <ValueCard
                        index={2}
                        icon={<Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                        title="Future-Proof Scaling"
                        tag="Loosely coupled"
                        description="Swap your backend, redesign your UI, or migrate your database — the other layers remain untouched."
                    />
                </div>

            </LazyMotion>
        </section>
    );
}