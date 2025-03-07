import { Book } from "@/types";

interface Scandal {
    id: string;
    title: string;
    description: string;
    challenge: string;
}

// Define scandal triggers
const scandalTriggers = [
    {
        name: "Too Many Short Books",
        condition: (books: Book[], newBook: Book) => {
            const shortBooks = [...books, newBook].filter(book => book.pages < 200);
            return shortBooks.length >= 3;
        },
        scandal: {
            id: "scandal-short-books",
            title: "Society Gossip: Reading Material Too Light!",
            description: "Whispers circulate about your society's preference for shorter reads. The quality of your literary discourse is being questioned!",
            challenge: "Read at least two books with over 400 pages to restore your reputation."
        }
    },
    {
        name: "Avoiding Classics",
        condition: (books: Book[], newBook: Book) => {
            const classicBooks = [...books, newBook].filter(book => book.genre === "classic");
            const totalBooks = books.length + 1;
            return totalBooks >= 5 && classicBooks.length === 0;
        },
        scandal: {
            id: "scandal-no-classics",
            title: "Scandal: Neglecting the Classics!",
            description: "Your society has been accused of literary ignorance for avoiding the classics entirely.",
            challenge: "At least one member must read a classic work of literature before the next social gathering."
        }
    },
    {
        name: "Genre Imbalance",
        condition: (books: Book[], newBook: Book) => {
            const allBooks = [...books, newBook];
            if (allBooks.length < 4) return false;

            const genres = allBooks.map(book => book.genre);
            const mostCommonGenre = findMostCommonElement(genres);
            const dominantGenreCount = genres.filter(g => g === mostCommonGenre).length;

            return dominantGenreCount >= allBooks.length * 0.75; // 75% or more books are same genre
        },
        scandal: {
            id: "scandal-genre-imbalance",
            title: "Literary Monotony Scandal!",
            description: "Your society has been criticized for narrow literary interests, focusing too much on a single genre.",
            challenge: "Each member must read a book from a different genre than their previous selection."
        }
    }
];

// Helper function to find most common element in an array
function findMostCommonElement(arr: any[]) {
    const counts = arr.reduce((acc: {[key: string]: number}, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

/**
 * Checks if a new book triggers any scandals
 * @param existingBooks - Books the user has already read
 * @param newBook - The newly added book
 * @returns A scandal object if triggered, null otherwise
 */
export function checkForScandal(existingBooks: Book[], newBook: Book): Scandal | null {
    for (const trigger of scandalTriggers) {
        if (trigger.condition(existingBooks, newBook)) {
            return trigger.scandal;
        }
    }

    return null;
}