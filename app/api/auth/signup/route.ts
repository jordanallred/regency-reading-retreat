// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, team, readingGoal, socialMedia } = body;

        // Validate required fields
        if (!name || !email || !password || !team) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                team,
                readingGoal: readingGoal || 5,
                socialMedia: socialMedia || null,
            },
        });

        // Return success without sending the password back
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            { message: 'User created successfully', user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: 'An error occurred during signup' },
            { status: 500 }
        );
    }
}