import React from "react";
import Button from "./Button";

type ButtonRowProps = {
    submitEnabled: boolean;
    shuffleEnabled?: boolean;
    deselectAllEnabled?: boolean;
};

export default function ButtonRow({ submitEnabled, shuffleEnabled, deselectAllEnabled }: ButtonRowProps) {
    return (
        <div className="space-x-4">
            <Button text="Shuffle" enabled={shuffleEnabled} onClick={() => {}}/>
            <Button text="Deselect All" enabled={deselectAllEnabled} onClick={() => {}}/>
            <Button text="Submit" enabled={submitEnabled} invertColors={submitEnabled} onClick={() => {}}/>            
        </div>
    );
}
