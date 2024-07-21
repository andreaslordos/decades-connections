import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { GetTodaysGame, ShuffleArray } from "../lib/helpers";
import GameControls from "./GameControls";

export default function Grid() {
    const [game, setGame] = useState<any[]>([]);
    const [selectedCells, setSelectedCells] = useState<string[]>([]);
    const [shuffleKey, setShuffleKey] = useState(0);

    useEffect(() => {
        const todaysGame = GetTodaysGame();
        const shuffledGame = ShuffleArray(todaysGame);
        setGame(shuffledGame);
        setShuffleKey(prevKey => prevKey + 1);
    }, []);

    const handleCellClick = (word: string) => {
        setSelectedCells(prev => {
            if (prev.includes(word)) {
                return prev.filter(cell => cell !== word);
            }
            if (prev.length < 4) {
                return [...prev, word];
            }
            return prev;
        });
    };

    const handleDeselectAll = () => {
        setSelectedCells([]);
    };

    const handleShuffle = () => {
        setGame(prevGame => {
            const newGame = [...prevGame];
            for (let category of newGame) {
                category.words = ShuffleArray([...category.words]);
            }
            setShuffleKey(prevKey => prevKey + 1); // Update key on shuffle
            return ShuffleArray(newGame);
        });
    };

    let cells: JSX.Element[] = [];

    for (let cat_ind = 0; cat_ind < game.length; cat_ind++) {
        for (let word_ind = 0; word_ind < game[cat_ind].words.length; word_ind++) {
            const word = game[cat_ind].words[word_ind];
            cells.push(
                <Cell
                    key={`${shuffleKey}-${cat_ind}-${word_ind}-${word}`} // Use shuffleKey to ensure reanimation
                    difficulty={game[cat_ind].difficulty}
                    word={word}
                    isSelected={selectedCells.includes(word)}
                    onClick={() => handleCellClick(word)}
                    disableCursor={selectedCells.length >= 4}
                    shouldAnimate={true} // Always animate
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
                selectedCellsCount={selectedCells.length}
                onDeselectAll={handleDeselectAll}
                onShuffle={handleShuffle}
                onSubmit={() => {}}
                lives={4}
            />
        </>
    );
}
