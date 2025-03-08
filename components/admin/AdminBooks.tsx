// components/admin/AdminBooks.tsx
import { Team, User, Book } from './AdminDashboard';
import styles from '@/styles/adminDashboard.module.css';

interface AdminBooksProps {
    books: Book[];
    users: User[];
    teams: Team[];
    formatDate: (dateString: string) => string;
}

export default function AdminBooks({ books, users, teams, formatDate }: AdminBooksProps) {
    return (
        <div className={styles.booksContent}>
            <h3>Reading Records</h3>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Genre</th>
                        <th>Pages</th>
                        <th>Date Finished</th>
                        <th>Reader</th>
                        <th>Society</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map(book => {
                        const reader = users.find(user => user.id === book.userId);
                        return (
                            <tr key={book.id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td className={styles.capitalize}>{book.genre}</td>
                                <td>{book.pages}</td>
                                <td>{formatDate(book.dateFinished)}</td>
                                <td>{book.user?.name || reader?.name || 'Unknown'}</td>
                                <td>{teams.find(t => t.code === reader?.team)?.name || 'Unknown'}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}