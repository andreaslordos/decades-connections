import React, { useState } from "react";
import { GAME_TITLE } from "../lib/constants";
import { Info } from "lucide-react";
import InfoModal from "./InfoModal";

export default function Header() {
    const [showInfoModal, setShowInfoModal] = useState(false);

    const handleInfoClick = () => {
        setShowInfoModal(true);
    };

    const handleCloseInfoModal = () => {
        setShowInfoModal(false);
    };

    return (
        <>
            <div className="border-b py-1 border-gray-700 flex justify-between items-center px-4">
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-h1 font-classic">{GAME_TITLE}</div>
                </div>
                <button onClick={handleInfoClick} className="focus:outline-none">
                    <Info size={24} />
                </button>
            </div>
            {showInfoModal && <InfoModal onClose={handleCloseInfoModal} />}
        </>
    );
}
