"use client";

import { motion } from "framer-motion";

// CRITICAL: Must be 'export default'
export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
            <div className="relative h-24 w-24">
                {/* Triple Orbiting Rings */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-t-2 border-cyan-500"
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.2,
                        }}
                    />
                ))}
                {/* Core Glow */}
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-6 rounded-full bg-cyan-500 blur-xl shadow-[0_0_50px_rgba(34,211,238,1)]"
                />
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400"
            >
                Synchronizing Vera Neural Link
            </motion.p>
        </div>
    );
}