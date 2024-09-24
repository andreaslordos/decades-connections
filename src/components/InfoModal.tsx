import React from 'react';
import Button from './Button';
import { MAX_MISTAKES } from '../lib/constants';

type InfoModalProps = {
    onClose: () => void;
};

export default function InfoModal({ onClose }: InfoModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 space-y-2">
                    <p><strong>Goal:</strong> Find groups of four headlines that were published in the same decade. All headlines are sourced from the New York Times archives.</p><br />
                    <p><strong>How to play:</strong> Select four headlines and click 'Submit' to guess a category. You can make up to {MAX_MISTAKES} mistakes.</p><br />
                    <p><strong>Author:</strong> Andreas Lordos. Check out{' '} <a href="https://lordos.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">my website</a>. This game is heaviliy inspired by{' '} <a href="https://www.nytimes.com/games/connections" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NYT Connections</a></p><br/>
                    <p><a href="https://github.com/andreaslordos/decades-connections" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub repo</a></p>
                    <p><a href="https://buymeacoffee.com/lordos" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Buy me a coffee :)</a></p>
                    <p>Built with &hearts; for my friends.</p>
                </div>
                <Button
                    onClick={onClose}
                    text="Close"
                    invertColors={true}
                    enabled={true}
                />
            </div>
        </div>
    );
}
