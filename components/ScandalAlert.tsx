'use client';

import styles from '@/styles/scandalAlert.module.css';
import { Scandal } from '@/types';

interface ScandalAlertProps {
    scandal: Scandal | null;
    onDismiss: () => void;
}

export default function ScandalAlert({ scandal, onDismiss }: ScandalAlertProps) {
    if (!scandal) return null;

    return (
        <div className={styles.scandalContainer}>
            <div className={styles.scandalContent}>
                <div className={styles.scandalHeader}>
                    <h2>⚠️ Scandal Alert! ⚠️</h2>
                    <button className={styles.closeButton} onClick={onDismiss}>×</button>
                </div>
                <h3>{scandal.title}</h3>
                <p>{scandal.description}</p>
                <div className={styles.challenge}>
                    <span>Challenge:</span> {scandal.challenge}
                </div>
                <button
                    className={styles.acceptButton}
                    onClick={onDismiss}
                >
                    Accept Challenge
                </button>
            </div>
        </div>
    );
}