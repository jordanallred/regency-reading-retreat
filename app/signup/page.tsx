'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/signup.module.css';

interface SignupFormData {
    name: string;
    email: string;
    team: string;
    readingGoal: string;
    socialMedia: string;
}

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        team: '',
        readingGoal: '',
        socialMedia: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Here you would typically connect to your backend
        // For now we'll just simulate success
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Join the Retreat</h1>

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

                    <button type="submit" className={styles.submitButton}>
                        Secure Your Invitation
                    </button>
                </form>
            </main>
        </div>
    );
}