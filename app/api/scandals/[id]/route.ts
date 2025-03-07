// app/api/scandals/[id]/acknowledge/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '../../../auth/[...nextauth]/route';

// POST - Acknowledge a scandal
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const id = params.id;

        // Find the scandal
        const scandal = await prisma.scandal.findUnique({
            where: { id }
        });

        // Check if scandal exists and belongs to user
        if (!scandal) {
            return NextResponse.json(
                { message: 'Scandal not found' },
                { status: 404 }
            );
        }

        if (scandal.userId !== session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Mark scandal as resolved/acknowledged
        await prisma.scandal.update({
            where: { id },
            data: { resolved: true }
        });

        return NextResponse.json({
            message: 'Scandal acknowledged successfully'
        });
    } catch (error) {
        console.error('Error acknowledging scandal:', error);
        return NextResponse.json(
            { message: 'An error occurred while acknowledging the scandal' },
            { status: 500 }
        );
    }
}