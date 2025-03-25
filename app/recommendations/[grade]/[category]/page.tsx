import { notFound } from 'next/navigation';
import Link from 'next/link';

interface RecommendationsPageProps {
  params: {
    grade: string;
    category: string;
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
        longDescription: '수학의 기본이 되는 사칙연산을 단계별로 학습합니다.',
        url: '/games/math-runner',
        icon: 'bi-plus-slash-minus',
        features: ['단계별 학습', '반복 연습', '실시간 피드백']
      },
      // ... 나머지 items
    ]
  },
  digital: {
    title: '디지털 학습',
    icon: 'bi-laptop',
    color: '#4ECDC4',
    description: '최신 디지털 기술을 활용한 재미있는 학습을 경험해보세요',
    items: [
      // ... items
    ]
  },
  tools: {
    title: '학습 도구',
    icon: 'bi-tools',
    color: '#FFD93D',
    description: '효과적인 학습을 위한 다양한 도구를 활용해보세요',
    items: [
      // ... items
    ]
  }
};

export default function RecommendationsPage({ params }: RecommendationsPageProps) {
  const grade = parseInt(params.grade);
  const category = params.category as keyof typeof recommendations;
  
  if (!recommendations[category] || isNaN(grade) || grade < 1 || grade > 6) {
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
                href={`/recommendations/${grade}/${key}`}
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

export function generateStaticParams() {
  const grades = ['1', '2', '3', '4', '5', '6'];
  const categories = ['textbook', 'digital', 'tools'];
  
  return grades.flatMap(grade => 
    categories.map(category => ({
      grade,
      category
    }))
  );
} 