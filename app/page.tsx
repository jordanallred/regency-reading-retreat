import Link from 'next/link';
import styles from '@/styles/home.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regency Reading Retreat | Readathon',
  description: 'Join the Regency Reading Retreat - a themed readathon where teams read regency books while avoiding scandals!',
};

export default function Home() {
  return (
      <div className={styles.container}>
        <div className={`${styles.hero} ${styles.heroFallback}`}>
          <h1 className={styles.title}>Regency Reading Retreat</h1>
          <p className={styles.description}>
            A most delightful reading challenge where propriety and literature shall meet
          </p>
          <div className={styles.cta}>
            <Link href="/signup" className={styles.primaryButton}>
              Join the Retreat
            </Link>
            <Link href="/about" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>

        <section className={styles.infoSection}>
          <h2>The Season Begins</h2>
          <p>
            Welcome to our Regency Reading Retreat, a most exquisite readathon inspired by
            the grand social season of 19th century England. Participants across the globe
            will form teams to collectively read regency-era literature while navigating
            the treacherous waters of high society.
          </p>
          <p>
            Be cautious, dear reader! Unknown actions may trigger a scandal,
            presenting your team with additional challenges to overcome.
          </p>
        </section>

        <section className={styles.teamSection}>
          <h2>Choose Your Society</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamCard}>
              <h3>The Bridgerton Circle</h3>
              <p>Known for their love of romance and society gossip</p>
            </div>
            <div className={styles.teamCard}>
              <h3>The Austen Assembly</h3>
              <p>Celebrated for wit, wisdom, and literary discussions</p>
            </div>
            <div className={styles.teamCard}>
              <h3>The Shelley Soirée</h3>
              <p>Drawn to the gothic and revolutionary literature</p>
            </div>
            <div className={styles.teamCard}>
              <h3>The Byron Society</h3>
              <p>Passionate, dramatic, and always seeking adventure</p>
            </div>
          </div>
        </section>

        <section className={styles.rulesSection}>
          <h2>The Rules of Engagement</h2>
          <div className={styles.rulesList}>
            <div className={styles.ruleItem}>
              <h3>Join a Team</h3>
              <p>Choose your literary society and meet your fellow readers</p>
            </div>
            <div className={styles.ruleItem}>
              <h3>Read Regency Books</h3>
              <p>Each book read contributes to your team's collective total</p>
            </div>
            <div className={styles.ruleItem}>
              <h3>Log Your Reading</h3>
              <p>Document your literary conquests on your personal card</p>
            </div>
            <div className={styles.ruleItem}>
              <h3>Navigate Scandals</h3>
              <p>Certain actions may trigger unexpected challenges</p>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Regency Reading Retreat</p>
        </footer>
      </div>
  );
}