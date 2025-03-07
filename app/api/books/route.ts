import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const teamId = searchParams.get('teamId');
    const genre = searchParams.get('genre');

    // Handle specific queries
    if (userId) {
        try {
            const books = await prisma.book.findMany({
                where: {
                    userId: userId
                },
                orderBy: {
                    dateFinished: 'desc'
                }
            });

            return NextResponse.json({ books });
        } catch (error) {
            console.error('Error fetching user books:', error);
            return NextResponse.json(
                { error: 'Failed to fetch user books' },
                { status: 500 }
            );
        }
    }

    if (teamId) {
        try {
            const books = await prisma.book.findMany({
                where: {
                    user: {
                        teamId: teamId
                    }
                },
                orderBy: {
                    dateFinished: 'desc'
                },
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            return NextResponse.json({ books });
        } catch (error) {
            console.error('Error fetching team books:', error);
            return NextResponse.json(
                { error: 'Failed to fetch team books' },
                { status: 500 }
            );
        }
    }

    if (genre) {
        try {
            const books = await prisma.book.findMany({
                where: {
                    genre: genre
                },
                orderBy: {
                    dateFinished: 'desc'
                }
            });

            return NextResponse.json({ books });
        } catch (error) {
            console.error('Error fetching books by genre:', error);
            return NextResponse.json(
                { error: 'Failed to fetch books by genre' },
                { status: 500 }
            );
        }
    }

    // Default: return all books
    try {
        const books = await prisma.book.findMany({
            orderBy: {
                dateFinished: 'desc'
            }
            // No selection set needed for basic fields
            // This avoids the SelectionSetOnScalar error
        });

        return NextResponse.json({ books });
    } catch (error) {
        console.error('Error fetching books:', error);
        return NextResponse.json(
            { error: 'Failed to fetch books' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.author || !body.userId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const book = await prisma.book.create({
            data: {
                title: body.title,
                author: body.author,
                pages: body.pages || 0,
                genre: body.genre || 'unknown',
                dateFinished: body.dateFinished || new Date().toISOString(),
                userId: body.userId
            }
        });

        // Update team progress if applicable
        if (body.teamId) {
            await prisma.team.update({
                where: { id: body.teamId },
                data: {
                    progress: {
                        increment: 1
                    }
                }
            });
        }

        return NextResponse.json({ book }, { status: 201 });
    } catch (error) {
        console.error('Error creating book:', error);
        return NextResponse.json(
            { error: 'Failed to create book' },
            { status: 500 }
        );
    }
}