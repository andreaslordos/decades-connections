import React from 'react';

type ToggleSwitchProps = {
    isEasyMode: boolean;
    handleToggle: () => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isEasyMode, handleToggle }) => {
    return (
        <div className="flex items-center">
            <button
                className={`relative inline-flex items-center justify-center w-20 h-8 rounded-full transition-colors duration-200 focus:outline-none ${
                    isEasyMode ? 'bg-green-500' : 'bg-red-500'
                }`}
                onClick={handleToggle}
            >
                <span 
                    className={`absolute text-xs font-medium text-white transition-all duration-200 ${
                        isEasyMode ? 'left-2' : 'right-2'
                    }`}
                >
                    {isEasyMode ? 'Easy' : 'Hard'}
                </span>
                <span
                    className={`absolute inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 transform ${
                        isEasyMode ? 'translate-x-0 right-1' : 'translate-x-0 left-1'
                    }`}
                />
            </button>
        </div>
    );
};

export default ToggleSwitch;