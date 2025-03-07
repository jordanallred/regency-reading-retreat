'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/signup.module.css';

interface SignupFormData {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    team: string;
    readingGoal: string;
    socialMedia: string;
}

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        team: '',
        readingGoal: '',
        socialMedia: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validatePasswords = () => {
        if (formData.password !== formData.passwordConfirm) {
            setError('Passwords do not match');
            return false;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!validatePasswords()) {
            return;
        }

        setIsLoading(true);

        try {
            // Send data to our API endpoint
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    team: formData.team,
                    readingGoal: parseInt(formData.readingGoal),
                    socialMedia: formData.socialMedia || null
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Redirect to login page after successful signup
            router.push('/login?registered=true');
        } catch (error) {
            console.error('Signup error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Join the Retreat</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.signupForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                        />
                        <small>Must be at least 8 characters</small>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="passwordConfirm">Confirm Password</label>
                        <input
                            type="password"
                            id="passwordConfirm"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="team">Choose Your Society</label>
                        <select
                            id="team"
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a team...</option>
                            <option value="bridgerton">The Bridgerton Circle</option>
                            <option value="austen">The Austen Assembly</option>
                            <option value="shelley">The Shelley Soirée</option>
                            <option value="byron">The Byron Society</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="readingGoal">Personal Reading Goal</label>
                        <input
                            type="number"
                            id="readingGoal"
                            name="readingGoal"
                            min="1"
                            value={formData.readingGoal}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="socialMedia">Social Media Handle (optional)</label>
                        <input
                            type="text"
                            id="socialMedia"
                            name="socialMedia"
                            value={formData.socialMedia}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Secure Your Invitation'}
                    </button>
                </form>

                <p className={styles.loginLink}>
                    Already a member? <Link href="/login">Sign in</Link>
                </p>
            </main>
        </div>
    );
}