// app/api/admin/scandals/route.ts
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

        // Get all scandals with user information
        const scandals = await prisma.scandal.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        team: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ scandals });
    } catch (error) {
        console.error('Error fetching admin scandals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch scandals' },
            { status: 500 }
        );
    }
}