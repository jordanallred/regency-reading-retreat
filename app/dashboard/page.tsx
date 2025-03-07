'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import styles from '@/styles/dashboard.module.css';
import { checkForScandal } from '@/utils/scandalService';
import { Book, UserData } from '@/types';

interface NewBookForm {
    title: string;
    author: string;
    pages: string;
    genre: string;
    dateFinished: string;
}

export default function Dashboard() {
    // Mock user data - in a real app, fetch this from API/backend
    const [userData, setUserData] = useState<UserData>({
        name: 'Jane Bennet',
        team: 'The Austen Assembly',
        booksRead: [],
        teamProgress: 24,
        teamGoal: 100,
        currentScandal: null
    });

    const [newBook, setNewBook] = useState<NewBookForm>({
        title: '',
        author: '',
        pages: '',
        genre: 'regency',
        dateFinished: ''
    });

    const handleBookChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewBook({
            ...newBook,
            [e.target.name]: e.target.value
        });
    };

    const addBook = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form
        if (!newBook.title || !newBook.author || !newBook.pages || !newBook.dateFinished) {
            return;
        }

        const bookWithTypedPages: Book = {
            ...newBook,
            pages: parseInt(newBook.pages, 10)
        };

        // Add book to user's list
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
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.header}>
                    <h1>Welcome to the Season, {userData.name}</h1>
                    <p>Society: {userData.team}</p>
                </div>

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
                            onClick={() => setUserData({...userData, currentScandal: null})}
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
                                style={{width: `${(userData.teamProgress / userData.teamGoal) * 100}%`}}
                            ></div>
                        </div>
                        <p>{userData.teamProgress} / {userData.teamGoal} books</p>
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

                            <button type="submit" className={styles.addButton}>
                                Add to Reading Card
                            </button>
                        </form>

                        <div className={styles.bookList}>
                            <h3>Books You've Read</h3>
                            {userData.booksRead.length === 0 ? (
                                <p className={styles.emptyState}>Your reading card awaits its first entry</p>
                            ) : (
                                <ul>
                                    {userData.booksRead.map((book, index) => (
                                        <li key={index} className={styles.bookItem}>
                                            <div className={styles.bookTitle}>{book.title}</div>
                                            <div className={styles.bookAuthor}>by {book.author}</div>
                                            <div className={styles.bookDetails}>
                                                {book.pages} pages • {book.genre}
                                            </div>
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
                            <tr>
                                <td>The Austen Assembly</td>
                                <td>24</td>
                                <td>2</td>
                            </tr>
                            <tr>
                                <td>The Bridgerton Circle</td>
                                <td>19</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <td>The Byron Society</td>
                                <td>15</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td>The Shelley Soirée</td>
                                <td>12</td>
                                <td>0</td>
                            </tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
        </div>
    );
}