// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Create the four literary societies
    const teams = [
        {
            name: 'The Austen Assembly',
            code: 'austen',
            description: 'Celebrated for wit, wisdom, and literary discussions',
            goal: 100,
            progress: 0,
            scandals: 0
        },
        {
            name: 'The Bridgerton Circle',
            code: 'bridgerton',
            description: 'Known for their love of romance and society gossip',
            goal: 100,
            progress: 0,
            scandals: 0
        },
        {
            name: 'The Shelley Soirée',
            code: 'shelley',
            description: 'Drawn to the gothic and revolutionary literature',
            goal: 100,
            progress: 0,
            scandals: 0
        },
        {
            name: 'The Byron Society',
            code: 'byron',
            description: 'Passionate, dramatic, and always seeking adventure',
            goal: 100,
            progress: 0,
            scandals: 0
        }
    ];

    // Create teams
    for (const team of teams) {
        await prisma.team.upsert({
            where: { code: team.code },
            update: {},
            create: team
        });
    }

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });