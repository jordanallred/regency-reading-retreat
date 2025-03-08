// components/admin/AdminMembers.tsx
import { Team, User, Book } from './AdminDashboard';
import styles from '@/styles/adminDashboard.module.css';

interface AdminMembersProps {
    users: User[];
    teams: Team[];
    books: Book[];
}

export default function AdminMembers({ users, teams, books }: AdminMembersProps) {
    return (
        <div className={styles.membersContent}>
            <h3>Society Members</h3>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Society</th>
                        <th>Reading Goal</th>
                        <th>Books Read</th>
                        <th>Social Media</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => {
                        const userBooks = books.filter(book => book.userId === user.id);
                        return (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{teams.find(t => t.code === user.team)?.name || user.team}</td>
                                <td>{user.readingGoal}</td>
                                <td>{userBooks.length}</td>
                                <td>{user.socialMedia || '-'}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}