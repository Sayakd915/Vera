"use client";

import { motion } from "framer-motion";

export function VeraLoader() {
    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative h-24 w-24">
                {/* The "Neural" Hexagon Stroke */}
                <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <motion.circle
                        cx="48"
                        cy="48"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-cyan-500/20"
                    />
                    <motion.circle
                        cx="48"
                        cy="48"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="100 300"
                        className="text-cyan-400"
                        animate={{
                            strokeDashoffset: [0, -400],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </svg>

                {/* Outer Pulsing Geometry */}
                {[...Array(2)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-xl border border-cyan-500/50"
                        animate={{
                            rotate: i % 2 === 0 ? 360 : -360,
                            scale: [1, 1.1, 1],
                            borderRadius: ["20%", "50%", "20%"],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    />
                ))}

                {/* Central Glitch Core */}
                <motion.div
                    className="absolute inset-6 rounded-full bg-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.8)]"
                    animate={{
                        scale: [1, 1.2, 0.9, 1.1, 1],
                        filter: [
                            "hue-rotate(0deg) brightness(1)",
                            "hue-rotate(90deg) brightness(1.5)",
                            "hue-rotate(0deg) brightness(1)",
                        ],
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />

                {/* Data Particles */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={`p-${i}`}
                        className="absolute h-1 w-1 bg-white shadow-[0_0_8px_white]"
                        animate={{
                            top: ["0%", "100%"],
                            left: [`${25 * i}%`, `${25 * i}%`],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center gap-2">
                    <span className="h-1 w-1 animate-ping rounded-full bg-red-500" />
                    <motion.p
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400"
                    >
                        Decoding Neural Stream
                    </motion.p>
                </div>
                <p className="font-mono text-[9px] text-slate-500 uppercase">
                    Bypassing Firewalls... 98%
                </p>
            </div>
        </div>
    );
}