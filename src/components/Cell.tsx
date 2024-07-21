import React, { useState, useEffect } from "react";

type CellProps = {
    word: string;
    difficulty: number;
    isSelected: boolean;
    onClick: () => void;
    disableCursor: boolean;
    shouldAnimate: boolean;
};

export default function Cell({ word, isSelected, onClick, disableCursor, shouldAnimate }: CellProps) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (shouldAnimate) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 300); // Adjust the timeout duration to match the CSS animation duration
            return () => clearTimeout(timer);
        }
    }, [shouldAnimate]);

    return (
        <div 
            className={`flex 
                        items-center 
                        font-classic
                        justify-center 
                        p-4 
                        rounded
                        uppercase
                        select-none
                        text-xs
                        ${isSelected ? 'bg-selected text-white' : 'bg-unselected'}
                        ${(!disableCursor || isSelected) ? 'hover:cursor-pointer active:scale-95 duration-150 transition-transform' : 'hover:cursor-default'}
                        `}
            onClick={onClick}
        >
            <span className={`${animate ? 'fade-in' : ''} ${isSelected ? 'text-white' : ''}`}>
                {word}
            </span>
        </div>
    );
}
