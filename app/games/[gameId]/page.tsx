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

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const { gameId } = params;
  const grade = parseInt(searchParams?.grade || '1');

  if (!gameId) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
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