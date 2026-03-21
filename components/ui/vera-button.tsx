"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Change this line to use HTMLMotionProps
type VeraButtonProps = HTMLMotionProps<"button"> & {
    children: ReactNode;
    variant?: "primary" | "ghost" | "danger";
};

export function VeraButton({
    children,
    className,
    variant = "primary",
    ...props
}: VeraButtonProps) {
    const variants = {
        primary:
            "border-cyan-400/30 bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600 text-black shadow-[0_12px_30px_rgba(34,211,238,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_18px_45px_rgba(34,211,238,0.35),inset_0_1px_0_rgba(255,255,255,0.5)]",
        ghost:
            "border-white/10 bg-white/5 text-white shadow-[0_12px_28px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/10 hover:border-white/20",
        danger:
            "border-red-400/30 bg-gradient-to-b from-red-400 via-red-500 to-red-600 text-white shadow-[0_12px_30px_rgba(239,68,68,0.2),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_18px_45px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.35)]",
    } as const;

    return (
        <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className={cn(
                "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 text-sm font-medium backdrop-blur-md transition-all duration-300",
                "active:translate-y-0",
                variants[variant],
                className,
            )}
            {...props} // Now TypeScript is happy because props matches motion.button's expectations
        >
            <span className="relative z-10">{children}</span>

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
        </motion.button>
    );
}