import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // Check authentication
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const id = params.id;
        console.log(`Attempting to delete book with ID: ${id}`);

        // Find the book to verify ownership
        const book = await prisma.book.findUnique({
            where: { id },
        });

        // Check if book exists
        if (!book) {
            console.log(`Book not found with ID: ${id}`);
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // Check if user is authorized to delete this book
        if (book.userId !== session.user.id) {
            console.log(`User ${session.user.id} not authorized to delete book belonging to ${book.userId}`);
            return NextResponse.json(
                { error: 'You are not authorized to delete this book' },
                { status: 403 }
            );
        }

        // Get user's team before deleting the book
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { team: true }
        });

        const teamCode = user?.team;

        // Delete the book
        await prisma.book.delete({
            where: { id }
        });

        console.log(`Book deleted successfully: ${id}`);

        // Update team progress if applicable
        if (teamCode) {
            console.log(`Updating team progress for team: ${teamCode}`);
            // Decrement team progress
            await prisma.team.update({
                where: { code: teamCode },
                data: {
                    progress: {
                        decrement: 1
                    }
                }
            });
        }

        return NextResponse.json(
            { message: 'Book deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting book:', error);
        return NextResponse.json(
            { error: 'Failed to delete book' },
            { status: 500 }
        );
    }
}