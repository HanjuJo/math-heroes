'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MathMarketGameProps {
  grade: number;
}

interface Item {
  name: string;
  price: number;
  image: string;
}

interface Problem {
  items: Item[];
  question: string;
  answer: number;
  options: number[];
}

const items: Item[] = [
  { name: '연필', price: 500, image: '✏️' },
  { name: '지우개', price: 300, image: '🧊' },
  { name: '노트', price: 1000, image: '📓' },
  { name: '색연필', price: 2000, image: '🖍️' },
  { name: '자', price: 700, image: '📏' },
  { name: '가위', price: 1500, image: '✂️' },
];

const generateProblem = (grade: number): Problem => {
  const selectedItems = items.sort(() => 0.5 - Math.random()).slice(0, grade === 1 ? 2 : 3);
  let question: string;
  let answer: number;

  if (grade === 1) {
    // 1학년: 단순 합계 계산
    answer = selectedItems.reduce((sum, item) => sum + item.price, 0);
    question = `${selectedItems.map(item => item.name).join('와 ')}의 총 가격은 얼마인가요?`;
  } else {
    // 2학년: 거스름돈 계산
    const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const payment = Math.ceil(total / 1000) * 1000;
    answer = payment - total;
    question = `${selectedItems.map(item => item.name).join('와 ')}를 사고 ${payment}원을 냈을 때, 거스름돈은 얼마인가요?`;
  }

  const options = generateOptions(answer, grade);
  return { items: selectedItems, question, answer, options };
};

const generateOptions = (answer: number, grade: number): number[] => {
  const options = [answer];
  const range = grade === 1 ? 500 : 1000;
  
  while (options.length < 4) {
    const option = answer + (Math.random() < 0.5 ? 1 : -1) * Math.floor(Math.random() * range);
    if (!options.includes(option) && option >= 0) {
      options.push(option);
    }
  }
  
  return shuffleArray(options);
};

const shuffleArray = (array: number[]): number[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function MathMarketGame({ grade }: MathMarketGameProps) {
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'end'>('ready');
  const [message, setMessage] = useState('');
  const [remainingProblems, setRemainingProblems] = useState(10);

  const startGame = () => {
    setGameStatus('playing');
    setScore(0);
    setRemainingProblems(10);
    setProblem(generateProblem(grade));
    setMessage('게임 시작!');
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!problem) return;

    if (selectedAnswer === problem.answer) {
      setScore(score + 10);
      setMessage('정답입니다! 🎉');
    } else {
      setMessage(`틀렸습니다. 정답은 ${problem.answer}원입니다.`);
    }

    const newRemainingProblems = remainingProblems - 1;
    setRemainingProblems(newRemainingProblems);

    if (newRemainingProblems > 0) {
      setTimeout(() => {
        setProblem(generateProblem(grade));
        setMessage('');
      }, 1500);
    } else {
      setGameStatus('end');
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {gameStatus === 'ready' ? (
        <div className="text-center">
          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-colors"
          >
            게임 시작하기
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 상태 표시 */}
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
            <div className="text-lg">점수: {score}</div>
            <div className="text-lg">남은 문제: {remainingProblems}</div>
          </div>

          {/* 메시지 */}
          {message && (
            <div className="bg-gray-100 p-4 rounded-lg text-center text-lg font-bold">
              {message}
            </div>
          )}

          {/* 문제 영역 */}
          {problem && gameStatus === 'playing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              {/* 상품 목록 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {problem.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg text-center"
                  >
                    <div className="text-4xl mb-2">{item.image}</div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-blue-600">{formatPrice(item.price)}원</div>
                  </div>
                ))}
              </div>

              {/* 문제 */}
              <h3 className="text-xl font-bold mb-4 text-center">
                {problem.question}
              </h3>

              {/* 답변 옵션 */}
              <div className="grid grid-cols-2 gap-4">
                {problem.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 rounded-lg text-xl font-bold transition-colors"
                  >
                    {formatPrice(option)}원
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 게임 종료 */}
          {gameStatus === 'end' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">게임 종료!</h2>
              <p className="text-xl mb-6">최종 점수: {score}점</p>
              <button
                onClick={startGame}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-colors"
              >
                다시 시작하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 