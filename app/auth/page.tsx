"use client";

import { motion } from "framer-motion";
import { AuthForm } from "@/components/ui/auth_form";
import { ShieldAlert, Terminal } from "lucide-react";

export default function AuthPage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center bg-transparent px-4 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-[450px]">
                {/* Top Branding for Auth */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col items-center text-center"
                >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                        <ShieldAlert size={24} className="text-black" />
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                        Vera <span className="text-cyan-500">Access</span>
                    </h1>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-slate-500">
                        Authorization Required // Level 4 Encrypted
                    </p>
                </motion.div>

                {/* The 3D Auth Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ perspective: "1000px" }}
                >
                    <AuthForm />
                </motion.div>

                {/* Bottom Ticker */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 flex items-center justify-center gap-4 text-[9px] font-mono text-white/10"
                >
                    <div className="flex items-center gap-2"><Terminal size={10} /> IP_LOGGED</div>
                    <div className="h-1 w-1 rounded-full bg-white/10" />
                    <div>STMT: SECURED_NODE</div>
                </motion.div>
            </div>
        </main>
    );
}