import React, { useState, useEffect, useMemo } from "react";
import Cell from "./Cell";
import { GetTodaysGame, ShuffleArray } from "../lib/helpers";
import GameControls from "./GameControls";
import CompletedCategory from "./CompletedCategory";
import { MAX_MISTAKES } from "../lib/constants";

export default function Grid() {
    const [gameState, setGameState] = useState(() => {
        const savedState = localStorage.getItem('gameState-decades-agl-123442');
        const todaysGame = GetTodaysGame();
        
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            if (JSON.stringify(parsedState.originalGame) === JSON.stringify(todaysGame)) {
                return {
                    ...parsedState,
                    incorrectGuesses: new Set(parsedState.incorrectGuesses.map((guess: string[]) => guess))
                };
            }
        }
        
        return {
            game: todaysGame,
            originalGame: todaysGame,
            selectedCells: [],
            lives: MAX_MISTAKES,
            completedCategories: [],
            incorrectGuesses: new Set(),
        };
    });

    const [shuffleKey, setShuffleKey] = useState(0);
    const [shakeAnimation, setShakeAnimation] = useState(false);
    const [showOneAwayModal, setShowOneAwayModal] = useState(false);

    useEffect(() => {
        localStorage.setItem('gameState-decades-agl-123442', JSON.stringify({
            ...gameState,
            incorrectGuesses: Array.from(gameState.incorrectGuesses)
        }));
    }, [gameState]);

    const shuffledCells = useMemo(() => {
        const cells = gameState.game.flatMap((category: { words: any[]; difficulty: any; }, categoryIndex: any) =>
            category.words.map((word: any) => ({
                word,
                difficulty: category.difficulty,
                categoryIndex
            }))
        );
        return ShuffleArray(cells);
    }, [gameState.game, shuffleKey]);
        
    const handleCellClick = (word: string) => {
        setGameState((prevState: { selectedCells: string[]; }) => ({
            ...prevState,
            selectedCells: prevState.selectedCells.includes(word)
                ? prevState.selectedCells.filter((cell: string) => cell !== word)
                : prevState.selectedCells.length < 4
                    ? [...prevState.selectedCells, word]
                    : prevState.selectedCells
        }));
    };

    const handleDeselectAll = () => {
        setGameState((prevState: any) => ({
            ...prevState,
            selectedCells: []
        }));
    };

    const handleShuffle = () => {
        setGameState((prevState: { game: any[]; }) => ({
            ...prevState,
            game: ShuffleArray(prevState.game.map((category: { words: any; }) => ({
                ...category,
                words: ShuffleArray([...category.words])
            })))
        }));
        setShuffleKey(prevKey => prevKey + 1);
    };

    const isCurrentGuessAlreadyTried = () => {
        const currentGuessSet = new Set(gameState.selectedCells);
        return Array.from(gameState.incorrectGuesses).some((guess: any) => 
            guess.length === currentGuessSet.size &&
            guess.every((word: string) => currentGuessSet.has(word))
        );
    };

    const handleSubmit = () => {
        if (gameState.selectedCells.length !== 4) return;

        const selectedCategory = gameState.game.find((category: { words: any[]; }) => 
            category.words.every((word: string) => gameState.selectedCells.includes(word))
        );

        if (!selectedCategory) {
            // Trigger shake animation
            setShakeAnimation(true);
            setTimeout(() => {
                setShakeAnimation(false);
            }, 500);

            // Check if 3 out of 4 words are correct
            const correctWords = gameState.game.flatMap((category: { words: string[]; }) => category.words)
                .filter((word: string) => gameState.selectedCells.includes(word));
            if (correctWords.length === 3) {
                setShowOneAwayModal(true);
                setTimeout(() => setShowOneAwayModal(false), 2000);
            }

            // Incorrect guess
            setGameState((prevState: any) => ({
                ...prevState,
                incorrectGuesses: new Set([...prevState.incorrectGuesses, prevState.selectedCells]),
                lives: prevState.lives - 1,
            }));
        } else {
            // Correct guess
            setGameState((prevState: any) => ({
                ...prevState,
                game: prevState.game.filter((category: any) => category !== selectedCategory),
                selectedCells: [],
                completedCategories: [...prevState.completedCategories, selectedCategory],
            }));
        }
    };


    const isSubmitEnabled = gameState.selectedCells.length === 4 && !isCurrentGuessAlreadyTried();

    return (
        <div className="space-y-4">
            {gameState.completedCategories.length > 0 && (
                <div className="space-y-2 gap-4 mx-auto w-11/12 md:w-8/12">
                    {gameState.completedCategories.map((category: any, index: number) => (
                        <CompletedCategory
                            key={index}
                            name={category.category}
                            difficulty={category.difficulty}
                            headlines={category.words}
                        />
                    ))}
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto w-11/12 md:w-8/12">
                {shuffledCells.map((cellData, index) => (
                    <Cell
                        key={`${shuffleKey}-${index}-${cellData.word}`}
                        difficulty={cellData.difficulty}
                        word={cellData.word}
                        isSelected={gameState.selectedCells.includes(cellData.word)}
                        onClick={() => handleCellClick(cellData.word)}
                        disableCursor={gameState.selectedCells.length >= 4}
                        shouldAnimate={true}
                        shakeAnimation={shakeAnimation}
                    />
                ))}
            </div>
            <GameControls 
                selectedCellsCount={gameState.selectedCells.length}
                onDeselectAll={handleDeselectAll}
                onShuffle={handleShuffle}
                onSubmit={handleSubmit}
                lives={gameState.lives}
                submitEnabled={isSubmitEnabled}
            />
            {showOneAwayModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-black text-white p-4 rounded-md shadow-lg">
                        One away...
                    </div>
                </div>
            )}
        </div>
    );
}