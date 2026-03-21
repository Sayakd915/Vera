import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
    // This component handles the final "handshake" from Google/GitHub
    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/50 italic">
                    Finalizing_Neural_Handshake...
                </p>
            </div>
            <AuthenticateWithRedirectCallback />
        </div>
    );
}