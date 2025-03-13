import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // user should be able to access account verification path even without being logged in
    if (req.nextUrl.pathname === "/api/affiliates/verify") {
        return res;
    }

    // HANDLER ACCOUNT VERIFICATION NOTIFICATION
    // the middleware checks if the pathname is the verification one
    if (req.nextUrl.pathname.startsWith("/dashboard/profile/verify")) {
        // sends the redirect to home
        const response = NextResponse.rewrite(new URL("/", req.url));
        // sets a cookie that will be consumed by the verification alert, and then deleted
        response.headers.set(
            "Set-Cookie",
            `VerificationSuccessAlertOpen=true; Max-Age=${60 * 6 * 24}`
        );
        return response;

    }

    return res;
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
