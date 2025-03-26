import GameClient from './GameClient';

export default function GamePage({ params }: { params: { gameId: string } }) {
  return <GameClient params={params} />;
}

export function generateStaticParams() {
  return [
    { gameId: 'math-warrior' },
    { gameId: 'math-runner' },
    { gameId: 'math-market' }
  ];
} 