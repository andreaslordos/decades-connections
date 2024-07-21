export type Guess = {
    words: string[];
    categories: number[];
};

export type GameState = {
    game: any[];
    originalGame: any[];
    selectedCells: string[];
    lives: number;
    completedCategories: any[];
    incorrectGuesses: Set<string[]>;
    guesses: Guess[];
    isEasyMode: boolean;
};