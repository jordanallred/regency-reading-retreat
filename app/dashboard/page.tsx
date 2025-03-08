'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styles from '@/styles/dashboard.module.css';

interface Book {
    id: string;
    title: string;
    author: string;
    pages: number;
    genre: string;
    dateFinished: string;
}

interface Team {
    id: string;
    name: string;
    code: string;
    description: string;
    goal: number;
    progress: number;
}

interface Scandal {
    id: string;
    title: string;
    description: string;
    challenge: string;
}

interface BookFormData {
    title: string;
    author: string;
    pages: string;
    genre: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [books, setBooks] = useState<Book[]>([]);
    const [team, setTeam] = useState<Team | null>(null);
    const [activeScandal, setActiveScandal] = useState<Scandal | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [formExpanded, setFormExpanded] = useState(false);

    // Form state
    const [bookForm, setBookForm] = useState<BookFormData>({
        title: '',
        author: '',
        pages: '',
        genre: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBookForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchUserData = async () => {
        if (!session?.user?.id) return;

        try {
            setLoading(true);

            // Fetch user's books
            const booksResponse = await fetch(`/api/books?userId=${session.user.id}`);
            const booksData = await booksResponse.json();

            if (booksData.books) {
                setBooks(booksData.books);
            }

            // Fetch user's team
            if (session.user.team) {
                const teamResponse = await fetch(`/api/teams?code=${session.user.team}`);
                const teamData = await teamResponse.json();

                if (teamData.team) {
                    setTeam(teamData.team);
                }
            }

            // Fetch user's active scandal
            const scandalResponse = await fetch('/api/scandals/current');
            const scandalData = await scandalResponse.json();

            if (scandalData.scandal) {
                setActiveScandal(scandalData.scandal);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Redirect if not authenticated
        if (status === 'unauthenticated') {
            redirect('/login');
        }

        // Fetch user's books and active scandal if authenticated
        if (status === 'authenticated' && session?.user?.id) {
            fetchUserData();
        }
    }, [session, status]);

    const handleAddBook = async (e: FormEvent) => {
        e.preventDefault();

        if (!session?.user?.id) {
            return;
        }

        // Form validation
        if (!bookForm.title.trim() || !bookForm.author.trim()) {
            setFormError('Title and author are required');
            return;
        }

        setSubmitting(true);
        setFormError('');

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: bookForm.title,
                    author: bookForm.author,
                    pages: bookForm.pages ? parseInt(bookForm.pages) : 0,
                    genre: bookForm.genre || 'unknown',
                    userId: session.user.id,
                    dateFinished: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add book');
            }

            // Reset form
            setBookForm({
                title: '',
                author: '',
                pages: '',
                genre: ''
            });

            // Collapse form on successful submission on mobile
            setFormExpanded(false);

            // Refresh book list and team data
            fetchUserData();

        } catch (error) {
            console.error('Error adding book:', error);
            setFormError(error instanceof Error ? error.message : 'Error adding book');
        } finally {
            setSubmitting(false);
        }
    };

    const dismissScandal = async () => {
        if (activeScandal?.id) {
            try {
                await fetch(`/api/scandals/${activeScandal.id}/acknowledge`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setActiveScandal(null);
            } catch (error) {
                console.error('Error acknowledging scandal:', error);
            }
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className={styles.container}>
                <div className={styles.main}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading your social season details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect due to the useEffect
    }

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                {activeScandal && (
                    <div className={styles.scandalAlert}>
                        <h2>⚠️ Scandal Alert! ⚠️</h2>
                        <h3>{activeScandal.title}</h3>
                        <p>{activeScandal.description}</p>
                        <div className={styles.challenge}>
                            <span>Challenge:</span> {activeScandal.challenge}
                        </div>
                        <button
                            className={styles.dismissButton}
                            onClick={dismissScandal}
                        >
                            Accept Challenge
                        </button>
                    </div>
                )}

                <div className={styles.header}>
                    <h1>Welcome to the Season, {session.user.name}</h1>
                    {team && (
                        <div className={styles.teamBadge}>
                            Member of <span>{team.name}</span>
                        </div>
                    )}
                </div>

                <div className={styles.dashboardGrid}>
                    <section className={styles.teamProgress}>
                        <h2>Your Reading Progress</h2>
                        <div className={styles.progressContent}>
                            <p>Books Read: {books.length}</p>
                            {team && (
                                <>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${Math.min(100, (team.progress / team.goal) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <p>{team.progress} / {team.goal} Team Goal</p>
                                </>
                            )}
                        </div>
                    </section>

                    <section className={styles.readingLog}>
                        <h2>Your Reading Card</h2>

                        <div className={styles.formToggle}>
                            <button
                                className={`${styles.toggleButton} ${formExpanded ? styles.active : ''}`}
                                onClick={() => setFormExpanded(!formExpanded)}
                                aria-expanded={formExpanded}
                            >
                                {formExpanded ? 'Hide Form' : 'Add New Book'}
                            </button>
                        </div>

                        {formExpanded && (
                            <form className={styles.addBookForm} onSubmit={handleAddBook}>
                                {formError && <div className={styles.error}>{formError}</div>}
                                <div className={styles.formGroup}>
                                    <label htmlFor="title">Book Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        placeholder="Pride and Prejudice"
                                        value={bookForm.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="author">Author</label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        placeholder="Jane Austen"
                                        value={bookForm.author}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="pages">Pages</label>
                                        <input
                                            type="number"
                                            id="pages"
                                            name="pages"
                                            placeholder="279"
                                            value={bookForm.pages}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="genre">Genre</label>
                                        <select
                                            id="genre"
                                            name="genre"
                                            value={bookForm.genre}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select...</option>
                                            <option value="classic">Classic</option>
                                            <option value="romance">Romance</option>
                                            <option value="historical">Historical</option>
                                            <option value="gothic">Gothic</option>
                                            <option value="poetry">Poetry</option>
                                            <option value="drama">Drama</option>
                                            <option value="non-fiction">Non-Fiction</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    className={styles.addButton}
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Adding...' : 'Add to Reading Card'}
                                </button>
                            </form>
                        )}

                        {books.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>You haven't added any books to your reading card yet.</p>
                                <p>Start logging your Regency-era reads to contribute to your society's progress!</p>
                            </div>
                        ) : (
                            <div className={styles.bookList}>
                                <h3>Recent Books</h3>
                                <ul>
                                    {books.map((book) => (
                                        <li key={book.id} className={styles.bookItem}>
                                            <div className={styles.bookTitle}>{book.title}</div>
                                            <div className={styles.bookAuthor}>by {book.author}</div>
                                            <div className={styles.bookDetails}>
                                                <span className={styles.bookGenre}>{book.genre}</span>
                                                <span className={styles.bookSeparator}>•</span>
                                                <span className={styles.bookPages}>{book.pages} pages</span>
                                                <span className={styles.bookSeparator}>•</span>
                                                <span className={styles.bookDate}>
                                                    {new Date(book.dateFinished).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    {team && (
                        <section className={styles.leaderboard}>
                            <h2>Society Updates</h2>
                            <div className={styles.societyCard}>
                                <h3>{team.name}</h3>
                                <p>{team.description}</p>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${Math.min(100, (team.progress / team.goal) * 100)}%` }}
                                    ></div>
                                </div>
                                <p className={styles.societyProgress}>{team.progress} / {team.goal} books read</p>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}