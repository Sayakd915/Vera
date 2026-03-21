import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define your "Safe Zones"
const isPublicRoute = createRouteMatcher([
    '/',
    '/auth(.*)',
    '/sso-callback(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    // 2. Resolve the auth object
    const session = await auth();

    // 3. If it's NOT a public route and the user has no ID, kick them to Auth
    if (!isPublicRoute(req) && !session.userId) {
        const authUrl = new URL('/auth', req.url);
        return NextResponse.redirect(authUrl);
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};