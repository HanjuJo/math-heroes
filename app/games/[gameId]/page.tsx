import { notFound } from 'next/navigation';
import GameLoader from '@/app/components/GameLoader';

interface GamePageProps {
  params: {
    gameId: string;
  };
  searchParams: {
    grade?: string;
  };
}

const games = {
  'math-runner': '수학달리기',
  'quick-math': '빠른수학',
  'math-warrior': '수학전사',
  'math-market': '수학시장'
};

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const gameId = await Promise.resolve(params.gameId);
  const grade = parseInt(await Promise.resolve(searchParams?.grade || '1'));
  
  const game = games[gameId as keyof typeof games];
  
  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GameLoader gameId={gameId} grade={grade} />
    </div>
  );
}

export function generateStaticParams() {
  return [
    { gameId: 'math-warrior' },
    { gameId: 'math-runner' },
    { gameId: 'math-market' },
    { gameId: 'math-puzzle' }
  ];
} 