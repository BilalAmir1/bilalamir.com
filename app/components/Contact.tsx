// components/Contact.tsx
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Mail, ArrowUpRight, Send, Loader2, Phone } from "lucide-react";
import { useState, useId, forwardRef } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser"; // <-- 1. Import EmailJS
import { LinkedinIcon } from "../assets/icons/LinkedinIcon";

// ─── Types ──────────────────────────────────────────────────────────────────

type FormState = "idle" | "submitting" | "success" | "error";

interface FormFields {
    name: string;
    email: string;
    message: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CONTACT_LINKS = [
    {
        label: "Email",
        value: "bilalamir610@gmail.com",
        href: "mailto:bilalamir610@gmail.com",
        icon: Mail,
    },
    {
        label: "Phone",
        value: "+92 307 4418334",
        href: "tel:+923074418334",
        icon: Phone,
    },
    {
        label: "LinkedIn",
        value: "linkedin.com/in/bilalamirweb",
        href: "https://linkedin.com/in/bilalamirweb",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
            <LinkedinIcon {...props} />
        ),
    },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContactLink({ href, icon: Icon, label, value }: (typeof CONTACT_LINKS)[number]) {
    return (
        <a
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="group flex items-center gap-4 py-3.5 border-b border-zinc-800/60 last:border-0 transition-colors duration-200 hover:border-zinc-700/80"
        >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-200">
                <Icon className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-200" />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase select-none">
                    {label}
                </span>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200 truncate">
                    {value}
                </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-emerald-400 ml-auto shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
    );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    id: string;
    error?: string;
    as?: "input" | "textarea";
    rows?: number;
}

const Field = forwardRef<HTMLInputElement & HTMLTextAreaElement, FieldProps>(
    ({ label, id, error, as = "input", rows, ...props }, ref) => {
        const Tag = as;
        return (
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor={id}
                    className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase select-none"
                >
                    {label}
                </label>
                <Tag
                    ref={ref}
                    id={id}
                    rows={rows}
                    {...props}
                    className={`
                        w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-sm text-zinc-200
                        placeholder:text-zinc-700 outline-none resize-none
                        transition-colors duration-200
                        focus:border-emerald-500/40 focus:bg-zinc-900/80
                        ${error ? "border-red-500/50" : "border-zinc-800/80"}
                        ${as === "textarea" ? "leading-relaxed" : ""}
                    `}
                />
                {error && (
                    <p className="text-[10px] text-red-400 font-mono mt-1">{error}</p>
                )}
            </div>
        );
    }
);
Field.displayName = "Field";

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Contact() {
    const nameId = useId();
    const emailId = useId();
    const messageId = useId();

    const [formState, setFormState] = useState<FormState>("idle");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>();

    const onSubmit = async (data: FormFields) => {
        setFormState("submitting");
        try {
            const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
            const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
            const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    from_name: data.name,
                    reply_to: data.email,
                    message: data.message,
                },
                PUBLIC_KEY
            );

            setFormState("success");
            reset();
            setTimeout(() => setFormState("idle"), 5000);
        } catch (error: any) {
            console.error("FAILED...", {
                message: error?.message,
                text: error?.text,
                status: error?.status,
                error,
            });

            setFormState("error");
        }
    };

    return (
        <section id="contact" className="container">
            <LazyMotion features={domAnimation}>
                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16"
                >
                    <p className="text-[10px] font-mono tracking-[0.2em] text-emerald-500 uppercase mb-4 select-none">
                        Get in touch
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-50">
                        Let's Build Together
                    </h2>
                    <div className="w-16 h-0.5 bg-emerald-500 rounded-full" />
                </m.div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 md:gap-16 items-start">
                    {/* Left — info */}
                    <m.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.1 }}
                        className="flex flex-col gap-8"
                    >
                        <p className="text-zinc-400 text-base leading-relaxed">
                            Have a project in mind or want to discuss a role? I'm available for freelance
                            engagements and full-time positions. Drop a message and I'll get back within
                            24 hours.
                        </p>

                        <div className="flex flex-col">
                            {CONTACT_LINKS.map((link) => (
                                <ContactLink key={link.label} {...link} />
                            ))}
                        </div>

                        <div className="flex items-center gap-2.5 mt-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-xs font-mono text-zinc-500">
                                Available for new projects
                            </span>
                        </div>
                    </m.div>

                    {/* Right — form */}
                    <m.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Corner accents */}
                        <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-zinc-700/60 rounded-tl-lg pointer-events-none z-10" />
                        <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-zinc-700/60 rounded-tr-lg pointer-events-none z-10" />
                        <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-zinc-700/60 rounded-bl-lg pointer-events-none z-10" />
                        <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-zinc-700/60 rounded-br-lg pointer-events-none z-10" />

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                            className="flex flex-col gap-5 p-7 rounded-3xl bg-zinc-900/20 border border-zinc-800/50"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field
                                    as="input"
                                    id={nameId}
                                    label="Name"
                                    type="text"
                                    placeholder="Your name"
                                    autoComplete="name"
                                    disabled={isSubmitting}
                                    error={errors.name?.message}
                                    {...register("name", { required: "Name is required." })}
                                />
                                <Field
                                    as="input"
                                    id={emailId}
                                    label="Email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                    error={errors.email?.message}
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." }
                                    })}
                                />
                            </div>

                            <Field
                                as="textarea"
                                id={messageId}
                                label="Message"
                                placeholder="Tell me about your project…"
                                rows={5}
                                disabled={isSubmitting}
                                error={errors.message?.message}
                                {...register("message", {
                                    required: "Message is required.",
                                    minLength: { value: 20, message: "Message must be at least 20 characters." }
                                })}
                            />

                            {formState === "success" && (
                                <m.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2"
                                >
                                    ✓ Message sent — I'll be in touch soon.
                                </m.p>
                            )}
                            {formState === "error" && (
                                <m.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs font-mono text-red-400 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2"
                                >
                                    Something went wrong. Please try again or email me directly.
                                </m.p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="
                                    group relative flex items-center justify-center gap-2.5
                                    w-full py-3.5 rounded-xl text-sm font-semibold
                                    bg-emerald-500 text-zinc-950
                                    hover:bg-emerald-400 active:scale-[0.98]
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                    transition-all duration-200
                                    overflow-hidden
                                "
                            >
                                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none" />

                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </m.div>
                </div>
            </LazyMotion>
        </section>
    );
}