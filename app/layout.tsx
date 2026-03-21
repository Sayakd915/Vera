import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

import { Navbar } from "@/components/ui/navbar"; // Ensure this matches your latest navbar location
import { NeuralBackground } from "@/components/ui/neural-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vera // AI Watchdog",
  description: "Locally hosted A.I. Neural Forensics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        // This forces Clerk's internal modals to match your UI
        variables: {
          colorPrimary: "#22d3ee", // Vera Cyan
          colorBackground: "#0a0a0a",
          colorText: "#ffffff",
          colorInputBackground: "#111111",
          colorInputText: "#ffffff",
        },
        elements: {
          card: "border border-white/10 bg-black/80 backdrop-blur-2xl rounded-[2rem]",
          navbar: "hidden", // We use our own custom navbar
          footer: "hidden", // Keep it clean
        }
      }}
    >
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
        <body className="bg-black text-white selection:bg-cyan-500/30">
          {/* Layer 0: Neural Canvas */}
          <NeuralBackground />

          {/* Layer 1: App Interface */}
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
          </div>

          {/* Optional: Global CRT overlay for that badass monitor feel */}
          <div className="pointer-events-none fixed inset-0 z-[999] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%] opacity-20" />
        </body>
      </html>
    </ClerkProvider>
  );
}