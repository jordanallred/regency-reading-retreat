import './globals.css';
import { Lora, Playfair_Display } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import { Metadata } from 'next';

// Define fonts
const lora = Lora({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-lora',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-playfair',
});

export const metadata: Metadata = {
    title: {
        default: 'Regency Reading Retreat',
        template: '%s | Regency Reading Retreat'
    },
    description: 'A themed readathon where teams read regency books while avoiding scandals!',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${lora.variable} ${playfair.variable}`}>
        <body>
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <footer className="py-6 text-center bg-[#f4e9d9] border-t border-[#e5e5e5]">
                <p>&copy; {new Date().getFullYear()} Regency Reading Retreat</p>
            </footer>
        </div>
        </body>
        </html>
    );
}