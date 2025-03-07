'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/login.module.css';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            });

            if (result?.error) {
                setError('Invalid credentials');
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login');
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Enter the Season</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Sign In
                    </button>
                </form>

                <p className={styles.signupLink}>
                    Not yet a member? <Link href="/signup">Secure your invitation</Link>
                </p>
            </main>
        </div>
    );
}
