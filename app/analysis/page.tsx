"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { VeraButton } from "@/components/ui/vera-button";
import { VeraLoader } from "@/components/ui/loader";
import { Shield, Activity, Zap, Terminal, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalysisPage() {
    const { user, isLoaded: userLoaded } = useUser();
    const [booting, setBooting] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setBooting(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleScan = async () => {
        if (!inputText.trim()) return;
        setIsScanning(true);
        setShowResult(false);
        await new Promise(r => setTimeout(r, 3500));
        setIsScanning(false);
        setShowResult(true);
    };

    if (booting) return <SystemBoot />;

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-transparent px-4 overflow-hidden pt-20">
            {/* GRID OVERLAY */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* LIVE DATA TICKERS */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-10 opacity-30">
                <div className="flex justify-between text-[9px] font-mono text-cyan-500/50 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                        <Activity size={10} />
                        OPERATOR: {user?.firstName?.toUpperCase() || "UNIDENTIFIED"}
                    </div>
                    <div>LATENCY: 0.0012MS</div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-cyan-500/50 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2"><Zap size={10} /> ENCRYPTION: NEURAL_GCM_256</div>
                    <div>NODE: {user?.id.slice(0, 12).toUpperCase() || "AUTH_PENDING"}</div>
                </div>
            </div>

            <div className="relative z-10 flex w-full max-w-7xl gap-6" style={{ perspective: "2500px" }}>

                {/* LEFT SIDE: INTAKE */}
                <motion.div
                    initial={{ rotateY: -15, opacity: 0, x: -30 }}
                    animate={{ rotateY: 0, opacity: 1, x: 0 }}
                    className="relative flex-1 rounded-[2.5rem] border border-white/10 bg-black/40 p-8 backdrop-blur-3xl shadow-2xl"
                >
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Terminal size={18} className="text-cyan-500" />
                            <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                                Neural <span className="text-cyan-500">Intake</span>
                            </h2>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    </div>

                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="h-[400px] w-full bg-transparent font-mono text-sm leading-relaxed text-cyan-100/60 outline-none placeholder:text-white/10 resize-none border-none focus:ring-0 selection:bg-cyan-500/30"
                        placeholder="[ DEPOSIT DATA STREAM FOR NEURAL DECODING... ]"
                    />

                    <VeraButton
                        onClick={handleScan}
                        className="relative mt-8 h-20 w-full text-xl font-black italic uppercase overflow-hidden"
                        disabled={isScanning || !inputText.trim()}
                    >
                        <span className="relative z-10">{isScanning ? "DECODING..." : "INITIATE SCAN"}</span>
                    </VeraButton>
                </motion.div>

                {/* RIGHT SIDE: ANALYZER */}
                <motion.div
                    initial={{ rotateY: 15, opacity: 0, x: 30 }}
                    animate={{ rotateY: 0, opacity: 1, x: 0 }}
                    className="relative flex-1 rounded-[2.5rem] border border-white/5 bg-black/60 p-8 overflow-hidden backdrop-blur-3xl"
                >
                    <AnimatePresence mode="wait">
                        {isScanning ? (
                            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center gap-8">
                                <VeraLoader />
                                <div className="space-y-2 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 animate-pulse">Analyzing Patterns</p>
                                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-cyan-500 shadow-[0_0_15px_cyan]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3.5 }} />
                                    </div>
                                </div>
                            </motion.div>
                        ) : showResult ? (
                            <motion.div key="res" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-1.5 text-[10px] font-black text-red-500 uppercase border border-red-500/20">
                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                                        High-Level Threat Detected
                                    </div>
                                    <div className="space-y-3 font-mono text-[11px] text-cyan-400/70 border-l border-white/10 pl-4">
                                        <p>&gt; STATUS: CLASSIFICATION_COMPLETE</p>
                                        <p>&gt; SOURCE: RAW_TEXT_INPUT_STREAM</p>
                                        <p>&gt; MALWARE_SIGNATURE: POSITIVE (98.4%)</p>
                                        <p>&gt; RECOMMENDATION: ISOLATE_AND_PURGE</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <ResultStat label="Risk Index" value="CRITICAL" color="text-red-500" />
                                    <ResultStat label="Confidence" value="99.2%" color="text-cyan-400" />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center opacity-10 grayscale">
                                <Shield className="h-20 w-20 mb-4" />
                                <span className="text-[10px] font-black uppercase tracking-[1em]">Idle Sequence</span>
                            </div>
                        )}
                    </AnimatePresence>
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
                </motion.div>
            </div>
        </main>
    );
}

function ResultStat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="rounded-2xl bg-white/5 border border-white/5 p-5 backdrop-blur-md">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-1">{label}</span>
            <span className={cn("text-2xl font-black italic tracking-tighter", color)}>{value}</span>
        </div>
    );
}

function SystemBoot() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black font-mono">
            <div className="max-w-xs w-full space-y-3">
                <div className="flex justify-between text-[9px] text-cyan-500/40 uppercase mb-4 tracking-[0.2em]">
                    <span>Vera Neural OS</span>
                    <span>v2.0.4_BETA</span>
                </div>
                <BootLine delay={0.1} text="MAPPING_NEURAL_FLOWS..." color="text-cyan-500" />
                <BootLine delay={0.3} text="SYNCHRONIZING_WITH_NODE_01... [OK]" />
                <BootLine delay={0.5} text="UPLINK_STABLE." color="text-emerald-400" />
                <div className="pt-4">
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-[1px] bg-cyan-500 shadow-[0_0_15px_cyan]" />
                </div>
            </div>
        </div>
    );
}

function BootLine({ text, delay, color = "text-white/40" }: { text: string, delay: number, color?: string }) {
    return (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }} className={cn("text-[10px] leading-tight", color)}>
            &gt; {text}
        </motion.p>
    );
}