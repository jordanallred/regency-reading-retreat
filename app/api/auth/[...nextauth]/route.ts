// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user?.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    team: user.team
                };
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development', // Enable debug in development mode
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            // When user logs in, add their data to the token
            if (user) {
                token.id = user.id;
                token.team = user.team;
                // Log user data being added to the token
                console.log("Adding user data to token:", { id: user.id, team: user.team });
            }
            return token;
        },
        async session({ session, token }) {
            // Add custom properties to the session
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.team = token.team as string;
                // Log session data being constructed
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        signOut: "/",
        error: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET
};

// Update types to make TypeScript recognize our custom properties
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            team: string;
        }
    }

    interface User {
        id: string;
        team: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        team: string;
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };