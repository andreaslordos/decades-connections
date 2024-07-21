import React from "react";

type ModalProps = {
    text: string;
    fadeOutModal: boolean;
};

export default function Modal({ text, fadeOutModal }: ModalProps) {
    return (
        <div className={`fixed left-0 right-0 z-50 flex justify-center ${fadeOutModal ? 'fade-out' : 'fade-in'}
                                 top-4 md:top-[10%] pt-safe`}>
                    <div className="bg-black text-white px-4 py-2 rounded-md shadow-lg">
                        {text}
                    </div>
                </div>
    );
}