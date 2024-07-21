import React, { useState, useEffect, useMemo } from "react";
import Cell from "./Cell";
import { GetTodaysGame, ShuffleArray } from "../lib/helpers";
import GameControls from "./GameControls";
import CompletedCategory from "./CompletedCategory";
import { MAX_MISTAKES } from "../lib/constants";
import Modal from "./Modal";

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
    const [fadeOutModal, setFadeOutModal] = useState(false);
    const [jumpAnimation, setJumpAnimation] = useState(false);


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

            // Check if 3 out of 4 words are from the same category
            const isOneAway = gameState.game.some((category: { words: string[]; }) => {
                const matchingWords = category.words.filter((word: string) => 
                    gameState.selectedCells.includes(word)
                );
                return matchingWords.length === 3;
            });

            if (isOneAway) {
                console.log("One away");
                setShowOneAwayModal(true);
                setFadeOutModal(false);
                setTimeout(() => {
                    setFadeOutModal(true);
                    setTimeout(() => setShowOneAwayModal(false), 300); // Match this with the animation duration
                }, 4000); // Show for 4 seconds before starting fade out
            }

            // Incorrect guess
            setGameState((prevState: any) => ({
                ...prevState,
                incorrectGuesses: new Set([...prevState.incorrectGuesses, prevState.selectedCells]),
                lives: prevState.lives - 1,
            }));
        } else {
            // Correct guess
            // Trigger jump animation
            setJumpAnimation(true);
            
            // Delay the state update until after the animation completes
            setTimeout(() => {
                setJumpAnimation(false);
                setGameState((prevState: any) => ({
                    ...prevState,
                    game: prevState.game.filter((category: any) => category !== selectedCategory),
                    selectedCells: [],
                    completedCategories: [...prevState.completedCategories, selectedCategory],
                }));
            }, 1000); // This should match the duration of your jump animation
        }
    };


    const isSubmitEnabled = gameState.selectedCells.length === 4 && !isCurrentGuessAlreadyTried();

    return (
        <div className="space-y-4 relative">
            {showOneAwayModal && (
                <Modal fadeOutModal={fadeOutModal} text='One away'/>
            )}
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
                        jumpAnimation={jumpAnimation}
                        jumpDelay={gameState.selectedCells.indexOf(cellData.word) * 100}
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
        </div>
    );
}