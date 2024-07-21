import React from "react";

type ButtonProps = {
    text: string;
    onClick: () => void;
    enabled?: boolean;
    invertColors?: boolean;
};

export default function Button({ text, onClick, enabled = true, invertColors = false }: ButtonProps) {
    return (
        <button 
            className={`px-4 py-2 rounded-full border transition-colors duration-150
                        ${enabled ? 'border-black hover:cursor-pointer' : 'border-gray-400 text-gray-400'}
                        ${invertColors ? 'bg-black text-white' : 'bg-white'}
                        ${enabled && !invertColors ? 'hover:bg-gray-200' : ''}`}
            onClick={enabled ? onClick : undefined}
            disabled={!enabled}
        >
            {text}
        </button>
    );
}
