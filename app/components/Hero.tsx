
"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LinkedinIcon } from "../assets/icons/LinkedinIcon";

export default function Hero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
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

    // ADD THIS FUNCTION: Smooth scroll without changing the URL
    const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 px-6 pt-20">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-3xl flex flex-col items-start gap-6"
            >
                <motion.div variants={itemVariants} className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <p className="text-emerald-400 font-mono text-sm uppercase tracking-wider">
                        Web Developer
                    </p>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight">
                    Hi, I'm Bilal Amir. <br />
                    <span className="text-zinc-400">Next.js & Headless CMS Specialist.</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
                    I specialize in translating complex Figma design systems into scalable, production-ready React and Next.js code. My focus is on enterprise headless CMS integrations, seamlessly bridging backend data via Sitecore JSS (GraphQL) and Strapi APIs with modern frontend architecture.
                </motion.p>

                <motion.div variants={itemVariants} className="flex items-center gap-4 pt-4">
                    <a
                        href="#projects"
                        onClick={scrollToProjects}
                        className="group flex items-center gap-2 bg-zinc-50 text-zinc-950 px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                        View Projects
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <Link
                        href="https://www.linkedin.com/in/bilalamirweb/"
                        target="_blank"
                        className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all"
                    >
                        <LinkedinIcon className="w-5 h-5 text-zinc-50" />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}