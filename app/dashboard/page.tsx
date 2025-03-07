'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/dashboard.module.css';
import { Book, Scandal, Team } from '@/types';

interface NewBookForm {
    title: string;
    author: string;
    pages: string;
    genre: string;
    dateFinished: string;
}

interface UserData {
    name: string;
    team: string;
    booksRead: Book[];
    currentScandal: Scandal | null;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // User and team data states
    const [userData, setUserData] = useState<UserData>({
        name: '',
        team: '',
        booksRead: [],
        currentScandal: null
    });
    const [teams, setTeams] = useState<Team[]>([]);
    const [userTeam, setUserTeam] = useState<Team | null>(null);

    // New book form state
    const [newBook, setNewBook] = useState<NewBookForm>({
        title: '',
        author: '',
        pages: '',
        genre: 'regency',
        dateFinished: ''
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Fetch user data and books
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            fetchUserData();
            fetchTeams();
        }
    }, [status, session]);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);

            // Fetch user's books
            const booksResponse = await fetch('/api/books');
            if (!booksResponse.ok) {
                throw new Error('Failed to fetch books');
            }
            const booksData = await booksResponse.json();

            // Fetch user's current scandal if any
            const scandalResponse = await fetch('/api/scandals/current');
            const scandalData = await scandalResponse.json();

            setUserData({
                name: session?.user?.name || 'Reader',
                team: session?.user?.team || '',
                booksRead: booksData.books || [],
                currentScandal: scandalData.scandal || null
            });

        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to load your reading data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await fetch('/api/teams');
            if (!response.ok) {
                throw new Error('Failed to fetch teams');
            }
            const data = await response.json();
            setTeams(data.teams || []);

            // Find user's team
            if (session?.user?.team) {
                const team = data.teams.find((t: Team) => t.code === session.user.team);
                if (team) {
                    setUserTeam(team);
                }
            }
        } catch (err) {
            console.error('Error fetching teams:', err);
        }
    };

    const handleBookChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewBook({
            ...newBook,
            [e.target.name]: e.target.value
        });
    };

    const addBook = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form
        if (!newBook.title || !newBook.author || !newBook.pages || !newBook.dateFinished) {
            return;
        }

        const bookWithTypedPages: Book = {
            ...newBook,
            pages: parseInt(newBook.pages, 10)
        };

        try {
            // Send data to the API
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...bookWithTypedPages,
                    userId: session?.user?.id, // Use the actual user ID from session
                    teamId: userTeam?.id || null, // Use actual team ID or null
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error adding book:', errorData);
                return;
            }

            // After successful API call, update local state
            const updatedUserData = {
                ...userData,
                booksRead: [...userData.booksRead, bookWithTypedPages]
            };

            // Check for scandal
            const scandal = checkForScandal(userData.booksRead, bookWithTypedPages);
            if (scandal) {
                updatedUserData.currentScandal = scandal;
            }

            setUserData(updatedUserData);

            // Reset form
            setNewBook({
                title: '',
                author: '',
                pages: '',
                genre: 'regency',
                dateFinished: ''
            });
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const dismissScandal = async () => {
        if (!userData.currentScandal) return;

        try {
            const response = await fetch(`/api/scandals/${userData.currentScandal.id}/acknowledge`, {
                method: 'POST'
            });

            if (response.ok) {
                setUserData({
                    ...userData,
                    currentScandal: null
                });
            }
        } catch (err) {
            console.error('Error acknowledging scandal:', err);
        }
    };

    const deleteBook = async (bookId: string) => {
        try {
            const response = await fetch(`/api/books/${bookId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Remove book from list
                setUserData({
                    ...userData,
                    booksRead: userData.booksRead.filter(book => book.id !== bookId)
                });

                // Refresh teams data
                fetchTeams();
            }
        } catch (err) {
            console.error('Error deleting book:', err);
            setError('Failed to delete book. Please try again.');
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.loading}>
                        Loading your reading salon...
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.header}>
                    <h1>Welcome to the Season, {userData.name}</h1>
                    <p>Society: {userTeam?.name || 'Loading...'}</p>
                </div>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {userData.currentScandal && (
                    <div className={styles.scandalAlert}>
                        <h2>⚠️ Scandal Alert! ⚠️</h2>
                        <h3>{userData.currentScandal.title}</h3>
                        <p>{userData.currentScandal.description}</p>
                        <div className={styles.challenge}>
                            <span>Challenge:</span> {userData.currentScandal.challenge}
                        </div>
                        <button
                            className={styles.dismissButton}
                            onClick={dismissScandal}
                        >
                            Accept Challenge
                        </button>
                    </div>
                )}

                <div className={styles.dashboardGrid}>
                    <section className={styles.teamProgress}>
                        <h2>Society Progress</h2>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{
                                    width: userTeam
                                        ? `${(userTeam.progress / userTeam.goal) * 100}%`
                                        : '0%'
                                }}
                            ></div>
                        </div>
                        <p>{userTeam?.progress || 0} / {userTeam?.goal || 100} books</p>
                    </section>

                    <section className={styles.readingLog}>
                        <h2>Your Reading Card</h2>
                        <form onSubmit={addBook} className={styles.addBookForm}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="title">Book Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={newBook.title}
                                        onChange={handleBookChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="author">Author</label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        value={newBook.author}
                                        onChange={handleBookChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="pages">Page Count</label>
                                    <input
                                        type="number"
                                        id="pages"
                                        name="pages"
                                        min="1"
                                        value={newBook.pages}
                                        onChange={handleBookChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="genre">Genre</label>
                                    <select
                                        id="genre"
                                        name="genre"
                                        value={newBook.genre}
                                        onChange={handleBookChange}
                                        required
                                    >
                                        <option value="regency">Regency Romance</option>
                                        <option value="historical">Historical Fiction</option>
                                        <option value="classic">Classic Literature</option>
                                        <option value="gothic">Gothic</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="dateFinished">Date Finished</label>
                                    <input
                                        type="date"
                                        id="dateFinished"
                                        name="dateFinished"
                                        value={newBook.dateFinished}
                                        onChange={handleBookChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.addButton}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Adding...' : 'Add to Reading Card'}
                            </button>
                        </form>

                        <div className={styles.bookList}>
                            <h3>Books You've Read</h3>
                            {userData.booksRead.length === 0 ? (
                                <p className={styles.emptyState}>Your reading card awaits its first entry</p>
                            ) : (
                                <ul>
                                    {userData.booksRead.map((book) => (
                                        <li key={book.id} className={styles.bookItem}>
                                            <div className={styles.bookTitle}>{book.title}</div>
                                            <div className={styles.bookAuthor}>by {book.author}</div>
                                            <div className={styles.bookDetails}>
                                                {book.pages} pages • {book.genre}
                                            </div>
                                            <button
                                                onClick={() => deleteBook(book.id)}
                                                className={styles.deleteButton}
                                                aria-label="Delete book"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    <section className={styles.leaderboard}>
                        <h2>Society Standings</h2>
                        <table className={styles.standingsTable}>
                            <thead>
                            <tr>
                                <th>Society</th>
                                <th>Books Read</th>
                                <th>Scandals</th>
                            </tr>
                            </thead>
                            <tbody>
                            {teams.length > 0 ? (
                                teams.map((team) => (
                                    <tr key={team.id} className={team.code === userData.team ? styles.userTeam : ''}>
                                        <td>{team.name}</td>
                                        <td>{team.progress}</td>
                                        <td>{team.scandals}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>Loading society data...</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
        </div>
    );
}