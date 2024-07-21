import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { GetTodaysGame, ShuffleArray } from "../lib/helpers";
import GameControls from "./GameControls";
import { MAX_MISTAKES } from "../lib/constants";

export default function Grid() {
    const [gameState, setGameState] = useState(() => {
        const savedState = localStorage.getItem('gameState-decades-agl');
        if (savedState) {
            return JSON.parse(savedState);
        }
        return {
            game: ShuffleArray(GetTodaysGame()),
            selectedCells: [],
            lives: MAX_MISTAKES,
        };
    });

    const [shuffleKey, setShuffleKey] = useState(0);

    useEffect(() => {
        localStorage.setItem('gameState-decades-agl', JSON.stringify(gameState));
    }, [gameState]);

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

        setGameState((prevState: { game: any[]; selectedCells: string[]; lives: number; }) => ({
            ...prevState,
            game: selectedCategory 
                ? prevState.game.filter((category: any) => category !== selectedCategory)
                : prevState.game,
            selectedCells: selectedCategory ? [] : prevState.selectedCells,
            lives: selectedCategory ? prevState.lives : prevState.lives - 1
        }));
    };

    let cells: JSX.Element[] = [];

    for (let cat_ind = 0; cat_ind < gameState.game.length; cat_ind++) {
        for (let word_ind = 0; word_ind < gameState.game[cat_ind].words.length; word_ind++) {
            const word = gameState.game[cat_ind].words[word_ind];
            cells.push(
                <Cell
                    key={`${shuffleKey}-${cat_ind}-${word_ind}-${word}`}
                    difficulty={gameState.game[cat_ind].difficulty}
                    word={word}
                    isSelected={gameState.selectedCells.includes(word)}
                    onClick={() => handleCellClick(word)}
                    disableCursor={gameState.selectedCells.length >= 4}
                    shouldAnimate={true}
                />
            );
        }
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto w-11/12 md:w-8/12">
                {cells}
            </div>
            <GameControls 
                selectedCellsCount={gameState.selectedCells.length}
                onDeselectAll={handleDeselectAll}
                onShuffle={handleShuffle}
                onSubmit={handleSubmit}
                lives={gameState.lives}
            />
        </>
    );
}