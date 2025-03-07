'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from '@/styles/navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logoLink}>
                    <h1 className={styles.logo}>Regency Reading Retreat</h1>
                </Link>

                <nav className={styles.navigation}>
                    <ul className={styles.navList}>
                        <li>
                            <Link
                                href="/"
                                className={pathname === '/' ? styles.active : ''}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className={pathname === '/about' ? styles.active : ''}
                            >
                                About
                            </Link>
                        </li>

                        {status === 'authenticated' ? (
                            <>
                                <li>
                                    <Link
                                        href="/dashboard"
                                        className={pathname === '/dashboard' ? styles.active : ''}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className={`${styles.signupButton} ${styles.signOutButton}`}
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        href="/login"
                                        className={pathname === '/login' ? styles.active : ''}
                                    >
                                        Sign In
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/signup"
                                        className={`${styles.signupButton} ${pathname === '/signup' ? styles.active : ''}`}
                                    >
                                        Join
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}