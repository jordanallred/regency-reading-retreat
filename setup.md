# Regency Reading Retreat - Setup & Deployment Guide

## Prerequisites
- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database (or any database supported by Prisma)

## Environment Setup

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd regency-reading-retreat
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/regency_reading_retreat"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# Optional: Email provider for password reset
# EMAIL_SERVER=smtp://username:password@smtp.example.com:587
# EMAIL_FROM=noreply@example.com
```

3. Initialize the database with Prisma:
```bash
npx prisma migrate dev --name init
```

4. Seed the database with initial team data:
```bash
npx prisma db seed
```

## Running Locally

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Create a new project on Vercel and link it to your GitHub repository
3. Configure the environment variables in the Vercel dashboard
4. Deploy the application

### Other Platforms

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Database Schema Management

If you need to update the database schema:

1. Modify the Prisma schema in `prisma/schema.prisma`
2. Generate a migration:
```bash
npx prisma migrate dev --name <migration-name>
```

3. Apply the migration to your database:
```bash
npx prisma migrate deploy
```

## Authentication

The application uses NextAuth.js with a Credentials provider. You can extend it with additional providers:

### Adding OAuth Providers

1. Add the necessary environment variables
2. Update the NextAuth configuration in `app/api/auth/[...nextauth]/route.ts`

Example for Google OAuth:
```typescript
import GoogleProvider from "next-auth/providers/google";

// Add to providers array:
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
})
```

## Supporting the Readathon

For a live readathon event, you may want to:

1. Create an admin interface for managing teams and resolving issues
2. Set up scheduled tasks for periodic updates or events
3. Add social media integration for sharing progress
4. Implement a notification system for important events

## Customization

You can customize the application by:

1. Modifying CSS files in the `styles` directory
2. Updating team names and descriptions in `prisma/seed.ts`
3. Adjusting scandal triggers in `utils/scandalService.ts`
4. Changing page content in the corresponding page components