// components/admin/AdminScandals.tsx
import { useState } from 'react';
import { Team, User, Scandal } from './AdminDashboard';
import styles from '@/styles/adminDashboard.module.css';

interface AdminScandalsProps {
    scandals: Scandal[];
    users: User[];
    teams: Team[];
}

export default function AdminScandals({ scandals, users, teams }: AdminScandalsProps) {
    const [scandalFilter, setScandalFilter] = useState('all'); // 'all', 'active', or 'resolved'

    // Filter scandals based on current filter
    const filteredScandals = scandals.filter(scandal => {
        if (scandalFilter === 'all') return true;
        if (scandalFilter === 'active') return !scandal.resolved;
        if (scandalFilter === 'resolved') return scandal.resolved;
        return true;
    });

    const handleResolveScandal = async (scandalId: string) => {
        try {
            const response = await fetch(`/api/admin/scandals/${scandalId}/resolve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // In a real application, you would update the scandal in the state or refetch data
                // For the demo, we'll just show an alert
                alert('Scandal resolved successfully!');
            } else {
                alert('Failed to resolve scandal.');
            }
        } catch (error) {
            console.error('Error resolving scandal:', error);
            alert('An error occurred while resolving the scandal.');
        }
    };

    return (
        <div className={styles.scandalsContent}>
            <h3>Society Scandals</h3>

            <div className={styles.scandalStatusButtons}>
                <button
                    className={`${styles.statusButton} ${scandalFilter === 'all' ? styles.activeButton : ''}`}
                    onClick={() => setScandalFilter('all')}
                >
                    All Scandals
                </button>
                <button
                    className={`${styles.statusButton} ${scandalFilter === 'active' ? styles.activeButton : ''}`}
                    onClick={() => setScandalFilter('active')}
                >
                    Active Only
                </button>
                <button
                    className={`${styles.statusButton} ${scandalFilter === 'resolved' ? styles.activeButton : ''}`}
                    onClick={() => setScandalFilter('resolved')}
                >
                    Resolved
                </button>
            </div>

            {filteredScandals.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No scandals to display.</p>
                    {scandalFilter === 'active' && <p>All societies are maintaining proper decorum.</p>}
                </div>
            ) : (
                <div className={styles.scandalCardsGrid}>
                    {filteredScandals.map(scandal => {
                        const reader = users.find(user => user.id === scandal.userId);
                        const team = teams.find(t => t.code === reader?.team);

                        return (
                            <div
                                key={scandal.id}
                                className={`${styles.scandalCard} ${scandal.resolved ? styles.resolvedScandal : styles.activeScandal}`}
                            >
                                <div className={styles.scandalCardHeader}>
                                    <h4>{scandal.title}</h4>
                                    <span className={scandal.resolved ? styles.resolvedBadge : styles.activeBadge}>
                                        {scandal.resolved ? 'Resolved' : 'Active'}
                                    </span>
                                </div>

                                <p className={styles.scandalDescription}>{scandal.description}</p>

                                <div className={styles.scandalChallenge}>
                                    <strong>Challenge:</strong> {scandal.challenge}
                                </div>

                                <div className={styles.scandalMember}>
                                    <strong>Affecting:</strong> {scandal.user?.name || reader?.name || 'Unknown member'}
                                </div>

                                <div className={styles.scandalTeam}>
                                    <strong>Society:</strong> {team?.name || 'Unknown society'}
                                </div>

                                {scandal.resolved ? (
                                    <div className={styles.scandalResolvedMessage}>
                                        This scandal has been addressed in accordance with society rules.
                                    </div>
                                ) : (
                                    <button
                                        className={styles.resolveButton}
                                        onClick={() => handleResolveScandal(scandal.id)}
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}