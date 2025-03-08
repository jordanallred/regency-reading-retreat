// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Admin middleware to secure admin routes
export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Define paths that are protected (admin routes)
    const isAdminPath = path.startsWith('/admin');
    const isApiAdminPath = path.startsWith('/api/admin');

    if (isAdminPath || isApiAdminPath) {
        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        // Check if user is authenticated
        if (!session) {
            // Redirect to login page if not authenticated
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // In a real application, you would check if the user is an admin
        // For example: if (!session.isAdmin) { return unauthorized response }
        // For now, we'll just need to be logged in to access admin routes
    }

    return NextResponse.next();
}

// Only run this middleware on matching paths
export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};