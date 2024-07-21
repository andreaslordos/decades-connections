import React from 'react';

const difficultyColors = {
  1: 'bg-[#f9df6d]',
  2: 'bg-[#a0c35a]',
  3: 'bg-[#b0c4ef]',
  4: 'bg-[#ba81c5]',
};

type CompletedCategoryProps = {
  name: string;
  difficulty: number;
  headlines: string[];
};

export default function CompletedCategory({ name, difficulty, headlines }: CompletedCategoryProps) {
  return (
    <div className={`w-full 
                     p-2 
                     text-center 
                     ${difficultyColors[difficulty as keyof typeof difficultyColors]}
                     items-center 
                     font-classic
                     justify-center 
                     rounded
                    `}>
      <div className="font-bold mb-1">{name}</div>
      <div className="text-sm uppercase whitespace-pre-line">{headlines.join('\n')}</div>
    </div>
  );
}