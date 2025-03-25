import { notFound } from 'next/navigation';
import Link from 'next/link';

interface GradePageProps {
  params: {
    grade: string;
  };
}

const units = [
  {
    title: '수와 연산',
    icon: 'bi-123',
    color: '#E74C3C',
    description: '기본적인 수학 연산을 배우고 문제를 해결하는 능력을 키워보세요',
    topics: [
      { 
        title: '덧셈과 뺄셈', 
        gameId: 'math-runner',
        description: '기본적인 덧셈과 뺄셈 연산을 학습합니다',
        icon: 'bi-plus-slash-minus'
      },
      { 
        title: '곱셈과 나눗셈', 
        gameId: 'math-warrior',
        description: '곱셈과 나눗셈의 개념을 이해하고 연습합니다',
        icon: 'bi-asterisk'
      },
      { 
        title: '분수와 소수', 
        gameId: 'math-market',
        description: '분수와 소수의 개념을 배우고 계산해봅니다',
        icon: 'bi-pie-chart'
      }
    ]
  },
  {
    title: '도형',
    icon: 'bi-pentagon',
    color: '#9B59B6',
    description: '다양한 도형의 특징을 이해하고 공간 감각을 키워보세요',
    topics: [
      { 
        title: '평면도형', 
        gameId: 'math-runner',
        description: '다양한 평면도형의 특징을 학습합니다',
        icon: 'bi-triangle'
      },
      { 
        title: '입체도형', 
        gameId: 'math-warrior',
        description: '입체도형의 구조와 특징을 이해합니다',
        icon: 'bi-box'
      },
      { 
        title: '각도와 길이', 
        gameId: 'math-market',
        description: '각도와 길이를 측정하고 계산합니다',
        icon: 'bi-rulers'
      }
    ]
  },
  {
    title: '측정',
    icon: 'bi-rulers',
    color: '#3498DB',
    description: '실생활에서 사용되는 다양한 측정 단위를 배워보세요',
    topics: [
      { 
        title: '시간', 
        gameId: 'math-runner',
        description: '시간을 읽고 계산하는 방법을 배웁니다',
        icon: 'bi-clock'
      },
      { 
        title: '길이와 무게', 
        gameId: 'math-warrior',
        description: '길이와 무게를 측정하고 단위를 변환합니다',
        icon: 'bi-rulers'
      },
      { 
        title: '들이와 넓이', 
        gameId: 'math-market',
        description: '부피와 넓이를 계산하는 방법을 학습합니다',
        icon: 'bi-square'
      }
    ]
  }
];

export default async function GradePage({ params }: GradePageProps) {
  const grade = parseInt(params.grade as string);
  
  if (isNaN(grade) || grade < 1 || grade > 6) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/math-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-5xl font-bold">{grade}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{grade}학년 학습하기</h1>
                <p className="text-xl text-blue-100">
                  {grade}학년 교과 과정에 맞춘 다양한 수학 게임을 즐겨보세요
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/recommendations?grade=${grade}&category=textbook`}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
              >
                <i className="bi bi-book text-xl"></i>
                <span>교과서 학습</span>
              </Link>
              <Link
                href={`/recommendations?grade=${grade}&category=digital`}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
              >
                <i className="bi bi-laptop text-xl"></i>
                <span>디지털 학습</span>
              </Link>
              <Link
                href={`/recommendations?grade=${grade}&category=tools`}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
              >
                <i className="bi bi-tools text-xl"></i>
                <span>학습 도구</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 단원 목록 */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {units.map((unit, unitIndex) => (
            <div 
              key={unitIndex}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
            >
              {/* 단원 헤더 */}
              <div 
                className="p-6"
                style={{ 
                  background: `linear-gradient(135deg, ${unit.color}22 0%, ${unit.color}11 100%)`
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: unit.color }}
                  >
                    <i className={`bi ${unit.icon} text-2xl text-white`}></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{unit.title}</h2>
                    <p className="text-sm text-gray-600">{unit.description}</p>
                  </div>
                </div>
              </div>

              {/* 주제 목록 */}
              <div className="divide-y divide-gray-100">
                {unit.topics.map((topic, topicIndex) => (
                  <Link
                    key={topicIndex}
                    href={`/games/${topic.gameId}?grade=${grade}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${unit.color}22` }}
                    >
                      <i className={`bi ${topic.icon} text-lg`} style={{ color: unit.color }}></i>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{topic.title}</h3>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </div>
                    <i className="bi bi-chevron-right text-gray-400 ml-auto"></i>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return [
    { grade: '1' },
    { grade: '2' },
    { grade: '3' },
    { grade: '4' },
    { grade: '5' },
    { grade: '6' }
  ]
} 