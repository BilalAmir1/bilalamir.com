// components/Architecture.tsx
"use client";

import { LazyMotion, domAnimation, m, Variants, useInView } from "framer-motion";
import { Database, Layout, Share2, Globe, Server, Smartphone } from "lucide-react";
import { useRef } from "react";

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
}

function ArchNode({ icon, title, subtitle, step, accent = false }: NodeProps) {
    return (
        <m.div variants={nodeVariants} className="flex flex-col items-center gap-3 w-44 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase select-none">
                {step}
            </span>
            <div
                className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center relative
                    transition-all duration-300
                    ${accent
                        ? "bg-emerald-500/10 border border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.12)]"
                        : "bg-zinc-900 border border-zinc-700/80 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:border-zinc-500 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                    }
                `}
            >
                {accent && (
                    <>
                        <span className="absolute inset-0 rounded-2xl border border-emerald-500/30 animate-[ping_3.5s_linear_infinite] opacity-40" />
                        <span className="absolute -inset-1.5 rounded-[20px] border border-emerald-500/10 animate-[ping_3.5s_linear_infinite_0.5s] opacity-20" />
                    </>
                )}
                {icon}
            </div>
            <div className="flex flex-col items-center gap-1">
                <h3 className={`font-semibold text-base ${accent ? "text-emerald-400" : "text-zinc-100"}`}>
                    {title}
                </h3>
                <p className="text-zinc-500 text-xs text-center leading-relaxed">{subtitle}</p>
            </div>
        </m.div>
    );
}

// ─── The Restored Dot Connector ──────────────────────────────────────────

interface ConnectorProps {
    delay?: number;
    label?: string;
}

function Connector({ delay = 0, label }: ConnectorProps) {
    return (
        <>
            {/* Desktop / Tablet Landscape Connector (Horizontal) */}
            <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative z-0 mx-4 mt-8">
                {label && (
                    <span className="absolute -top-6 text-[9px] font-mono text-zinc-500 tracking-widest uppercase select-none whitespace-nowrap">
                        {label}
                    </span>
                )}
                <div className="relative w-full flex items-center h-4">
                    {/* Static track */}
                    <div className="absolute w-full border-t-2 border-zinc-800/80" />

                    {/* Glowing Moving Dot */}
                    <m.div
                        className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] z-10"
                        initial={{ left: "0%", opacity: 0 }}
                        animate={{
                            left: ["0%", "100%"],
                            opacity: [0, 1, 1, 0] // Fades in at start, out at end
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay }}
                    />
                </div>
            </div>

            {/* Mobile / Tablet Portrait Connector (Vertical) */}
            <div className="flex lg:hidden flex-col items-center justify-center w-full relative z-0 my-2 py-4 h-24">
                {label && (
                    <span className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase mb-3 select-none text-center">
                        {label}
                    </span>
                )}
                <div className="relative h-full flex justify-center w-4">
                    {/* Static track */}
                    <div className="absolute h-full border-l-2 border-zinc-800/80" />

                    {/* Glowing Moving Dot */}
                    <m.div
                        className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] z-10"
                        initial={{ top: "0%", opacity: 0 }}
                        animate={{
                            top: ["0%", "100%"],
                            opacity: [0, 1, 1, 0] // Fades in at top, out at bottom
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay }}
                    />
                </div>
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
                bg-zinc-900/40 border border-zinc-800/60
                hover:border-zinc-700/80 hover:bg-zinc-900/60
                transition-colors duration-300 cursor-default
            "
        >
            <div className="flex items-start justify-between">
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                    {icon}
                </div>
                <span className="text-[9px] font-mono tracking-widest text-emerald-500/70 uppercase bg-emerald-500/5 border border-emerald-500/10 rounded-full px-2 py-1">
                    {tag}
                </span>
            </div>
            <div className="flex flex-col gap-1.5">
                <h4 className="text-zinc-50 font-semibold text-base">{title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
            </div>
        </m.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function Architecture() {
    const diagramRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(diagramRef, { once: true, margin: "-80px" });

    return (
        <section id="architecture" className="py-24 px-6 md:px-12 max-w-6xl mx-auto overflow-hidden">
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
                        System Design
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-50">
                        The Decoupled Advantage
                    </h2>
                    <div className="w-16 h-0.5 bg-emerald-500 rounded-full mb-5" />
                    <p className="text-zinc-400 max-w-2xl text-base leading-relaxed">
                        Traditional monolithic systems are slow and rigid. I build decoupled platforms where
                        content lives independently — delivered via modern APIs to highly optimised, secure
                        Next.js frontends.
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
                        bg-zinc-900/20 border border-zinc-800/50
                    "
                >
                    {/* Corner accents */}
                    <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-zinc-700/60 rounded-tl-lg pointer-events-none" />
                    <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-zinc-700/60 rounded-tr-lg pointer-events-none" />
                    <span className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-zinc-700/60 rounded-bl-lg pointer-events-none" />
                    <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-zinc-700/60 rounded-br-lg pointer-events-none" />

                    <ArchNode
                        step="01 — Source"
                        icon={<Database className="w-8 h-8 text-zinc-300" />}
                        title="Headless CMS"
                        subtitle="Sitecore JSS · Strapi"
                    />

                    <Connector delay={0} label="GraphQL / REST" />

                    <ArchNode
                        step="02 — Gateway"
                        icon={<Share2 className="w-8 h-8 text-emerald-400" />}
                        title="API Layer"
                        subtitle="Schema stitching"
                        accent
                    />

                    <Connector delay={1} label="Typed Data" />

                    <ArchNode
                        step="03 — Output"
                        icon={<Layout className="w-8 h-8 text-zinc-300" />}
                        title="Presentation"
                        subtitle="Next.js · Tailwind"
                    />
                </m.div>

                {/* Value Propositions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
                    <ValueCard
                        index={0}
                        icon={<Globe className="w-5 h-5 text-emerald-400" />}
                        title="Omnichannel Delivery"
                        tag="Multi-target"
                        description="The same CMS content served simultaneously to web, mobile, and IoT — no business logic duplicated across channels."
                    />
                    <ValueCard
                        index={1}
                        icon={<Server className="w-5 h-5 text-emerald-400" />}
                        title="Unmatched Performance"
                        tag="SSG · ISR · Edge"
                        description="Pages pre-rendered at build time on the edge, eliminating runtime database queries and maximising Core Web Vitals."
                    />
                    <ValueCard
                        index={2}
                        icon={<Smartphone className="w-5 h-5 text-emerald-400" />}
                        title="Future-Proof Scaling"
                        tag="Loosely coupled"
                        description="Swap your CMS, redesign your UI, or migrate your database — the other layers remain untouched."
                    />
                </div>

            </LazyMotion>
        </section>
    );
}