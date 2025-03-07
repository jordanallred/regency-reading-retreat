import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    // If a team code is provided, return just that team
    if (code) {
        try {
            const team = await prisma.team.findUnique({
                where: {
                    code: code
                }
                // Remove the problematic _count include
            });

            if (!team) {
                return NextResponse.json(
                    { error: 'Team not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ team });
        } catch (error) {
            console.error('Error fetching team:', error);
            return NextResponse.json(
                { error: 'Failed to fetch team' },
                { status: 500 }
            );
        }
    }

    // Check if we have any teams at all
    try {
        const teamCount = await prisma.team.count();

        if (teamCount === 0) {
            // Return mock data if no teams exist
            return NextResponse.json({
                teams: [
                    {
                        id: '1',
                        name: 'The Austen Assembly',
                        code: 'austen',
                        description: 'Celebrated for wit, wisdom, and literary discussions',
                        goal: 100,
                        progress: 24
                    },
                    {
                        id: '2',
                        name: 'The Bridgerton Circle',
                        code: 'bridgerton',
                        description: 'Known for their love of romance and society gossip',
                        goal: 100,
                        progress: 18
                    },
                    {
                        id: '3',
                        name: 'The Shelley Soirée',
                        code: 'shelley',
                        description: 'Drawn to the gothic and revolutionary literature',
                        goal: 100,
                        progress: 15
                    },
                    {
                        id: '4',
                        name: 'The Byron Society',
                        code: 'byron',
                        description: 'Passionate, dramatic, and always seeking adventure',
                        goal: 100,
                        progress: 20
                    }
                ]
            });
        }

        // If teams exist, get real data
        const teams = await prisma.team.findMany({
            orderBy: {
                progress: 'desc'
            }
            // Remove the problematic _count include
        });

        return NextResponse.json({ teams });
    } catch (error) {
        console.error('Error fetching teams:', error);
        return NextResponse.json(
            { error: 'Failed to fetch teams' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.code) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if team code already exists
        const existingTeam = await prisma.team.findUnique({
            where: { code: body.code }
        });

        if (existingTeam) {
            return NextResponse.json(
                { error: 'Team code already exists' },
                { status: 409 }
            );
        }

        const team = await prisma.team.create({
            data: {
                name: body.name,
                code: body.code,
                description: body.description || '',
                goal: body.goal || 100,
                progress: 0  // Initialize progress to 0
            }
        });

        return NextResponse.json({ team }, { status: 201 });
    } catch (error) {
        console.error('Error creating team:', error);
        return NextResponse.json(
            { error: 'Failed to create team' },
            { status: 500 }
        );
    }
}