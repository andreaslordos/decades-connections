import React, { useState, useEffect } from "react";

type CellProps = {
    word: string;
    difficulty: number;
    isSelected: boolean;
    onClick: () => void;
    disableCursor: boolean;
    shouldAnimate: boolean;
    shakeAnimation: boolean;
    jumpAnimation: boolean;
    jumpDelay: number;
};

export default function Cell({ 
    word, 
    isSelected, 
    onClick, 
    disableCursor, 
    shouldAnimate,
    shakeAnimation,
    jumpAnimation,
    jumpDelay
}: CellProps) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (shouldAnimate) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 300);
            return () => clearTimeout(timer);
        }
    }, [shouldAnimate]);

    const animationClasses = [
        isSelected && shakeAnimation ? 'animate-shake' : '',
        isSelected && jumpAnimation ? 'animate-jump' : '',
    ].filter(Boolean).join(' ');

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
                        ${animationClasses}
                        `}
            onClick={onClick}
            style={{
                animationDelay: jumpAnimation ? `${jumpDelay}ms` : '0ms',
                animation: isSelected && shakeAnimation ? 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both' : 'none'
            }}
        >
            <span className={`${animate ? 'fade-in' : ''} ${isSelected ? 'text-white' : ''}`}>
                {word}
            </span>
        </div>
    );
}