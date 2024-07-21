import React from "react";
import Button from "./Button";
import { MAX_MISTAKES } from "../lib/constants";
import ToggleSwitch from "./ToggleSwitch";

type GameControlsProps = {
    selectedCellsCount: number;
    onDeselectAll: () => void;
    onShuffle: () => void;
    onSubmit: () => void;
    submitEnabled: boolean;
    lives: number;
    isEasyMode: boolean;
    onModeToggle: () => void;
};

export default function GameControls({ selectedCellsCount, onDeselectAll, onShuffle, onSubmit, submitEnabled, lives, isEasyMode, onModeToggle }: GameControlsProps) {
    const shuffleEnabled = true;
    const deselectAllEnabled = selectedCellsCount > 0;
    const circles = Array.from({ length: lives }, (_, index) => (
        <span
            key={index}
            className={`inline-block w-4 h-4 rounded-full ${index < lives ? 'bg-gray-500' : 'bg-gray-300'}`}
        ></span>
    ));

    return (
        <div className="space-y-4">
            <div className="space-x-2 flex justify-center items-center">
                <p>Mistakes Remaining:</p>
                <div className="flex space-x-1" style={{ width: `${MAX_MISTAKES * 1.25}rem` }}>
                    {circles}
                </div>
                <ToggleSwitch
                    isEasyMode={isEasyMode}
                    handleToggle={onModeToggle}
                />
            </div>
            <div className="space-x-4 flex justify-center">
                <Button text="Shuffle" enabled={shuffleEnabled} onClick={onShuffle} />
                <Button text="Clear" enabled={deselectAllEnabled} onClick={onDeselectAll} />
                <Button text="Submit" enabled={submitEnabled} invertColors={submitEnabled} onClick={onSubmit} />
            </div>
        </div>
    );
}
