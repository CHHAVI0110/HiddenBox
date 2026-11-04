
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // If logged in, redirect authentication pages to dashboard
    if (
        token &&
        (
            pathname === "/sign-in" ||
            pathname === "/sign-up" ||
            pathname.startsWith("/verify")
        )
    ) {
        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    // If not logged in, redirect dashboard requests to sign-in
    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(
            new URL("/sign-in", request.url)
        );
    }

    // Allow everyone to access the home page
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/sign-in",
        "/sign-up",
        "/dashboard/:path*",
        "/verify/:path*",
    ],
};
