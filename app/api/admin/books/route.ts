// app/api/admin/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
    try {
        // Check if user is authenticated and is admin
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get all books with user information
        const books = await prisma.book.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        team: true
                    }
                }
            },
            orderBy: {
                dateFinished: 'desc'
            }
        });

        return NextResponse.json({ books });
    } catch (error) {
        console.error('Error fetching admin books:', error);
        return NextResponse.json(
            { error: 'Failed to fetch books' },
            { status: 500 }
        );
    }
}
