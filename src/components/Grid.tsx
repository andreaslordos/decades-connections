import React, { useState, useEffect, useMemo } from "react";
import Cell from "./Cell";
import { GetTodaysGame, ShuffleArray, DaysSinceStart } from "../lib/helpers";
import GameControls from "./GameControls";
import CompletedCategory from "./CompletedCategory";
import { MAX_MISTAKES } from "../lib/constants";
import Modal from "./Modal";
import { Guess, GameState } from '../types/game';
import GuessTracker from "./GuessTracker";
import ShareModal from "./ShareModal";
import Button from "./Button";

export default function Grid() {
    const [shuffleKey, setShuffleKey] = useState(0);
    const [shakeAnimation, setShakeAnimation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const [fadeOutModal, setFadeOutModal] = useState(false);
    const [jumpAnimation, setJumpAnimation] = useState(false);
    const [animatingCategory, setAnimatingCategory] = useState<any | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameEndProcessed, setGameEndProcessed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [gameState, setGameState] = useState<GameState>(() => {
        const savedState = localStorage.getItem('gameState-decades-agl-123442');
        const todaysGame = GetTodaysGame();
        
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            if (JSON.stringify(parsedState.originalGame) === JSON.stringify(todaysGame)) {
                return {
                    ...parsedState,
                    incorrectGuesses: new Set(parsedState.incorrectGuesses.map((guess: string[]) => guess)),
                    guesses: parsedState.guesses || [],
                    isEasyMode: parsedState.isEasyMode !== undefined ? parsedState.isEasyMode : false
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
            guesses: [],
            isEasyMode: false
        };
    });

    const daysSinceStart = useMemo(() => DaysSinceStart(), []);

    const animateCategoriesSequentially = (categories: any[]) => {
        if (categories.length === 0) {
            setShowShareModal(true);
            return;
        }

        const [currentCategory, ...remainingCategories] = categories;
        
        // Set the current category as animating and update selected cells
        setAnimatingCategory(currentCategory);
        setGameState((prevState: GameState) => ({
            ...prevState,
            selectedCells: currentCategory.words
        }));

        setTimeout(() => {
            // Add the current category to completed categories and remove from game
            setGameState((prevState: GameState) => ({
                ...prevState,
                completedCategories: [...prevState.completedCategories, currentCategory],
                game: prevState.game.filter((cat: any) => cat !== currentCategory),
                selectedCells: [] // Clear selected cells after animation
            }));

            setAnimatingCategory(null);

            setTimeout(() => {
                animateCategoriesSequentially(remainingCategories);
            }, 500);
        }, 1500);
    };

    useEffect(() => {
        if (!gameEndProcessed && (gameState.lives === 0 || gameState.completedCategories.length === gameState.originalGame.length)) {
            setGameEnded(true);
            setGameEndProcessed(true);
            
            const remainingCategories = gameState.game.filter((category: any) =>
                !gameState.completedCategories.includes(category)
            );
            
            if (remainingCategories.length > 0) {
                animateCategoriesSequentially(remainingCategories);
            } else {
                setShowShareModal(true);
            }
        }
    }, [gameState.lives, animateCategoriesSequentially, gameState.completedCategories, gameState.completedCategories.length, gameState.game, gameState.originalGame, gameEndProcessed]);

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
    }, [gameState.game]);

    const handleModeToggle = () => {
        setGameState((prevState) => ({
            ...prevState,
            isEasyMode: !prevState.isEasyMode
        }));
    };

    useEffect(() => {
        localStorage.setItem('gameState-decades-agl-123442', JSON.stringify({
            ...gameState,
            incorrectGuesses: Array.from(gameState.incorrectGuesses),
            isEasyMode: gameState.isEasyMode
        }));
    }, [gameState]);
        
    const handleCellClick = (word: string) => {
        setGameState((prevState: GameState) => ({
            ...prevState,
            selectedCells: prevState.selectedCells.includes(word)
                ? prevState.selectedCells.filter((cell: string) => cell !== word)
                : prevState.selectedCells.length < 4
                    ? [...prevState.selectedCells, word]
                    : prevState.selectedCells
        }));
    };

    const handleDeselectAll = () => {
        setGameState((prevState: GameState) => ({
            ...prevState,
            selectedCells: []
        }));
    };

    const handleShuffle = () => {
        setGameState((prevState: GameState) => ({
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
        if (gameState.selectedCells.length !== 4 || isProcessing) return;
        
        setIsProcessing(true);
        
        const selectedCategory = gameState.game.find((category: { words: any[]; }) => 
            category.words.every((word: string) => gameState.selectedCells.includes(word))
        );

        const newGuess: Guess = {
            words: gameState.selectedCells,
            categories: gameState.selectedCells.map(word => {
                const category = gameState.originalGame.find(cat => cat.words.includes(word));
                return category ? category.difficulty : 0;
            })
        };

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

            setModalText(isOneAway ? "One away" : "Incorrect");
            setShowModal(true);
            setFadeOutModal(false);
            setTimeout(() => {
                setFadeOutModal(true);
                setTimeout(() => setShowModal(false), 300);
            }, 4000);

            setGameState((prevState: GameState) => ({
                ...prevState,
                incorrectGuesses: new Set([...prevState.incorrectGuesses, prevState.selectedCells]),
                lives: prevState.lives - 1,
                guesses: [...prevState.guesses, newGuess]
            }));
            setIsProcessing(false);
        } else {
            setModalText("Correct");
            setShowModal(true);
            setFadeOutModal(false);
            setTimeout(() => {
                setFadeOutModal(true);
                setTimeout(() => setShowModal(false), 300);
            }, 3000);

            setJumpAnimation(true);
            
            setTimeout(() => {
                setJumpAnimation(false);
                setGameState((prevState: GameState) => ({
                    ...prevState,
                    game: prevState.game.filter((category: any) => category !== selectedCategory),
                    selectedCells: [],
                    completedCategories: [...prevState.completedCategories, selectedCategory],
                    guesses: [...prevState.guesses, newGuess]
                }));
                setIsProcessing(false);
            }, 1000);
        }
    };

    const isSubmitEnabled = gameState.selectedCells.length === 4 && !isCurrentGuessAlreadyTried() && !isProcessing;

    return (
        <div className="relative">
            {showModal && (
                <Modal fadeOutModal={fadeOutModal} text={modalText}/>
            )}
            {gameState.completedCategories.length > 0 && (
                <div className="space-y-2 gap-4 mx-auto w-11/12 md:w-8/12 mb-4">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto w-11/12 md:w-8/12 mb-4">
                {shuffledCells.map((cellData, index) => (
                    <Cell
                        key={`${shuffleKey}-${index}-${cellData.word}`}
                        difficulty={cellData.difficulty}
                        word={cellData.word}
                        isSelected={gameState.selectedCells.includes(cellData.word)}
                        onClick={() => !isProcessing && !gameEnded && handleCellClick(cellData.word)}
                        disableCursor={gameState.selectedCells.length >= 4 || isProcessing || gameEnded}
                        shouldAnimate={true}
                        shakeAnimation={shakeAnimation}
                        jumpAnimation={gameEnded ? animatingCategory !== null && animatingCategory.words.includes(cellData.word) : jumpAnimation}
                        jumpDelay={gameEnded ? (animatingCategory?.words.indexOf(cellData.word) * 100 || 0) : gameState.selectedCells.indexOf(cellData.word) * 100}
                    />
                ))}
            </div>
            {gameEnded ? (
                <div className="flex justify-center mb-4">
                    <Button
                        onClick={() => setShowShareModal(true)}
                        text={'View Results'}
                        invertColors={true}
                        enabled={gameEnded}
                    />
                </div>
            ) : (
                <div className="mb-4">
                    <GameControls 
                        selectedCellsCount={gameState.selectedCells.length}
                        onDeselectAll={handleDeselectAll}
                        onShuffle={handleShuffle}
                        onSubmit={handleSubmit}
                        lives={gameState.lives}
                        submitEnabled={isSubmitEnabled}
                        isEasyMode={gameState.isEasyMode}
                        onModeToggle={handleModeToggle}
                        isProcessing={isProcessing}
                    />
                </div>
            )}    
            {showShareModal && (
                <ShareModal
                    guesses={gameState.guesses}
                    daysSinceStart={daysSinceStart}
                    onClose={() => setShowShareModal(false)}
                />
            )}
            {gameState.isEasyMode && (
                <div className="mt-4">
                    <GuessTracker guesses={gameState.guesses} />
                </div>
            )}
        </div>
    );
}