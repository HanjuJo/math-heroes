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
  'math-runner': {
    title: '수학왕 달리기',
    description: '달리면서 수학 문제를 풀어보세요!',
    longDescription: '달리기를 하면서 수학 문제를 풀어보세요. 정답을 맞추면 더 빨리 달릴 수 있고, 틀리면 속도가 줄어듭니다. 최고 기록에 도전해보세요!',
    icon: 'bi-lightning-charge-fill',
    color: '#FF6B6B',
    features: [
      {
        title: '실시간 점수',
        description: '문제를 풀 때마다 즉시 점수가 반영됩니다',
        icon: 'bi-star'
      },
      {
        title: '레벨 시스템',
        description: '학년별로 최적화된 난이도를 제공합니다',
        icon: 'bi-graph-up'
      },
      {
        title: '개인 기록',
        description: '자신의 최고 기록에 도전해보세요',
        icon: 'bi-trophy'
      }
    ]
  },
  'math-warrior': {
    title: '수학 용사',
    description: '몬스터를 물리치며 수학을 배워보세요!',
    longDescription: 'RPG 스타일의 수학 게임입니다. 다양한 몬스터와 전투를 하면서 수학 문제를 풀어보세요. 레벨업을 통해 더 강해지고, 더 어려운 문제에 도전할 수 있습니다!',
    icon: 'bi-shield-fill-check',
    color: '#4ECDC4',
    features: [
      {
        title: '캐릭터 성장',
        description: '문제를 풀수록 캐릭터가 강해집니다',
        icon: 'bi-person-arms-up'
      },
      {
        title: 'RPG 요소',
        description: '다양한 아이템과 스킬을 사용해보세요',
        icon: 'bi-magic'
      },
      {
        title: '보스 전투',
        description: '강력한 보스에 도전해보세요',
        icon: 'bi-shield-shaded'
      }
    ]
  },
  'math-market': {
    title: '수학시장',
    description: '시장에서 물건을 사고 팔며 수학을 배워보세요!',
    longDescription: '실생활 속 수학 문제를 해결해보세요. 시장에서 물건을 사고 팔면서 덧셈, 뺄셈, 곱셈, 나눗셈을 자연스럽게 배울 수 있습니다.',
    icon: 'bi-shop',
    color: '#FFD93D',
    features: [
      {
        title: '실생활 수학',
        description: '실제 상황과 비슷한 환경에서 학습합니다',
        icon: 'bi-calculator'
      },
      {
        title: '경제 개념',
        description: '기본적인 경제 개념도 함께 배워요',
        icon: 'bi-cash-coin'
      },
      {
        title: '상인 경험',
        description: '나만의 가게를 운영해보세요',
        icon: 'bi-shop-window'
      }
    ]
  }
};

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const gameId = params.gameId;
  const grade = parseInt(searchParams?.grade as string || '1');
  
  const game = games[gameId as keyof typeof games];
  
  if (!game) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 게임 헤더 - 더 심플하게 수정 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: game.color }}>
              <i className={`bi ${game.icon} text-2xl text-white`}></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{game.title}</h1>
              <p className="text-gray-600">{game.description}</p>
            </div>
            <div className="ml-auto">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-gray-600">{grade}학년</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* 게임 특징 - 카드 디자인 단순화 */}
          <div className="lg:col-span-1 space-y-4">
            {game.features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-lg border hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <i className={`bi ${feature.icon} text-xl`} style={{ color: game.color }}></i>
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 게임 컨텐츠 - 더 넓은 공간 확보 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border h-[600px] overflow-hidden">
              <GameLoader gameId={gameId} grade={grade} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return [
    { gameId: 'math-warrior' },
    { gameId: 'math-runner' },
    { gameId: 'math-market' },
    { gameId: 'math-puzzle' }
  ]
} 