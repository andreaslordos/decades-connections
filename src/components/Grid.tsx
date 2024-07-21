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
            // Check if the saved game is from today
            if (JSON.stringify(parsedState.originalGame) === JSON.stringify(todaysGame)) {
                return parsedState;
            }
        }
        
        // If there's no saved state or it's not from today, start a new game
        return {
            game: todaysGame,
            originalGame: todaysGame, // Store the original unshuffled game
            selectedCells: [],
            lives: MAX_MISTAKES,
            completedCategories: [],
        };
    });

    const [shuffleKey, setShuffleKey] = useState(0);

    useEffect(() => {
        localStorage.setItem('gameState-decades-agl-123442', JSON.stringify(gameState));
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

    const handleSubmit = () => {
        if (gameState.selectedCells.length !== 4) return;

        const selectedCategory = gameState.game.find((category: { words: any[]; }) => 
            category.words.every((word: string) => gameState.selectedCells.includes(word))
        );

        setGameState((prevState: any) => ({
            ...prevState,
            game: selectedCategory 
                ? prevState.game.filter((category: any) => category !== selectedCategory)
                : prevState.game,
            selectedCells: [],
            lives: selectedCategory ? prevState.lives : prevState.lives - 1,
            completedCategories: selectedCategory 
                ? [...prevState.completedCategories, selectedCategory]
                : prevState.completedCategories,
        }));
    };

    return (
        <div className="space-y-4"> {/* Reduced space-y value */}
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
                    />
                ))}
            </div>
            <GameControls 
                selectedCellsCount={gameState.selectedCells.length}
                onDeselectAll={handleDeselectAll}
                onShuffle={handleShuffle}
                onSubmit={handleSubmit}
                lives={gameState.lives}
            />
        </div>
    );
}

