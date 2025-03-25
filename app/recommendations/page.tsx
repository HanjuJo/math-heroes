import { notFound } from 'next/navigation';
import Link from 'next/link';

interface RecommendationsPageProps {
  searchParams: {
    grade?: string;
    category?: string;
  };
}

const recommendations = {
  textbook: {
    title: '교과서',
    icon: 'bi-book',
    color: '#FF6B6B',
    description: '교과서 기반의 체계적인 학습을 통해 기초를 다져보세요',
    items: [
      {
        title: '기본 연산',
        description: '덧셈, 뺄셈, 곱셈, 나눗셈의 기초를 배워보세요.',
        longDescription: '수학의 기본이 되는 사칙연산을 단계별로 학습합니다. 다양한 문제를 통해 연산 능력을 향상시킬 수 있습니다.',
        url: '/games/math-runner',
        icon: 'bi-plus-slash-minus',
        features: ['단계별 학습', '반복 연습', '실시간 피드백']
      },
      {
        title: '도형과 공간',
        description: '다양한 도형을 배우고 공간 감각을 키워보세요.',
        longDescription: '평면도형과 입체도형의 특징을 이해하고, 도형의 성질을 활용하여 문제를 해결하는 능력을 기릅니다.',
        url: '/games/math-warrior',
        icon: 'bi-pentagon',
        features: ['도형 탐구', '공간 지각력', '문제 해결력']
      },
      {
        title: '분수와 소수',
        description: '분수와 소수의 개념을 이해하고 계산해보세요.',
        longDescription: '분수와 소수의 기본 개념부터 사칙연산까지, 실생활에서 활용할 수 있는 다양한 예제로 학습합니다.',
        url: '/games/math-market',
        icon: 'bi-pie-chart',
        features: ['개념 이해', '계산 연습', '실생활 적용']
      }
    ]
  },
  digital: {
    title: '디지털 학습',
    icon: 'bi-laptop',
    color: '#4ECDC4',
    description: '최신 디지털 기술을 활용한 재미있는 학습을 경험해보세요',
    items: [
      {
        title: '온라인 수학 게임',
        description: '재미있는 게임으로 수학을 배워보세요.',
        longDescription: '게임을 통해 자연스럽게 수학 개념을 익히고, 문제 해결 능력을 향상시킬 수 있습니다.',
        url: '/games/math-runner',
        icon: 'bi-controller',
        features: ['게임형 학습', '레벨 시스템', '성취감']
      },
      {
        title: '수학 퀴즈',
        description: '다양한 퀴즈로 실력을 테스트해보세요.',
        longDescription: '단계별 퀴즈를 통해 자신의 실력을 확인하고, 부족한 부분을 보완할 수 있습니다.',
        url: '/games/math-warrior',
        icon: 'bi-question-circle',
        features: ['맞춤형 문제', '실시간 채점', '오답 노트']
      },
      {
        title: '수학 동영상',
        description: '쉽게 설명하는 수학 동영상을 시청해보세요.',
        longDescription: '전문 선생님이 쉽게 설명하는 동영상으로, 어려운 수학 개념도 쉽게 이해할 수 있습니다.',
        url: '/games/math-market',
        icon: 'bi-play-circle',
        features: ['전문가 강의', '반복 학습', '이해도 체크']
      }
    ]
  },
  tools: {
    title: '학습 도구',
    icon: 'bi-tools',
    color: '#FFD93D',
    description: '효과적인 학습을 위한 다양한 도구를 활용해보세요',
    items: [
      {
        title: '계산기',
        description: '기본 계산기부터 공학용 계산기까지 다양한 계산기를 사용해보세요.',
        longDescription: '목적에 맞는 다양한 계산기를 제공하여, 계산 능력을 향상시키고 수학적 사고력을 키울 수 있습니다.',
        url: '/games/math-runner',
        icon: 'bi-calculator',
        features: ['다양한 모드', '계산 기록', '단위 변환']
      },
      {
        title: '수학 노트',
        description: '온라인에서 수학 문제를 풀고 기록해보세요.',
        longDescription: '문제 풀이 과정을 체계적으로 기록하고, 자신만의 학습 노트를 만들어 복습할 수 있습니다.',
        url: '/games/math-warrior',
        icon: 'bi-journal-text',
        features: ['필기 도구', '문제 저장', '학습 기록']
      },
      {
        title: '수학 그래프',
        description: '다양한 그래프를 그리고 분석해보세요.',
        longDescription: '함수와 그래프를 시각적으로 표현하고 분석하여, 수학적 개념을 더 쉽게 이해할 수 있습니다.',
        url: '/games/math-market',
        icon: 'bi-graph-up',
        features: ['그래프 작성', '데이터 분석', '시각화']
      }
    ]
  }
};

export default function RecommendationsPage({ searchParams }: RecommendationsPageProps) {
  const grade = parseInt(searchParams.grade || '1');
  const category = (searchParams.category || 'textbook') as keyof typeof recommendations;
  
  if (!recommendations[category]) {
    notFound();
  }

  const currentCategory = recommendations[category];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: currentCategory.color }}>
              <i className={`bi ${currentCategory.icon} text-2xl text-white`}></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentCategory.title} 추천</h1>
              <p className="text-gray-600">{currentCategory.description}</p>
            </div>
            <div className="ml-auto">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-gray-600">{grade}학년</span>
              </div>
            </div>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex gap-2">
            {Object.entries(recommendations).map(([key, value]) => (
              <Link
                key={key}
                href={`/recommendations?grade=${grade}&category=${key}`}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${category === key 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <i className={`bi ${value.icon} mr-2`}></i>
                {value.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 추천 항목 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCategory.items.map((item, index) => (
            <Link
              key={index}
              href={`${item.url}?grade=${grade}`}
              className="bg-white p-6 rounded-lg border hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${currentCategory.color}15` }}
                >
                  <i className={`bi ${item.icon} text-xl`} style={{ color: currentCategory.color }}></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {item.features.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <i className="bi bi-check2 mr-2" style={{ color: currentCategory.color }}></i>
                    {feature}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 