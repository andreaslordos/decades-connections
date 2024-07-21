import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { GetTodaysGame, ShuffleArray } from "../lib/helpers";
import ButtonRow from "./ButtonRow";

export default function Grid() {
    const [game, setGame] = useState<any[]>([]);
    const [selectedCells, setSelectedCells] = useState<string[]>([]);

    useEffect(() => {
        const todaysGame = GetTodaysGame();
        const shuffledGame = ShuffleArray(todaysGame);
        setGame(shuffledGame);
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

    let cells: JSX.Element[] = [];

    for (let cat_ind = 0; cat_ind < game.length; cat_ind++) {
        for (let word_ind = 0; word_ind < game[cat_ind].words.length; word_ind++) {
            const word = game[cat_ind].words[word_ind];
            cells.push(
                <Cell
                    key={(game[cat_ind].words.length * cat_ind) + word_ind}
                    difficulty={game[cat_ind].difficulty}
                    word={word}
                    isSelected={selectedCells.includes(word)}
                    onClick={() => handleCellClick(word)}
                    disableCursor={selectedCells.length >= 4}
                />
            );
        }
    }



    return (
        <>
            <div className="grid grid-cols-4 gap-4 mx-auto w-8/12">
                {cells}
            </div>
            <ButtonRow 
                submitEnabled={selectedCells.length >= 4}
                shuffleEnabled={true}
                deselectAllEnabled={selectedCells.length >= 1}
            />
        </>
    );
}