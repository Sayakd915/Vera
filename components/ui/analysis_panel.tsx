"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Activity, Zap, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const data = [
    { label: "Neural Load", value: "24.8%", icon: Cpu, color: "text-cyan-400" },
    { label: "System Integrity", value: "99.9%", icon: ShieldCheck, color: "text-emerald-400" },
    { label: "Sync Velocity", value: "1.2ms", icon: Zap, color: "text-amber-400" },
    { label: "Active Nodes", value: "1,402", icon: Activity, color: "text-blue-400" },
];

export function AnalysisPanel() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.map((item, idx) => (
                <AnalysisCard key={idx} item={item} />
            ))}
        </div>
    );
}

function AnalysisCard({ item }: { item: typeof data[0] }) {
    const Icon = item.icon;

    // Parallax Mouse Tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // Background glow moves further than the text for "depth"
    const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["-20%", "20%"]);
    const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["-20%", "20%"]);

    // Text/Icon moves subtly
    const contentX = useTransform(mouseXSpring, [-0.5, 0.5], [5, -5]);
    const contentY = useTransform(mouseYSpring, [-0.5, 0.5], [5, -5]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02 }}
            className="group relative h-40 overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-colors hover:border-white/20"
        >
            {/* Dynamic 3D Glow (The "Depth" Layer) */}
            <motion.div
                style={{ x: glowX, y: glowY }}
                className="absolute -inset-10 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
                <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)]" />
            </motion.div>

            {/* Content Layer (Moves opposite to glow) */}
            <motion.div style={{ x: contentX, y: contentY }} className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className={cn("rounded-xl bg-white/5 p-2 ring-1 ring-white/10", item.color)}>
                        <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Vera.OS</span>
                </div>

                <div>
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{item.label}</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold tracking-tighter text-white">{item.value}</p>
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Bottom Border "Scan" Line Effect */}
            <motion.div
                className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
        </motion.div>
    );
}