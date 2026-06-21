"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const items = [
    "Frontend Development",
    "Next.js Applications",
    "Headless CMS Integrations",
    "Sitecore & Strapi Projects",
    "Remote Opportunities",
    "Enterprise Web Platforms",
];

export default function AvailabilityBanner() {
    const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const contactSection = document.getElementById("contact");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section id="availability" className="container">
            <LazyMotion features={domAnimation}>
                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 text-center md:text-left flex flex-col items-center md:items-start"
                >
                    <p className="text-[10px] font-mono tracking-[0.2em] text-emerald-500 uppercase mb-4 select-none">
                        Availability
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-950 dark:text-zinc-50">
                        Open to New Opportunities
                    </h2>
                    <div className="w-16 h-0.5 bg-emerald-500 rounded-full mb-4" />
                    <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                        Currently available for frontend engineering roles,
                        headless CMS implementations, enterprise Next.js
                        projects, and long-term product development.
                    </p>
                </m.div>

                {/* Banner Card – clean, no gradients, no blur */}
                <m.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="
                        relative
                        rounded-3xl
                        border border-zinc-200/70
                        dark:border-zinc-800/70
                        bg-zinc-100/30
                        dark:bg-zinc-900/20
                        p-8 md:p-10
                    "
                >
                    {/* Corner Accents (matching other cards) */}
                    <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-zinc-300/70 dark:border-zinc-700/70 rounded-tl-lg pointer-events-none" />
                    <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-zinc-300/70 dark:border-zinc-700/70 rounded-tr-lg pointer-events-none" />
                    <span className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-zinc-300/70 dark:border-zinc-700/70 rounded-bl-lg pointer-events-none" />
                    <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-zinc-300/70 dark:border-zinc-700/70 rounded-br-lg pointer-events-none" />

                    <div className="relative z-10">
                        {/* Status Pill */}
                        <m.div
                            className="inline-flex items-center gap-2 mb-8 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2"
                            animate={{ boxShadow: ["0 0 0 0 rgba(16,185,129,0)", "0 0 0 4px rgba(16,185,129,0.1)", "0 0 0 0 rgba(16,185,129,0)"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-emerald-500">
                                Available for work
                            </span>
                        </m.div>

                        {/* Main Content: Headline + Stats */}
                        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
                                    Helping teams build scalable digital
                                    experiences.
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mb-6">
                                    I specialize in modern frontend development,
                                    enterprise headless CMS integrations, and
                                    high-performance Next.js applications.
                                    Whether it's a greenfield product or a
                                    large-scale migration, I focus on clean
                                    architecture, maintainability, and
                                    exceptional user experiences.
                                </p>
                                {/* Button – matches Hero's "View Projects" exactly */}
                                <a href="#contact"
                                    onClick={scrollToContact}
                                    className="
                                            group
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-6
                                            py-3
                                            rounded-full
                                            border
                                            border-emerald-500/30
                                            bg-emerald-500/10
                                            text-emerald-600
                                            dark:text-emerald-400
                                            font-medium
                                            transition-all
                                            duration-300
                                            hover:bg-emerald-500/15
                                            hover:border-emerald-500/50
                                            hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]
                                            ">
                                    Let's Talk
                                    <ArrowRight
                                        className="
                                            w-4
                                            h-4
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    />
                                </a>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Years Experience", value: "3+" },
                                    { label: "Projects Delivered", value: "15+" },
                                    { label: "CMS Platforms", value: "4+" },
                                    { label: "Components Built", value: "100+" },
                                ].map((stat, idx) => (
                                    <m.div
                                        key={idx}
                                        whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
                                        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)]"
                                    >
                                        <p className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {stat.label}
                                        </p>
                                    </m.div>
                                ))}
                            </div>
                        </div>

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                            {items.map((item, index) => (
                                <m.div
                                    key={item}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 0.1 + index * 0.05,
                                        duration: 0.3,
                                    }}
                                    whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
                                    className="
                                        group
                                        flex items-center gap-3
                                        rounded-xl
                                        border border-zinc-200/80
                                        dark:border-zinc-800/80
                                        bg-white/60
                                        dark:bg-zinc-950/40
                                        p-4
                                        transition-all duration-300
                                        hover:border-emerald-500/30
                                        hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]
                                        dark:hover:bg-zinc-950/70
                                        relative overflow-hidden
                                    "
                                >
                                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-emerald-500/10 to-transparent" />
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                        {item}
                                    </span>
                                </m.div>
                            ))}
                        </div>
                    </div>
                </m.div>
            </LazyMotion>
        </section>
    );
}