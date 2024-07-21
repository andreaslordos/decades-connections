import React, { useState, useEffect } from "react";

type CellProps = {
    word: string;
    difficulty: number;
    isSelected: boolean;
    onClick: () => void;
    disableCursor: boolean;
    shouldAnimate: boolean;
    shakeAnimation: boolean;
};

export default function Cell({ 
    word, 
    isSelected, 
    onClick, 
    disableCursor, 
    shouldAnimate,
    shakeAnimation
}: CellProps) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (shouldAnimate) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 300);
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
                        ${isSelected ? 'bg-selected text-white' : 'bg-unselected'}
                        ${(!disableCursor || isSelected) ? 'hover:cursor-pointer active:scale-95 duration-150 transition-transform' : 'hover:cursor-default'}
                        ${isSelected && shakeAnimation ? 'animate-shake' : ''}
                        `}
            onClick={onClick}
        >
            <span className={`${animate ? 'fade-in' : ''} ${isSelected ? 'text-white' : ''}`}>
                {word}
            </span>
        </div>
    );
}