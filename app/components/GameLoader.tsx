'use client';

import dynamic from 'next/dynamic';

const MathRunner = dynamic(() => import('@/app/components/games/math-runner/MathRunner'), {
  ssr: false
});
const MathWarrior = dynamic(() => import('@/app/components/games/math-warrior/MathWarrior'), {
  ssr: false
});
const MathMarket = dynamic(() => import('@/app/components/games/math-market/MathMarket'), {
  ssr: false
});

const games = {
  'math-runner': MathRunner,
  'math-warrior': MathWarrior,
  'math-market': MathMarket
};

interface GameLoaderProps {
  gameId: string;
  grade: number;
}

export default function GameLoader({ gameId, grade }: GameLoaderProps) {
  const GameComponent = games[gameId as keyof typeof games];
  
  if (!GameComponent) {
    return null;
  }

  return <GameComponent grade={grade} />;
} 