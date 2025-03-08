// Update components/layout/Navbar.tsx to include an Admin link for authenticated users
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from '@/styles/navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.logoLink}>
                        <h1 className={styles.logo}>Regency Reading Retreat</h1>
                    </Link>

                    <button
                        className={`${styles.menuButton} ${isMenuOpen ? styles.menuOpen : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className={styles.menuBar}></span>
                        <span className={styles.menuBar}></span>
                        <span className={styles.menuBar}></span>
                    </button>
                </div>

                <nav className={`${styles.navigation} ${isMenuOpen ? styles.mobileOpen : ''}`}>
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
                                {/* Add Admin link - in a real app, this would be conditionally shown based on admin role */}
                                <li>
                                    <Link
                                        href="/admin"
                                        className={pathname === '/admin' ? styles.active : ''}
                                    >
                                        Admin
                                    </Link>
                                </li>
                                <li className={styles.mobileOnly}>
                                    <span className={styles.userName}>{session?.user?.name}</span>
                                </li>
                                <li className={styles.navButton}>
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
                                <li className={styles.navButton}>
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