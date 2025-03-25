'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

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

const grades = [1, 2, 3, 4, 5, 6];

export default function Home() {
  const [hoveredGrade, setHoveredGrade] = useState<number | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FF6B6B] to-[#4ECDC4] text-white min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-[url('/images/math-pattern.png')] opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/images/bubble-pattern.png')] opacity-10 animate-float"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="animate-bounce-slow mb-6">
              <img src="/images/hero-character.png" alt="Math Hero" className="w-32 h-32" />
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight animate-fade-in">
              즐겁게 배우는<br />
              <span className="text-yellow-300 drop-shadow-lg">수학의 세계</span>
            </h1>
            <p className="text-xl text-blue-100 mb-12 animate-fade-in-delay">
              게임으로 배우는 즐거운 수학! 다양한 게임을 통해<br />
              수학 실력을 키우고 새로운 도전을 경험해보세요.
            </p>
            <div className="flex gap-6 animate-fade-in-delay-2">
              <Link 
                href="/recommendations" 
                className="bg-white text-[#FF6B6B] px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 hover:shadow-lg"
              >
                <i className="bi bi-book-half mr-2"></i>
                학습 추천
              </Link>
              <Link 
                href="#games" 
                className="bg-[#4ECDC4] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#45B8B0] transition-all transform hover:scale-105 hover:shadow-lg"
              >
                <i className="bi bi-controller mr-2"></i>
                게임 시작하기
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[100px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  fill="currentColor" 
                  className="text-purple-50">
            </path>
          </svg>
        </div>
      </section>

      {/* 학년 선택 섹션 */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/confetti-pattern.png')] opacity-5"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#FF6B6B]">학년 선택</h2>
          <p className="text-gray-600 text-center mb-16">나에게 맞는 학년을 선택하고 학습을 시작해보세요</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {grades.map((grade) => (
              <Link
                key={grade}
                href={`/grade/${grade}`}
                className="group relative"
                onMouseEnter={() => setHoveredGrade(grade)}
                onMouseLeave={() => setHoveredGrade(null)}
              >
                <div className={`
                  relative z-10 bg-gradient-to-br rounded-2xl p-8 text-center
                  transition-all duration-300 transform
                  ${hoveredGrade === grade 
                    ? 'from-[#FF6B6B] to-[#FF8787] scale-105 shadow-xl' 
                    : 'from-[#4ECDC4] to-[#45B8B0] shadow-lg'
                  }
                `}>
                  <div className="text-5xl font-bold text-white mb-3">{grade}</div>
                  <div className="text-white/90">학년</div>
                  <div className={`
                    absolute inset-0 bg-white rounded-2xl transition-opacity
                    ${hoveredGrade === grade ? 'opacity-10' : 'opacity-0'}
                  `}></div>
                </div>
                {hoveredGrade === grade && (
                  <div className="absolute -bottom-2 left-0 right-0 text-center text-sm text-[#FF6B6B] font-medium">
                    <i className="bi bi-arrow-up-circle-fill animate-bounce"></i>
                    <span className="ml-1">선택하기</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 게임 목록 섹션 */}
      <section id="games" className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#4ECDC4]">수학 게임</h2>
          <p className="text-gray-600 text-center mb-16">재미있는 게임으로 수학 실력을 키워보세요</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group"
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                <div className={`
                  bg-white rounded-3xl shadow-lg overflow-hidden
                  transition-all duration-300 transform
                  ${hoveredGame === game.id ? 'scale-105 shadow-xl' : ''}
                `}>
                  <div 
                    className="p-8"
                    style={{ 
                      background: `linear-gradient(135deg, ${game.color}22 0%, ${game.color}11 100%)`
                    }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className={`
                          w-20 h-20 rounded-2xl flex items-center justify-center
                          transition-all duration-300
                          ${hoveredGame === game.id ? 'scale-110 rotate-6' : ''}
                        `}
                        style={{ backgroundColor: game.color }}
                      >
                        <i className={`bi ${game.icon} text-3xl text-white`}></i>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{game.title}</h3>
                        <p className="text-gray-600">{game.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {game.features.map((feature, index) => (
                        <div 
                          key={index}
                          className={`
                            flex items-center text-sm text-gray-600
                            transition-all duration-300 delay-${index * 100}
                            ${hoveredGame === game.id ? 'translate-x-2' : ''}
                          `}
                        >
                          <i className="bi bi-check2-circle mr-2" style={{ color: game.color }}></i>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <span 
                        className={`
                          inline-flex items-center text-sm font-semibold
                          transition-all duration-300
                          ${hoveredGame === game.id ? 'translate-x-2' : ''}
                        `}
                        style={{ color: game.color }}
                      >
                        게임 시작하기
                        <i className="bi bi-arrow-right ml-2"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#4ECDC4]">특별한 학습 경험</h2>
          <p className="text-gray-600 text-center mb-16">게임으로 배우는 새로운 방식의 수학 학습</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <i className="bi bi-stars text-3xl text-[#FFD93D]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">재미있는 게임</h3>
              <p className="text-gray-600">게임하면서 자연스럽게 수학을 배워요</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <i className="bi bi-graph-up text-3xl text-[#FF6B6B]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">실력 향상</h3>
              <p className="text-gray-600">단계별로 실력이 쑥쑥 자라나요</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <i className="bi bi-trophy text-3xl text-[#4ECDC4]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">보상 시스템</h3>
              <p className="text-gray-600">열심히 하면 특별한 선물이 기다려요</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <i className="bi bi-people text-3xl text-[#6C5CE7]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">함께 성장</h3>
              <p className="text-gray-600">친구들과 함께 배우며 성장해요</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
