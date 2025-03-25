'use client';

import dynamic from 'next/dynamic';

interface GameComponentProps {
  title: string;
  grade: number;
  gameId: string;
}

const MathRunnerGame = dynamic(() => import('../math-runner/MathRunnerGame'), {
  loading: () => <div>로딩중...</div>,
});

const MathWarriorGame = dynamic(() => import('../math-warrior/MathWarriorGame'), {
  loading: () => <div>로딩중...</div>,
});

const MathMarketGame = dynamic(() => import('../math-market/MathMarketGame'), {
  loading: () => <div>로딩중...</div>,
});

const MathPuzzleGame = dynamic(() => import('../math-puzzle/MathPuzzleGame'), {
  loading: () => <div>로딩중...</div>,
});

export default function GameComponent({ title, grade, gameId }: GameComponentProps) {
  const renderGame = () => {
    switch (gameId) {
      case 'math-runner':
        return <MathRunnerGame grade={grade} />;
      case 'math-warrior':
        return <MathWarriorGame grade={grade} />;
      case 'math-market':
        return <MathMarketGame grade={grade} />;
      case 'math-puzzle':
        return <MathPuzzleGame grade={grade} />;
      default:
        return <div>게임을 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 min-h-[400px]">
      {renderGame()}
    </div>
  );
} 