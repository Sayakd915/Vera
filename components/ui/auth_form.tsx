"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { VeraButton } from "@/components/ui/vera-button";
import { VeraLoader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

export function AuthForm() {
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn() as any;
    const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp() as any;

    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signInLoaded || !signUpLoaded) return;

        setIsLoading(true);
        setError("");

        try {
            if (mode === "signin") {
                const result = await signIn.create({ identifier: email, password });
                if (result.status === "complete") {
                    await setSignInActive({ session: result.createdSessionId });
                    // Use window.location.href if router.push feels "stuck"
                    window.location.href = "/analysis";
                }
            } else {
                const result = await signUp.create({
                    emailAddress: email,
                    password: password,
                    firstName: name.split(" ")[0] || "Operator",
                });

                if (result.status === "complete") {
                    await setSignUpActive({ session: result.createdSessionId });
                    // FORCE REDIRECT
                    window.location.href = "/analysis";
                }
            }
        } catch (err: any) {
            setIsLoading(false); // Make sure this turns OFF if there's an error
            setError(err.errors?.[0]?.message?.toUpperCase() || "CONNECTION_FAILED");
        }
    };

    const signInWithSocial = async (strategy: "oauth_google" | "oauth_github") => {
        try {
            if (!signInLoaded || !signIn) return;
            console.log(`Redirecting to ${strategy} vector...`);
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/analysis",
            });
        } catch (err) {
            console.error("OAuth Vector Failed:", err);
        }
    };

    return (
        <div className="relative w-full max-w-[420px] rounded-[2.5rem] border border-white/10 bg-black/40 p-10 backdrop-blur-3xl shadow-2xl">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[380px] flex-col items-center justify-center">
                        <VeraLoader />
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 animate-pulse">Establishing Link...</p>
                    </motion.div>
                ) : (
                    <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                                {mode === "signin" ? "Neural Access" : "Create Node"}
                            </h2>
                            {error && (
                                <motion.p initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="mt-4 text-[9px] font-bold text-red-500 bg-red-500/10 py-2 rounded border border-red-500/20 uppercase tracking-widest text-center px-2">
                                    {error}
                                </motion.p>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {mode === "signup" && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black uppercase text-slate-500 ml-2 italic">Identity</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="OPERATOR_NAME" className="w-full rounded-2xl border border-white/5 bg-black/60 px-6 py-4 text-sm text-white outline-none focus:border-cyan-500/50 transition-all focus:bg-black/80" required />
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-black uppercase text-slate-500 ml-2 italic">Neural Hash</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@vera.net" className="w-full rounded-2xl border border-white/5 bg-black/60 px-6 py-4 text-sm text-white outline-none focus:border-cyan-500/50 transition-all focus:bg-black/80" required />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-black uppercase text-slate-500 ml-2 italic">Access Key</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl border border-white/5 bg-black/60 px-6 py-4 text-sm text-white outline-none focus:border-cyan-500/50 transition-all focus:bg-black/80" required />
                            </div>

                            <VeraButton type="submit" className="w-full mt-4 h-16 font-black italic uppercase text-lg shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                                Establish Link
                            </VeraButton>
                        </form>

                        <div className="mt-10 grid grid-cols-2 gap-4">
                            <SocialBtn label="Google" disabled={!mounted || !signInLoaded} onClick={() => signInWithSocial("oauth_google")} />
                            <SocialBtn label="GitHub" disabled={!mounted || !signInLoaded} onClick={() => signInWithSocial("oauth_github")} />
                        </div>

                        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-10 w-full text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/40 hover:text-cyan-400 transition-all text-center underline-offset-4 hover:underline">
                            {mode === "signin" ? "// Register_Identity" : "// Return_to_Access"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SocialBtn({ label, onClick, disabled }: { label: string, onClick: () => void, disabled: boolean }) {
    return (
        <button type="button" onClick={onClick} disabled={disabled} className={cn("h-14 rounded-2xl border border-white/5 bg-white/5 text-[11px] font-black uppercase tracking-widest transition-all", disabled ? "opacity-20 cursor-not-allowed text-slate-600" : "text-slate-500 hover:bg-white/10 hover:text-white hover:border-white/10 shadow-sm")}>
            {label}
        </button>
    );
}