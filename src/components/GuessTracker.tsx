import React from 'react';
import { Guess } from '../types/game';

type GuessTrackerProps = {
    guesses: Guess[];
};

const categoryEmojis: { [key: number]: string } = {
    1: '🟨',
    2: '🟩',
    3: '🟦',
    4: '🟪'
};

export default function GuessTracker({ guesses }: GuessTrackerProps) {
    return (
        <div className="mt-8 mx-auto w-11/12 md:w-8/12">
            <h2 className="text-xl font-bold mb-4">Attempts</h2>
            {guesses.map((guess, index) => (
                <div key={index} className="mb-4">
                    <hr/><br/>
                    {guess.words.map((word, wordIndex) => (
                        <div key={wordIndex}>
                            {categoryEmojis[guess.categories[wordIndex]]} {word}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}