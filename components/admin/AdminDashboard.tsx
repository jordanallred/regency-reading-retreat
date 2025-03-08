// components/admin/AdminDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styles from '@/styles/adminDashboard.module.css';
import AdminOverview from './AdminOverview';
import AdminTeams from './AdminTeams';
import AdminMembers from './AdminMembers';
import AdminBooks from './AdminBooks';
import AdminScandals from './AdminScandals';

export interface User {
    id: string;
    name: string;
    email: string;
    team: string;
    readingGoal: number;
    socialMedia: string | null;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    pages: number;
    genre: string;
    dateFinished: string;
    userId: string;
    user?: {
        name: string;
        team?: string;
    };
}

export interface Team {
    id: string;
    name: string;
    code: string;
    description: string;
    goal: number;
    progress: number;
    scandals: number;
    _count?: {
        users: number;
    };
}

export interface Scandal {
    id: string;
    title: string;
    description: string;
    challenge: string;
    resolved: boolean;
    userId: string;
    user?: {
        name: string;
        team: string;
    };
}

export interface TeamStats {
    averagePagesRead: number;
    topGenres: { genre: string; count: number }[];
    booksPerMember: number;
    activeUsers: number;
    totalUsers: number;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const [teams, setTeams] = useState<Team[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [scandals, setScandals] = useState<Scandal[]>([]);
    const [teamStats, setTeamStats] = useState<Record<string, TeamStats>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch data
    useEffect(() => {
        // Redirect if not authenticated
        if (status === 'unauthenticated') {
            redirect('/login');
        }

        if (status === 'authenticated') {
            // In a real application, you would check if the user is an admin
            // For now, we'll assume the session user is an admin

            const fetchData = async () => {
                setIsLoading(true);
                try {
                    // Fetch teams
                    const teamsRes = await fetch('/api/admin/teams');
                    const teamsData = await teamsRes.json();

                    // Fetch users
                    const usersRes = await fetch('/api/admin/users');
                    const usersData = await usersRes.json();

                    // Fetch books
                    const booksRes = await fetch('/api/admin/books');
                    const booksData = await booksRes.json();

                    // Fetch scandals
                    const scandalsRes = await fetch('/api/admin/scandals');
                    const scandalsData = await scandalsRes.json();

                    setTeams(teamsData.teams || []);
                    setUsers(usersData.users || []);
                    setBooks(booksData.books || []);
                    setScandals(scandalsData.scandals || []);

                    // Calculate stats for each team
                    calculateTeamStats(teamsData.teams, usersData.users, booksData.books);
                } catch (error) {
                    console.error('Error fetching admin data:', error);

                    // For demo purposes, set mock data if APIs don't exist yet
                    setMockData();
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [status]);

    const setMockData = () => {
        // Mock teams data
        const mockTeams = [
            {
                id: '1',
                name: 'The Austen Assembly',
                code: 'austen',
                description: 'Celebrated for wit, wisdom, and literary discussions',
                goal: 100,
                progress: 24,
                scandals: 2
            },
            {
                id: '2',
                name: 'The Bridgerton Circle',
                code: 'bridgerton',
                description: 'Known for their love of romance and society gossip',
                goal: 100,
                progress: 18,
                scandals: 1
            },
            {
                id: '3',
                name: 'The Shelley Soirée',
                code: 'shelley',
                description: 'Drawn to the gothic and revolutionary literature',
                goal: 100,
                progress: 15,
                scandals: 3
            },
            {
                id: '4',
                name: 'The Byron Society',
                code: 'byron',
                description: 'Passionate, dramatic, and always seeking adventure',
                goal: 100,
                progress: 20,
                scandals: 0
            }
        ];

        // Mock users data
        const mockUsers = Array(40).fill(null).map((_, i) => {
            const teamIndex = i % 4;
            return {
                id: `user-${i}`,
                name: `Reader ${i + 1}`,
                email: `reader${i + 1}@example.com`,
                team: mockTeams[teamIndex].code,
                readingGoal: Math.floor(Math.random() * 15) + 5,
                socialMedia: Math.random() > 0.5 ? `@reader${i + 1}` : null
            };
        });

        // Mock books data
        const genres = ['classic', 'romance', 'historical', 'gothic', 'poetry', 'drama', 'non-fiction'];
        const authors = [
            'Jane Austen', 'Mary Shelley', 'Lord Byron', 'Charlotte Brontë',
            'Emily Brontë', 'William Wordsworth', 'Percy Shelley', 'John Keats'
        ];

        const mockBooks = Array(100).fill(null).map((_, i) => {
            const userIndex = Math.floor(Math.random() * mockUsers.length);
            return {
                id: `book-${i}`,
                title: `Book Title ${i + 1}`,
                author: authors[Math.floor(Math.random() * authors.length)],
                pages: Math.floor(Math.random() * 500) + 100,
                genre: genres[Math.floor(Math.random() * genres.length)],
                dateFinished: new Date(2025, 0, Math.floor(Math.random() * 60) + 1).toISOString(),
                userId: mockUsers[userIndex].id,
                user: {
                    name: mockUsers[userIndex].name,
                    team: mockUsers[userIndex].team
                }
            };
        });

        // Mock scandals data
        const scandalTitles = [
            'Society Gossip: Reading Material Too Light!',
            'Scandal: Neglecting the Classics!',
            'Literary Monotony Scandal!',
            'Excessive Romance Novels Scandal!'
        ];

        const scandalChallenges = [
            'Read at least two books with over 400 pages to restore your reputation.',
            'At least one member must read a classic work of literature before the next social gathering.',
            'Each member must read a book from a different genre than their previous selection.',
            'The society must collectively read at least 3 non-fiction works.'
        ];

        const mockScandals = Array(6).fill(null).map((_, i) => {
            const userIndex = Math.floor(Math.random() * mockUsers.length);
            return {
                id: `scandal-${i}`,
                title: scandalTitles[Math.floor(Math.random() * scandalTitles.length)],
                description: 'Your society has been criticized for its reading habits.',
                challenge: scandalChallenges[Math.floor(Math.random() * scandalChallenges.length)],
                resolved: Math.random() > 0.5,
                userId: mockUsers[userIndex].id,
                user: {
                    name: mockUsers[userIndex].name,
                    team: mockUsers[userIndex].team
                }
            };
        });

        setTeams(mockTeams);
        setUsers(mockUsers);
        setBooks(mockBooks);
        setScandals(mockScandals);

        // Calculate stats for each team
        calculateTeamStats(mockTeams, mockUsers, mockBooks);
    };

    const calculateTeamStats = (teams: Team[], users: User[], books: Book[]) => {
        const stats: Record<string, TeamStats> = {};

        teams.forEach(team => {
            // Get users in this team
            const teamUsers = users.filter(user => user.team === team.code);

            // Get books read by this team
            const teamBooks = books.filter(book => {
                const bookUser = users.find(user => user.id === book.userId);
                return bookUser && bookUser.team === team.code;
            });

            // Count books by genre
            const genreCounts: Record<string, number> = {};
            teamBooks.forEach(book => {
                genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
            });

            // Get top genres
            const topGenres = Object.keys(genreCounts)
                .map(genre => ({ genre, count: genreCounts[genre] }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            // Calculate average pages read
            const totalPages = teamBooks.reduce((sum, book) => sum + book.pages, 0);
            const averagePagesRead = teamBooks.length > 0 ? Math.round(totalPages / teamBooks.length) : 0;

            // Calculate books per member
            const booksPerMember = teamUsers.length > 0 ? +(teamBooks.length / teamUsers.length).toFixed(1) : 0;

            // Count active users (users who have read at least one book)
            const activeUserIds = new Set(teamBooks.map(book => book.userId));
            const activeUsers = activeUserIds.size;

            stats[team.code] = {
                averagePagesRead,
                topGenres,
                booksPerMember,
                activeUsers,
                totalUsers: teamUsers.length
            };
        });

        setTeamStats(stats);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading administrative intelligence...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.header}>
                    <h1>Regency Reading Retreat</h1>
                    <h2>Administrative Dashboard</h2>
                </div>

                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'teams' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('teams')}
                    >
                        Teams
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'members' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('members')}
                    >
                        Members
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'books' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('books')}
                    >
                        Books
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'scandals' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('scandals')}
                    >
                        Scandals
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <AdminOverview
                        teams={teams}
                        users={users}
                        books={books}
                        scandals={scandals}
                        teamStats={teamStats}
                        formatDate={formatDate}
                    />
                )}

                {activeTab === 'teams' && (
                    <AdminTeams
                        teams={teams}
                        teamStats={teamStats}
                    />
                )}

                {activeTab === 'members' && (
                    <AdminMembers
                        users={users}
                        teams={teams}
                        books={books}
                    />
                )}

                {activeTab === 'books' && (
                    <AdminBooks
                        books={books}
                        users={users}
                        teams={teams}
                        formatDate={formatDate}
                    />
                )}

                {activeTab === 'scandals' && (
                    <AdminScandals
                        scandals={scandals}
                        users={users}
                        teams={teams}
                    />
                )}
            </div>
        </div>
    );
}