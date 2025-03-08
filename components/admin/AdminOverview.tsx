// components/admin/AdminOverview.tsx
import { Team, User, Book, Scandal, TeamStats } from './AdminDashboard';
import styles from '@/styles/adminDashboard.module.css';

interface AdminOverviewProps {
    teams: Team[];
    users: User[];
    books: Book[];
    scandals: Scandal[];
    teamStats: Record<string, TeamStats>;
    formatDate: (dateString: string) => string;
}

export default function AdminOverview({
                                          teams,
                                          users,
                                          books,
                                          scandals,
                                          teamStats,
                                          formatDate
                                      }: AdminOverviewProps) {
    // Calculate overall statistics
    const totalUsers = users.length;
    const totalBooks = books.length;
    const totalProgress = teams.reduce((sum, team) => sum + team.progress, 0);
    const averageGoalCompletion = teams.length > 0
        ? Math.round((totalProgress / teams.reduce((sum, team) => sum + team.goal, 0)) * 100)
        : 0;

    const activeUsers = new Set(books.map(book => book.userId)).size;
    const userParticipationRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    const booksByGenre: Record<string, number> = {};
    books.forEach(book => {
        booksByGenre[book.genre] = (booksByGenre[book.genre] || 0) + 1;
    });

    const topGenres = Object.keys(booksByGenre)
        .map(genre => ({ genre, count: booksByGenre[genre] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const recentBooks = [...books]
        .sort((a, b) => new Date(b.dateFinished).getTime() - new Date(a.dateFinished).getTime())
        .slice(0, 10);

    const activeScandals = scandals.filter(scandal => !scandal.resolved);

    return (
        <div className={styles.overviewContent}>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Members</h3>
                    <p className={styles.statValue}>{totalUsers}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Books Read</h3>
                    <p className={styles.statValue}>{totalBooks}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Goal Completion</h3>
                    <p className={styles.statValue}>{averageGoalCompletion}%</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Active Members</h3>
                    <p className={styles.statValue}>{userParticipationRate}%</p>
                    <p className={styles.statDetail}>{activeUsers} of {totalUsers} members</p>
                </div>
            </div>

            <div className={styles.overviewGridRow}>
                <div className={styles.teamProgressSection}>
                    <h3>Team Progress</h3>
                    {teams.map(team => (
                        <div key={team.id} className={styles.teamProgressBar}>
                            <div className={styles.teamProgressInfo}>
                                <span className={styles.teamName}>{team.name}</span>
                                <span className={styles.teamProgressValue}>
                                    {team.progress} / {team.goal}
                                </span>
                            </div>
                            <div className={styles.progressBarContainer}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{ width: `${Math.min(100, (team.progress / team.goal) * 100)}%` }}
                                ></div>
                            </div>
                            <div className={styles.teamMeta}>
                                <span>{team.scandals} scandals</span>
                                <span>{teamStats[team.code]?.booksPerMember || 0} books/member</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.topGenresSection}>
                    <h3>Top Genres</h3>
                    <div className={styles.genreList}>
                        {topGenres.map((genre, index) => (
                            <div key={genre.genre} className={styles.genreItem}>
                                <div className={styles.genreRank}>{index + 1}</div>
                                <div className={styles.genreInfo}>
                                    <div className={styles.genreName}>{genre.genre}</div>
                                    <div className={styles.genreCount}>{genre.count} books</div>
                                </div>
                                <div className={styles.genreBar}>
                                    <div
                                        className={styles.genreFill}
                                        style={{ width: `${(genre.count / topGenres[0].count) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.overviewGridRow}>
                <div className={styles.recentBooksSection}>
                    <h3>Recently Finished Books</h3>
                    <div className={styles.recentBooksList}>
                        {recentBooks.map(book => (
                            <div key={book.id} className={styles.recentBookItem}>
                                <div className={styles.bookInfo}>
                                    <h4>{book.title}</h4>
                                    <p>by {book.author}</p>
                                </div>
                                <div className={styles.bookMeta}>
                                    <span className={styles.bookGenre}>{book.genre}</span>
                                    <span className={styles.bookDate}>{formatDate(book.dateFinished)}</span>
                                </div>
                                <div className={styles.bookReader}>
                                    Read by {book.user?.name || 'Unknown reader'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.activeScandalsSection}>
                    <h3>Active Scandals</h3>
                    {activeScandals.length > 0 ? (
                        <div className={styles.scandalsList}>
                            {activeScandals.map(scandal => (
                                <div key={scandal.id} className={styles.scandalItem}>
                                    <h4>{scandal.title}</h4>
                                    <p className={styles.scandalDescription}>{scandal.description}</p>
                                    <p className={styles.scandalChallenge}>
                                        <strong>Challenge:</strong> {scandal.challenge}
                                    </p>
                                    <div className={styles.scandalMeta}>
                                        <span>Affecting: {scandal.user?.name || 'Unknown member'}</span>
                                        <span>Team: {
                                            teams.find(t => t.code === scandal.user?.team)?.name || 'Unknown team'
                                        }</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No active scandals at the moment.</p>
                            <p>All societies are maintaining proper decorum.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}