import React from "react";

type CellProps = {
    word: string;
    difficulty: number;
    isSelected: boolean;
    onClick: () => void;
    disableCursor: boolean;
};

export default function Cell({ word, isSelected, onClick, disableCursor }: CellProps) {
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
            style={{ color: isSelected ? 'white' : 'inherit' }}
        >
            {word}
        </div>
    );
}
