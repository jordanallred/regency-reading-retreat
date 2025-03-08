// app/api/admin/scandals/[id]/resolve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if user is authenticated and is admin
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const id = params.id;

        // Find the scandal
        const scandal = await prisma.scandal.findUnique({
            where: { id }
        });

        // Check if scandal exists
        if (!scandal) {
            return NextResponse.json(
                { error: 'Scandal not found' },
                { status: 404 }
            );
        }

        // Mark scandal as resolved
        await prisma.scandal.update({
            where: { id },
            data: { resolved: true }
        });

        return NextResponse.json({
            message: 'Scandal resolved successfully'
        });
    } catch (error) {
        console.error('Error resolving scandal:', error);
        return NextResponse.json(
            { error: 'Failed to resolve scandal' },
            { status: 500 }
        );
    }
}
