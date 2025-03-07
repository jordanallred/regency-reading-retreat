import { Book, Scandal } from '@/types';

interface ScandalTriggers {
    shortBook: (book: Book) => boolean;
    noAusten: (books: Book[]) => boolean;
    tooManyRomance: (books: Book[]) => boolean;
    readingAfterMidnight: (book: Book, time: Date) => boolean;
    tooManyBooksInOneDay: (books: Book[], date: string) => boolean;
}

export const scandalTriggers: ScandalTriggers = {
    shortBook: (book) => book.pages < 200,
    noAusten: (books) => {
        const austenBooks = books.filter(book =>
            book.author.toLowerCase().includes('austen')
        );
        return books.length >= 5 && austenBooks.length === 0;
    },
    tooManyRomance: (books) => {
        const romanceBooks = books.filter(book =>
            book.genre.toLowerCase() === 'regency' ||
            book.genre.toLowerCase() === 'romance'
        );
        return romanceBooks.length >= 3 && books.length >= 4 && (romanceBooks.length / books.length) > 0.75;
    },
    readingAfterMidnight: (book, time) => {
        const hour = time.getHours();
        return hour >= 0 && hour < 6;
    },
    tooManyBooksInOneDay: (books, date) => {
        const booksOnDate = books.filter(book =>
            new Date(book.dateFinished).toDateString() === new Date(date).toDateString()
        );
        return booksOnDate.length >= 3;
    }
};

export const possibleScandals: Scandal[] = [
    {
        id: 1,
        title: "Reading Material Too Brief",
        description: "Your society has been gossiped about for preferring brevity over substance! A book under 200 pages is hardly enough to demonstrate literary devotion.",
        challenge: "Your team must now read an additional book over 400 pages to restore your reputation.",
        trigger: 'shortBook'
    },
    {
        id: 2,
        title: "Neglecting Miss Austen",
        description: "The ton is shocked by your society's apparent disregard for the works of Jane Austen! How can one claim to appreciate Regency literature without paying proper respect to its most celebrated author?",
        challenge: "Each member of your society must read at least one Jane Austen novel before the season's end.",
        trigger: 'noAusten'
    },
    {
        id: 3,
        title: "Improper Reading Hours",
        description: "Word has spread that a member of your society was caught reading at a most indecent hour! Such behavior suggests a concerning lack of propriety.",
        challenge: "Your society must organize a proper afternoon tea and reading session to demonstrate your commitment to decorum.",
        trigger: 'readingAfterMidnight'
    },
    {
        id: 4,
        title: "Excessive Romantic Notions",
        description: "Your society has developed a reputation for an unseemly preoccupation with romantic literature. The more serious literary circles are questioning your intellectual depth.",
        challenge: "Your next three books must include at least one historical non-fiction work about the Regency period.",
        trigger: 'tooManyRomance'
    },
    {
        id: 5,
        title: "Suspicious Reading Pace",
        description: "Eyebrows have been raised at the remarkable speed with which a member of your society claims to consume literature. Such haste suggests either superficial reading or—dare we suggest—fabrication.",
        challenge: "Your society must provide a detailed review of your next completed book to prove your thorough engagement with the text.",
        trigger: 'tooManyBooksInOneDay'
    }
];

export function checkForScandal(userBooks: Book[], newBook: Book, time: Date = new Date()): Scandal | null {
    const allBooks = [...userBooks, newBook];

    // Check each trigger
    if (scandalTriggers.shortBook(newBook)) {
        return possibleScandals.find(s => s.trigger === 'shortBook') || null;
    }

    if (scandalTriggers.noAusten(allBooks)) {
        return possibleScandals.find(s => s.trigger === 'noAusten') || null;
    }

    if (scandalTriggers.tooManyRomance(allBooks)) {
        return possibleScandals.find(s => s.trigger === 'tooManyRomance') || null;
    }

    if (scandalTriggers.readingAfterMidnight(newBook, time)) {
        return possibleScandals.find(s => s.trigger === 'readingAfterMidnight') || null;
    }

    if (scandalTriggers.tooManyBooksInOneDay(allBooks, newBook.dateFinished)) {
        return possibleScandals.find(s => s.trigger === 'tooManyBooksInOneDay') || null;
    }

    return null;
}