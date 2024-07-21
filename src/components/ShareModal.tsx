import React, { useState, useRef, useEffect } from 'react';
import { Guess } from '../types/game';
import { SHARE_URL } from '../lib/constants';
import Modal from './Modal';
import Button from './Button';

type ShareModalProps = {
    guesses: Guess[];
    daysSinceStart: number;
    onClose: () => void;
};

const categoryEmojis: { [key: number]: string } = {
    1: '🟨',
    2: '🟩',
    3: '🟦',
    4: '🟪'
};

export default function ShareModal({ guesses, daysSinceStart, onClose }: ShareModalProps) {
    const [showCopiedModal, setShowCopiedModal] = useState(false);
    const [fadeOutModal, setFadeOutModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const shareText = `Decades #${daysSinceStart}\n\n${guesses
        .map(guess => guess.categories.map(cat => categoryEmojis[cat]).join(''))
        .join('\n')}\n\n${SHARE_URL}`;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                text: shareText,
            }).then(() => {
                console.log('Shared successfully');
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                setShowCopiedModal(true);
                setFadeOutModal(false);
                setTimeout(() => {
                    setFadeOutModal(true);
                    setTimeout(() => setShowCopiedModal(false), 300);
                }, 2000);
            }).catch((error) => {
                console.error('Error copying to clipboard:', error);
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 min-h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Decades #{daysSinceStart}</h2>
                <div className="mb-4">
                    {guesses.map((guess, index) => (
                        <div key={index} className="mb-2">
                            {guess.categories.map((cat, catIndex) => (
                                <span key={catIndex}>{categoryEmojis[cat]}</span>
                            ))}
                        </div>
                    ))}
                </div>
                <Button
                    onClick={handleShare}
                    text={'Share'}
                    invertColors={true}
                    enabled={true}
                />
            </div>
            {showCopiedModal && (
                <Modal text="Results copied to clipboard!" fadeOutModal={fadeOutModal} />
            )}
        </div>
    );
}