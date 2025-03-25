'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './page.module.css';

const games = [
  {
    id: 'math-runner',
    title: '수학왕 달리기',
    description: '달리면서 수학 문제를 풀어보세요!',
    icon: 'bi-lightning-charge-fill',
    color: '#FF6B6B',
    features: ['실시간 점수 확인', '레벨별 난이도', '개인 기록 갱신']
  },
  {
    id: 'math-warrior',
    title: '수학 용사',
    description: '몬스터를 물리치며 수학을 배워보세요!',
    icon: 'bi-shield-fill-check',
    color: '#4ECDC4',
    features: ['캐릭터 성장', 'RPG 스타일', '보스 전투']
  },
  {
    id: 'math-market',
    title: '수학시장',
    description: '시장에서 물건을 사고 팔며 수학을 배워보세요!',
    icon: 'bi-shop',
    color: '#FFD93D',
    features: ['실생활 수학', '경제 개념 학습', '재미있는 거래']
  }
];

export default function Home() {
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [hoveredGrade, setHoveredGrade] = useState<number | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const grades = [1, 2, 3, 4, 5, 6];

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">수학 영웅들</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">학년 선택</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`p-4 text-xl rounded-lg transition-colors ${
                  selectedGrade === grade
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {grade}학년
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Link
              href={`/games/math-runner?grade=${selectedGrade}`}
              className="block p-6 bg-green-500 text-white rounded-lg text-center text-xl hover:bg-green-600 transition-colors"
            >
              수학달리기
            </Link>
            <Link
              href={`/games/quick-math?grade=${selectedGrade}`}
              className="block p-6 bg-purple-500 text-white rounded-lg text-center text-xl hover:bg-purple-600 transition-colors"
            >
              빠른수학
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <Link
            href="/shop"
            className="block p-6 bg-yellow-500 text-white rounded-lg text-center text-xl hover:bg-yellow-600 transition-colors"
          >
            상점
          </Link>
          <Link
            href="/hall-of-fame"
            className="block p-6 bg-red-500 text-white rounded-lg text-center text-xl hover:bg-red-600 transition-colors"
          >
            명예의 전당
          </Link>
          <Link
            href="/student-supplies"
            className="block p-6 bg-blue-500 text-white rounded-lg text-center text-xl hover:bg-blue-600 transition-colors"
          >
            학생용품
          </Link>
        </div>
      </div>
    </main>
  );
}
