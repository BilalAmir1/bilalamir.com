"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { LinkedinIcon } from "../assets/icons/LinkedinIcon";

const STACK = ["Next.js", "React", "TypeScript", "Node.js", "Laravel", "GraphQL"];

export default function Hero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const stackContainerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.1 },
        },
    };

    const stackItemVariants: Variants = {
        hidden: { opacity: 0, y: 8, scale: 0.94 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 260, damping: 20 },
        },
    };

    // Smooth scroll without changing the URL
    const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section
            id="hero"
            className="container relative min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 pt-20 overflow-hidden"
        >
            {/* Ambient background — faint dot grid + radial glow, matches the rest of the site's technical framing */}
            <div
                className="absolute inset-0 -z-10 opacity-[0.4] dark:opacity-[0.25] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                    color: "rgb(161 161 170 / 0.5)",
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 75%)",
                }}
            />
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 w-150 h-150 rounded-full opacity-30 dark:opacity-20 pointer-events-none blur-3xl"
                style={{ background: "radial-gradient(circle, #34d399 0%, transparent 70%)" }}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-3xl flex flex-col items-start gap-6"
            >
                <motion.div variants={itemVariants} className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <p className="text-emerald-600 dark:text-emerald-400 font-mono text-sm uppercase tracking-wider">
                            Full-Stack Developer
                        </p>
                    </div>
                    <span className="text-zinc-300 dark:text-zinc-700">/</span>
                    <p className="font-mono text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                        Frontend-Focused
                    </p>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight">
                    Hi, I'm Bilal Amir. <br />
                    <span className="text-zinc-600 dark:text-zinc-400">Full-Stack Developer, Frontend-Focused.</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                    I build modern, production-ready web applications end to end — leading with Next.js and React on the frontend, translating complex Figma systems into pixel-perfect, scalable UI, while handling backend work in Node.js, Laravel, and MySQL, and integrating REST/GraphQL APIs and headless CMS platforms like Sitecore and Strapi.
                </motion.p>
                <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                    I build with an AI-augmented workflow — using tools like Cursor and Claude to accelerate development without compromising code quality or architecture.
                </motion.p>

                {/* Tech stack strip — quick visual proof of the full-stack range mentioned above */}
                <motion.div
                    variants={stackContainerVariants}
                    className="flex flex-wrap items-center gap-2 pt-1"
                >
                    {STACK.map((tech) => (
                        <motion.span
                            key={tech}
                            variants={stackItemVariants}
                            className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center gap-4 pt-4">
                    <a
                        href="#projects"
                        onClick={scrollToProjects}
                        className="group flex items-center gap-2 bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 px-6 py-3 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                        View Projects
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <Link
                        href="https://www.linkedin.com/in/bilalamirweb/"
                        target="_blank"
                        aria-label="LinkedIn"
                        className="group p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                    >
                        <LinkedinIcon className="w-5 h-5 text-zinc-950 dark:text-zinc-50" />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link
                        href="https://www.upwork.com/freelancers/~01ac985da68feed8f8?mp_source=share"
                        target="_blank"
                        aria-label="Upwork"
                        className="group p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all"
                    >
                        <Briefcase className="w-5 h-5 text-zinc-950 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                        <span className="sr-only">Upwork</span>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}