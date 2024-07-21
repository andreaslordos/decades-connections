import React from 'react';

const difficultyColors = {
  1: 'bg-yellow-200',
  2: 'bg-green-200',
  3: 'bg-blue-200',
  4: 'bg-purple-200',
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
      <div className="text-sm uppercase">{headlines.join(', ')}</div>
    </div>
  );
}