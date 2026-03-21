"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileCard } from "@/components/ui/profile_card";
import { VeraButton } from "@/components/ui/vera-button";
import { LogOut, ShieldAlert, Activity, Globe, Zap, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountPage() {
    const router = useRouter();
    const [isTerminating, setIsTerminating] = useState(false);

    const handleSignOut = async () => {
        setIsTerminating(true);
        // Badass artificial delay for "Wiping Data" effect
        await new Promise((r) => setTimeout(r, 2000));
        router.push("/auth");
    };

    return (
        <>
            {/* TERMINATION OVERLAY */}
            <AnimatePresence>
                {isTerminating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black font-mono"
                    >
                        <motion.div
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 0.1 }}
                            className="text-red-500 text-xl font-black italic tracking-tighter"
                        >
                            &gt; TERMINATING_NEURAL_LINK...
                        </motion.div>
                        <div className="mt-4 w-48 h-[2px] bg-white/10 overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="h-full w-full bg-red-600 shadow-[0_0_15px_red]"
                            />
                        </div>
                        <p className="mt-4 text-[10px] text-white/20 uppercase tracking-[0.5em]">Purging local cache</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT - Background set to transparent to show NeuralBackground */}
            <main className="relative min-h-screen bg-transparent px-4 py-24 overflow-hidden">
                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                <div className="mx-auto max-w-5xl relative z-10">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12 border-l-2 border-cyan-500 pl-6"
                    >
                        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase md:text-5xl">
                            User <span className="text-cyan-500">Profile</span>
                        </h1>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                            Node Identity: VRA-0882-DEMO // Status: Online
                        </p>
                    </motion.div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Left Column: The Holographic Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="lg:col-span-7"
                        >
                            <ProfileCard />

                            {/* Status Tickers Below Card */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <QuickStat icon={<Activity size={14} />} label="Neural Uptime" value="142h 12m" />
                                <QuickStat icon={<Globe size={14} />} label="Network Path" value="Secure-Vpn-01" />
                            </div>
                        </motion.div>

                        {/* Right Column: Security Log & Actions */}
                        <div className="space-y-6 lg:col-span-5">
                            {/* Live Security Log */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <ShieldAlert size={14} className="text-cyan-400" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Security Log</h3>
                                </div>
                                <div className="space-y-3 font-mono text-[10px]">
                                    <LogEntry time="14:22:01" msg="Neural session initialized" color="text-cyan-500" />
                                    <LogEntry time="14:22:05" msg="Integrity check: 100%" color="text-emerald-500" />
                                    <LogEntry time="14:45:12" msg="Potential scan detected" color="text-amber-500" />
                                    <motion.div
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="h-[2px] w-full bg-cyan-500/20"
                                    />
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 gap-3">
                                <ActionButton icon={<Settings size={18} />} label="Settings" />
                                <ActionButton icon={<Zap size={18} />} label="Upgrade Neural Plan" />

                                <VeraButton
                                    variant="danger"
                                    onClick={handleSignOut}
                                    className="mt-4 h-14 w-full rounded-2xl font-black italic uppercase tracking-widest group"
                                >
                                    <LogOut size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
                                    Terminate Session
                                </VeraButton>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

// Sub-components
function QuickStat({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
                {icon}
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
            </div>
            <p className="text-sm font-black text-white italic">{value}</p>
        </div>
    );
}

function LogEntry({ time, msg, color }: { time: string, msg: string, color: string }) {
    return (
        <div className="flex items-center gap-3 border-l border-white/10 pl-3">
            <span className="text-slate-600">{time}</span>
            <span className={cn("tracking-tight", color)}>{msg}</span>
        </div>
    );
}

function ActionButton({ icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex items-center justify-between w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
                <span className="text-cyan-400 group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-xs font-black italic uppercase tracking-tighter text-white">{label}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_cyan] transition-all" />
        </button>
    );
}