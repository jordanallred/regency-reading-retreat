// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '../../../auth/[...nextauth]/route';

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

        // In a real application, you would check if the user is an admin

        // Get count of users
        const userCount = await prisma.user.count();

        // Get count of books
        const bookCount = await prisma.book.count();

        // Get count of active scandals
        const activeScandalsCount = await prisma.scandal.count({
            where: {
                resolved: false
            }
        });

        // Get team progress
        const teams = await prisma.team.findMany({
            select: {
                name: true,
                code: true,
                goal: true,
                progress: true,
                _count: {
                    select: {
                        users: true
                    }
                }
            }
        });

        // Calculate statistics
        // Get books by genre
        const booksByGenre = await prisma.book.groupBy({
            by: ['genre'],
            _count: {
                _all: true
            },
            orderBy: {
                _count: {
                    _all: 'desc'
                }
            }
        });

        const topGenres = booksByGenre.map(item => ({
            genre: item.genre,
            count: item._count._all
        }));

        return NextResponse.json({
            userCount,
            bookCount,
            activeScandalsCount,
            teams,
            topGenres
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}