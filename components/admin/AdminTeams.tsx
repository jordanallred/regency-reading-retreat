// components/admin/AdminTeams.tsx
import { Team, TeamStats } from './AdminDashboard';
import styles from '@/styles/adminDashboard.module.css';

interface AdminTeamsProps {
    teams: Team[];
    teamStats: Record<string, TeamStats>;
}

export default function AdminTeams({ teams, teamStats }: AdminTeamsProps) {
    return (
        <div className={styles.teamsContent}>
            <h3>Literary Societies</h3>

            <div className={styles.teamCardsGrid}>
                {teams.map(team => (
                    <div key={team.id} className={styles.teamDetailCard}>
                        <div className={styles.teamHeader}>
                            <h3>{team.name}</h3>
                            <div className={styles.teamCode}>{team.code}</div>
                        </div>

                        <p className={styles.teamDescription}>{team.description}</p>

                        <div className={styles.teamStatGrid}>
                            <div className={styles.teamStat}>
                                <span className={styles.statLabel}>Books Read</span>
                                <span className={styles.statValue}>{team.progress}</span>
                            </div>
                            <div className={styles.teamStat}>
                                <span className={styles.statLabel}>Goal</span>
                                <span className={styles.statValue}>{team.goal}</span>
                            </div>
                            <div className={styles.teamStat}>
                                <span className={styles.statLabel}>Completion</span>
                                <span className={styles.statValue}>
                                    {Math.round((team.progress / team.goal) * 100)}%
                                </span>
                            </div>
                            <div className={styles.teamStat}>
                                <span className={styles.statLabel}>Scandals</span>
                                <span className={styles.statValue}>{team.scandals}</span>
                            </div>
                        </div>

                        <div className={styles.teamProgressBarLarge}>
                            <div
                                className={styles.progressBarFill}
                                style={{ width: `${Math.min(100, (team.progress / team.goal) * 100)}%` }}
                            ></div>
                        </div>

                        <div className={styles.teamDetailStats}>
                            <div className={styles.detailStat}>
                                <span className={styles.detailLabel}>Members</span>
                                <span className={styles.detailValue}>
                                    {teamStats[team.code]?.totalUsers || 0}
                                </span>
                            </div>
                            <div className={styles.detailStat}>
                                <span className={styles.detailLabel}>Active Members</span>
                                <span className={styles.detailValue}>
                                    {teamStats[team.code]?.activeUsers || 0}
                                </span>
                            </div>
                            <div className={styles.detailStat}>
                                <span className={styles.detailLabel}>Books per Member</span>
                                <span className={styles.detailValue}>
                                    {teamStats[team.code]?.booksPerMember || 0}
                                </span>
                            </div>
                            <div className={styles.detailStat}>
                                <span className={styles.detailLabel}>Avg. Pages</span>
                                <span className={styles.detailValue}>
                                    {teamStats[team.code]?.averagePagesRead || 0}
                                </span>
                            </div>
                        </div>

                        {teamStats[team.code]?.topGenres && teamStats[team.code]?.topGenres.length > 0 && (
                            <div className={styles.teamGenres}>
                                <h4>Top Genres</h4>
                                <div className={styles.genreTags}>
                                    {teamStats[team.code].topGenres.map(genre => (
                                        <span key={genre.genre} className={styles.genreTag}>
                                            {genre.genre} ({genre.count})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}