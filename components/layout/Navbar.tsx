'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './navbar.module.css';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">
                        <span className={styles.logoText}>Regency Reading Retreat</span>
                    </Link>
                </div>

                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className={styles.hamburger}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>

                <nav className={`${styles.nav} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
                    <ul className={styles.navLinks}>
                        <li className={styles.navItem}>
                            <Link href="/" className={styles.navLink}>
                                Home
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/about" className={styles.navLink}>
                                About
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/dashboard" className={styles.navLink}>
                                Dashboard
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/signup" className={styles.signupButton}>
                                Join the Season
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}