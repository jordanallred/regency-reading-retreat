// app/api/scandals/current/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET - Retrieve user's current active scandal
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Find the most recent unresolved scandal
        const scandal = await prisma.scandal.findFirst({
            where: {
                userId: session.user.id,
                resolved: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ scandal });
    } catch (error) {
        console.error('Error retrieving scandal:', error);
        return NextResponse.json(
            { message: 'An error occurred while retrieving scandal' },
            { status: 500 }
        );
    }
}