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
        animate ? 'fade-in' : '',
    ].filter(Boolean).join(' ');

    return (
        <div 
            className={`flex 
                        items-center 
                        font-classic
                        justify-center 
                        p-2 sm:p-4 
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
            }}
        >
            <span className={`md:text-base ${isSelected ? 'text-white' : ''}`}>
                <p className="text-mobile sm:text-h6">{word}</p>
            </span>
        </div>
    );
}