import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const AUTH_PAGES = ['/authentication']; // Add any other auth-related pages here
const ROOT_REDIRECT = '/'; // Page to redirect unauthenticated users to
const DASHBOARD_REDIRECT = '/dashboard'; // Page to redirect authenticated users to from auth pages

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const cookies = await getSessionCookie(request); // Assuming getSessionCookie might be async

	const isAuthPage = AUTH_PAGES.some(page => pathname.startsWith(page));

	if (isAuthPage) {
		// If user has a session and is on an auth page, redirect to dashboard
		if (cookies) {
			return NextResponse.redirect(new URL(DASHBOARD_REDIRECT, request.url));
		}
		// Otherwise, allow access to the auth page
		return NextResponse.next();
	}

	// If user does NOT have a session and is NOT on an auth page, redirect to root/login
	if (!cookies) {
		return NextResponse.redirect(new URL(ROOT_REDIRECT, request.url));
	}

	// Otherwise (user has session and is not on an auth page), allow access
	return NextResponse.next();
}

export const config = {
	// Apply middleware to auth pages and dashboard routes
	// Adjust this matcher carefully based on your exact routes!
	matcher: ['/authentication', '/dashboard/:path*'],
};
