import React, { useState, useEffect, useMemo } from "react";
import Cell from "./Cell";
import { GetTodaysGame, ShuffleArray, DaysSinceStart } from "../lib/helpers";
import GameControls from "./GameControls";
import CompletedCategory from "./CompletedCategory";
import { MAX_MISTAKES } from "../lib/constants";
import Modal from "./Modal";
import { Guess, GameState } from '../types/game';
import GuessTracker from "./GuessTracker";
import ToggleSwitch from "./ToggleSwitch";
import ShareModal from "./ShareModal";
import Button from "./Button";

export default function Grid() {
    const [gameState, setGameState] = useState<GameState>(() => {
        const savedState = localStorage.getItem('gameState-decades-agl-123442');
        const todaysGame = GetTodaysGame();
        
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            if (JSON.stringify(parsedState.originalGame) === JSON.stringify(todaysGame)) {
                return {
                    ...parsedState,
                    incorrectGuesses: new Set(parsedState.incorrectGuesses.map((guess: string[]) => guess)),
                    guesses: parsedState.guesses || []
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
            guesses: []
        };
    });

    const [isEasyMode, setIsEasyMode] = useState(() => {
        const savedMode = localStorage.getItem('gameMode-decades-agl-123442');
        return savedMode ? JSON.parse(savedMode) : false;
    });


    const [gameEnded, setGameEnded] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [gameEndProcessed, setGameEndProcessed] = useState(false);

    const daysSinceStart = useMemo(() => DaysSinceStart(), []);

    useEffect(() => {
        if (!gameEndProcessed && (gameState.lives === 0 || gameState.completedCategories.length === gameState.originalGame.length)) {
            setGameEnded(true);
            setGameEndProcessed(true);
            
            if (gameState.lives === 0) {
                // Set all remaining categories to completed with jump animation
                const remainingCategories = gameState.game.filter((category: any) =>
                    !gameState.completedCategories.includes(category)
                );
                setJumpAnimation(true);
                setTimeout(() => {
                    setGameState((prevState: GameState) => ({
                        ...prevState,
                        completedCategories: [...prevState.completedCategories, ...remainingCategories],
                        game: []
                    }));
                    setJumpAnimation(false);
                }, 1000);
            }
        }
    }, [gameState.lives, gameState.completedCategories.length, gameState.game, gameState.originalGame, gameEndProcessed]);

    const handleShareButtonClick = () => {
        setShowShareModal(true);
    };

    const handleCloseShareModal = () => {
        setShowShareModal(false);
    };
    useEffect(() => {
        localStorage.setItem('gameMode-decades-agl-123442', JSON.stringify(isEasyMode));
    }, [isEasyMode]);

    const [shuffleKey, setShuffleKey] = useState(0);
    const [shakeAnimation, setShakeAnimation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState("");
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

    const handleModeToggle = () => {
        setIsEasyMode((prevMode: any) => !prevMode);
    };
        
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
        if (gameState.selectedCells.length !== 4) return;
                
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

            if (isOneAway) {
                setModalText("One away");
            } else {
                setModalText("Incorrect");
            }

            setShowModal(true);
            setFadeOutModal(false);
            setTimeout(() => {
                setFadeOutModal(true);
                setTimeout(() => setShowModal(false), 300); // Match this with the animation duration
            }, 4000); // Show for 4 seconds before starting fade out

            // Incorrect guess
            setGameState((prevState: GameState) => ({
                ...prevState,
                incorrectGuesses: new Set([...prevState.incorrectGuesses, prevState.selectedCells]),
                lives: prevState.lives - 1,
                guesses: [...prevState.guesses, newGuess]
            }));
        } else {
            // Correct guess
            // Trigger jump animation
            setJumpAnimation(true);
            
            // Delay the state update until after the animation completes
            setTimeout(() => {
                setJumpAnimation(false);
                setGameState((prevState: GameState) => ({
                    ...prevState,
                    game: prevState.game.filter((category: any) => category !== selectedCategory),
                    selectedCells: [],
                    completedCategories: [...prevState.completedCategories, selectedCategory],
                    guesses: [...prevState.guesses, newGuess]
                }));
            }, 1000); // This should match the duration of your jump animation
        }
    };


    const isSubmitEnabled = gameState.selectedCells.length === 4 && !isCurrentGuessAlreadyTried();

    return (
        <div className="space-y-4 relative">
            {showModal && (
                <Modal fadeOutModal={fadeOutModal} text={modalText}/>
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
            {gameEnded ? (
                <div className="flex justify-center">
                    <Button
                        onClick={handleShareButtonClick}
                        text={'View Results'}
                        invertColors={true}
                        enabled={true}
                    />
                </div>
            ) : (
                <GameControls 
                    selectedCellsCount={gameState.selectedCells.length}
                    onDeselectAll={handleDeselectAll}
                    onShuffle={handleShuffle}
                    onSubmit={handleSubmit}
                    lives={gameState.lives}
                    submitEnabled={isSubmitEnabled}
                    isEasyMode={isEasyMode}
                    onModeToggle={handleModeToggle}
                />
            )}
            
            {showShareModal && (
                <ShareModal
                    guesses={gameState.guesses}
                    daysSinceStart={daysSinceStart}
                    onClose={handleCloseShareModal}
                />
            )}
            {isEasyMode ? <GuessTracker guesses={gameState.guesses} /> : null}
        </div>
    );
}