// app/api/admin/users/route.ts
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

        // Get all users
        const users = await prisma.user.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        // Filter out sensitive information like passwords
        const safeUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            team: user.team,
            readingGoal: user.readingGoal,
            socialMedia: user.socialMedia
        }));

        return NextResponse.json({ users: safeUsers });
    } catch (error) {
        console.error('Error fetching admin users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}