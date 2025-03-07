// Book type
export interface Book {
    id?: string;
    title: string;
    author: string;
    pages: number;
    genre: string;
    dateFinished: string;
    userId?: string;
}

// Scandal type
export interface Scandal {
    id: string;
    title: string;
    description: string;
    challenge: string;
    isResolved?: boolean;
}

// Team type
export interface Team {
    id: string;
    name: string;
    booksRead: number;
    goal: number;
    scandalCount: number;
    memberCount: number;
}

// User data type for dashboard
export interface UserData {
    name: string;
    team: string;
    booksRead: Book[];
    teamProgress: number;
    teamGoal: number;
    currentScandal: Scandal | null;
}