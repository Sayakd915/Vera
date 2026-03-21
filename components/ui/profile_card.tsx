"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { User, ShieldCheck, Globe, Fingerprint } from "lucide-react";

export function ProfileCard() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // High-end 3D tilt
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    // The "Holographic" sheen position
    const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <div className="flex items-center justify-center p-4" style={{ perspective: "1200px" }}>
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="group relative h-[280px] w-[450px] overflow-hidden rounded-[2rem] border border-white/20 bg-[#0a0a0a] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
                {/* HOLOGRAPHIC SHEEN LAYER */}
                <motion.div
                    style={{ left: sheenX, top: sheenY }}
                    className="pointer-events-none absolute -inset-[100%] z-10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_50%)] blur-3xl"
                />

                {/* MESH GRADIENT BACKGROUND */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,#22d3ee_0%,transparent_50%)]" />
                </div>

                <div className="relative z-20 flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-cyan-500/50 bg-black/50 p-1">
                                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-cyan-500/10">
                                        <User className="h-8 w-8 text-cyan-400" />
                                    </div>
                                </div>
                                {/* Online Status Dot */}
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0a0a0a] bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                            </div>

                            <div>
                                <h3 className="text-xl font-black italic tracking-tighter text-white">OPERATOR_01</h3>
                                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-500/60">Verified Identity</p>
                            </div>
                        </div>
                        <Fingerprint className="h-8 w-8 text-white/10 group-hover:text-cyan-500/40 transition-colors" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-8">
                            <Stat label="Clearance" value="Level 4" />
                            <Stat label="Region" value="Global" icon={<Globe size={10} />} />
                            <Stat label="Status" value="Shielded" icon={<ShieldCheck size={10} />} />
                        </div>

                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <div className="flex items-center justify-between font-mono text-[9px] text-white/20 uppercase tracking-[0.3em]">
                            <span>ID: VRA-8829-X</span>
                            <span>Exp: 03/2028</span>
                        </div>
                    </div>
                </div>

                {/* REFLECTIVE BORDER EDGE */}
                <div className="absolute inset-0 rounded-[2rem] border border-white/5 group-hover:border-cyan-500/30 transition-colors duration-500" />
            </motion.div>
        </div>
    );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
            <div className="flex items-center gap-1.5">
                {icon && <span className="text-cyan-500">{icon}</span>}
                <span className="text-xs font-black text-white italic">{value}</span>
            </div>
        </div>
    );
}