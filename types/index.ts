export interface Book {
    title: string;
    author: string;
    pages: number;
    genre: string;
    dateFinished: string;
}

export interface Scandal {
    id: number;
    title: string;
    description: string;
    challenge: string;
    trigger: string;
}

export interface UserData {
    name: string;
    team: string;
    booksRead: Book[];
    teamProgress: number;
    teamGoal: number;
    currentScandal: Scandal | null;
}

export interface TeamStanding {
    name: string;
    booksRead: number;
    scandals: number;
}