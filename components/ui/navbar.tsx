"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, ScanSearch, UserCircle2, Lock } from "lucide-react";
import { motion, LayoutGroup, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
// 1. Import Clerk Components
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";

const navItems = [
    { href: "/auth", label: "Auth", icon: Shield },
    { href: "/analysis", label: "Analysis", icon: ScanSearch },
    { href: "/account", label: "Account", icon: UserCircle2 },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-8 right-8 z-50">
            <div className="flex items-center gap-3 rounded-[2rem] border border-white/10 bg-black/80 p-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
                <LayoutGroup>
                    {navItems.map((item) => (
                        <NavLink key={item.href} item={item} active={pathname === item.href} />
                    ))}
                </LayoutGroup>

                {/* --- CLERK AUTH SECTOR --- */}
                <div className="ml-2 flex items-center border-l border-white/10 pl-4 pr-2">
                    <SignOutButton>
                        <Link href="/auth">
                            <motion.button
                                whileHover={{ scale: 1.05, color: "#22d3ee" }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 text-[10px] font-black uppercase italic tracking-widest text-white/40 transition-colors"
                            >
                                <Lock size={12} />
                                Secure_Link
                            </motion.button>
                        </Link>
                    </SignOutButton>

                    <SignInButton>
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/5 p-0.5 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                            <UserButton
                                // REMOVE THIS LINE: afterSignOutUrl="/auth" 
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "h-7 w-7 rounded-full",
                                        userButtonPopoverCard: "border border-white/10 bg-black/90 backdrop-blur-2xl rounded-2xl",
                                        userButtonTrigger: "focus:shadow-none focus:outline-none"
                                    }
                                }}
                            />
                            {/* Animated ring around the user avatar */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-dashed border-cyan-500/20 pointer-events-none"
                            />
                        </div>
                    </SignInButton>
                </div>
            </div>
        </header>
    );
}

function NavLink({ item, active }: { item: typeof navItems[0]; active: boolean }) {
    const Icon = item.icon;
    const ref = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerRootX = clientX - (left + width / 2);
        const centerRootY = clientY - (top + height / 2);
        mouseX.set(centerRootX * 0.4);
        mouseY.set(centerRootY * 0.4);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <Link href={item.href}>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ x, y }}
                className={cn(
                    "relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors duration-500",
                    active ? "text-black" : "text-white/50 hover:text-white"
                )}
            >
                <Icon className={cn("relative z-20 h-4 w-4", active ? "text-black" : "text-cyan-400")} />
                <span className="relative z-20 uppercase tracking-tighter font-black italic">{item.label}</span>

                {active && (
                    <motion.div
                        layoutId="liquid-pill"
                        className="absolute inset-0 z-10 rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    >
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full bg-white/30 blur-sm"
                        />
                    </motion.div>
                )}

                {!active && (
                    <motion.div
                        whileHover={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 z-0 rounded-full bg-white/5 blur-[2px]"
                    />
                )}
            </motion.div>
        </Link>
    );
}