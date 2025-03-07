import styles from '@/styles/about.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About the Regency Reading Retreat',
    description: 'Learn more about our regency-themed readathon',
};

export default function About() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>About the Retreat</h1>

                <section className={styles.section}>
                    <h2>A Most Illustrious Reading Challenge</h2>
                    <p>
                        Welcome to the Regency Reading Retreat, a literary event where
                        readers from across the globe gather to celebrate the elegant world
                        of Regency literature while participating in a unique reading challenge.
                    </p>
                    <p>
                        Inspired by the social seasons of 19th century England, our readathon
                        invites participants to form societies (teams) and collectively read
                        books from or about the Regency era, all while navigating the treacherous
                        waters of high society scandals.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>The Rules of Society</h2>
                    <div className={styles.rules}>
                        <div className={styles.rule}>
                            <h3>1. Join a Literary Society</h3>
                            <p>
                                Upon registration, you will select one of our four distinguished
                                societies to join. Each society has its own character and reading preferences.
                            </p>
                        </div>

                        <div className={styles.rule}>
                            <h3>2. Read and Record</h3>
                            <p>
                                Read books set in or about the Regency period (broadly 1795-1837) or
                                written during that time. Log your completed books on your personal
                                reading card in your dashboard.
                            </p>
                        </div>

                        <div className={styles.rule}>
                            <h3>3. Beware of Scandals</h3>
                            <p>
                                Certain reading actions may trigger a "scandal" - an unexpected challenge
                                for your society. These scandals are kept secret until triggered and
                                may include conditions like reading too many short books or neglecting
                                certain authors.
                            </p>
                        </div>

                        <div className={styles.rule}>
                            <h3>4. Society Progress</h3>
                            <p>
                                All books read by society members contribute to your collective total.
                                The society that reaches their reading goal first while managing to
                                navigate the scandals with grace will be declared the winner of the Season.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>This Season's Theme</h2>
                    <p>
                        The Regency era in Britain was a time of refinement, romance,
                        and strict social codes. Our readathon celebrates this fascinating
                        period in literary history while adding a playful competitive element.
                    </p>
                    <p>
                        Whether you're a devoted Jane Austen fan or simply curious about
                        historical fiction, the Regency Reading Retreat offers a delightful
                        way to discover new books and connect with fellow readers.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>About the Host</h2>
                    <div className={styles.host}>
                        <div className={styles.hostImage}></div>
                        <div>
                            <p>
                                The Regency Reading Retreat is hosted by [Channel Name], a BookTube
                                channel dedicated to sharing the joy of literature with readers worldwide.
                            </p>
                            <p>
                                Follow along with our readathon adventures on our channel and social media,
                                where we'll be posting updates, book recommendations, and perhaps even some
                                scandalous society gossip.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}