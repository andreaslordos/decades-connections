import React from "react";
import Button from "./Button";

type GameControlsProps = {
    selectedCellsCount: number;
    onDeselectAll: () => void;
    onShuffle: () => void;
    onSubmit: () => void;
    lives: number;
};

export default function GameControls({ selectedCellsCount, onDeselectAll, onShuffle, onSubmit, lives }: GameControlsProps) {
    const submitEnabled = selectedCellsCount >= 4;
    const shuffleEnabled = true;
    const deselectAllEnabled = selectedCellsCount > 0;
    const circles = Array.from({ length: lives }, (_, index) => (
        <span key={index} className="inline-block w-4 h-4 bg-gray-500 rounded-full"></span>
    ));


    return (
        <div className="space-y-4">
            <div className="space-x-2 flex justify-center">
                <p>Mistakes Remaining:</p>
                <div className="space-x-1">
                    {circles}
                </div>
            </div>
            <div className="space-x-4">
                <Button text="Shuffle" enabled={shuffleEnabled} onClick={onShuffle}/>
                <Button text="Deselect All" enabled={deselectAllEnabled} onClick={onDeselectAll}/>
                <Button text="Submit" enabled={submitEnabled} invertColors={submitEnabled} onClick={onSubmit}/>            
            </div>
        </div>
    );
}