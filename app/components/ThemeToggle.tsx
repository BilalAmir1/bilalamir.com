
"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

type ViewTransitionDocument = Document & {
    startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid a hydration mismatch: the server doesn't know the visitor's
    // theme, so render a neutral placeholder until the client settles.
    useEffect(() => setMounted(true), []);

    const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
        const next = resolvedTheme === "dark" ? "light" : "dark";
        const doc = document as ViewTransitionDocument;

        // Origin point for the radial reveal — read by the
        // @keyframes theme-reveal rule in globals.css.
        document.documentElement.style.setProperty("--x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--y", `${e.clientY}px`);

        if (!doc.startViewTransition) {
            setTheme(next);
            return;
        }

        doc.startViewTransition(() => {
            flushSync(() => setTheme(next));
        });
    };

    return (
        <LazyMotion features={domAnimation}>
            <m.button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle light and dark theme"
                whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 18 } }}
                whileTap={{ scale: 0.92 }}
                className="
                    fixed top-4 right-4 sm:top-6 sm:right-6 z-50
                    flex items-center justify-center w-11 h-11 rounded-full
                    bg-zinc-100/70 dark:bg-zinc-900/70 backdrop-blur-xl
                    border border-zinc-200/80 dark:border-zinc-800/80
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]
                    hover:border-emerald-500/40 hover:shadow-[0_0_16px_rgba(16,185,129,0.18)]
                    transition-colors duration-300 cursor-pointer
                    disabled:cursor-default
                "
                disabled={!mounted}
            >
                <span className="relative w-4.5 h-4.5 block">
                    <AnimatePresence mode="wait" initial={false}>
                        {mounted && resolvedTheme === "dark" ? (
                            <m.span
                                key="moon"
                                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Moon className="w-4.5 h-4.5 text-zinc-300" />
                            </m.span>
                        ) : (
                            <m.span
                                key="sun"
                                initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Sun className="w-4.5 h-4.5 text-zinc-600" />
                            </m.span>
                        )}
                    </AnimatePresence>
                </span>
            </m.button>
        </LazyMotion>
    );
}