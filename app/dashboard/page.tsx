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

        console.log('Received book data:', body);

        // Validate required fields
        if (!body.title || !body.author || !body.userId) {
            console.log('Missing required fields:', {
                title: body.title,
                author: body.author,
                userId: body.userId
            });

            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Ensure pages is a number
        const pages = typeof body.pages === 'number' ? body.pages :
            (body.pages ? parseInt(body.pages, 10) : 0);

        // If dateFinished is not provided or invalid, use current date
        let dateFinished;
        try {
            dateFinished = body.dateFinished ? new Date(body.dateFinished).toISOString() : new Date().toISOString();
        } catch (e) {
            dateFinished = new Date().toISOString();
        }

        const bookData = {
            title: body.title,
            author: body.author,
            pages: pages,
            genre: body.genre || 'unknown',
            dateFinished: dateFinished,
            userId: body.userId
        };

        console.log('Creating book with data:', bookData);

        const book = await prisma.book.create({
            data: bookData
        });

        // Find user's team and update team progress if applicable
        try {
            const user = await prisma.user.findUnique({
                where: { id: body.userId },
                select: { team: true }
            });

            if (user?.team) {
                await prisma.team.update({
                    where: { code: user.team },
                    data: {
                        progress: {
                            increment: 1
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error updating team progress:', error);
            // Continue even if team update fails
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