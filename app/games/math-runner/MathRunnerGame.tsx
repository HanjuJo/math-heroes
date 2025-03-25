'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MathRunnerGameProps {
  grade: number;
}

interface Question {
  question: string;
  answer: number;
  options: number[];
}

const generateQuestion = (grade: number): Question => {
  let num1: number, num2: number, answer: number;
  
  switch(grade) {
    case 1:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 + num2;
      return {
        question: `${num1} + ${num2} = ?`,
        answer,
        options: shuffleArray([
          answer,
          answer + 1,
          answer - 1,
          answer + 2
        ])
      };
    case 2:
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      answer = num1 + num2;
      return {
        question: `${num1} + ${num2} = ?`,
        answer,
        options: shuffleArray([
          answer,
          answer + 2,
          answer - 2,
          answer + 3
        ])
      };
    default:
      return generateQuestion(1);
  }
};

const shuffleArray = (array: number[]): number[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function MathRunnerGame({ grade }: MathRunnerGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setPosition(0);
    setTimeLeft(60);
    setQuestion(generateQuestion(grade));
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!question) return;

    if (selectedAnswer === question.answer) {
      setScore((prev) => prev + 10);
      setPosition((prev) => prev + 1);
    } else {
      setPosition((prev) => Math.max(0, prev - 1));
    }

    setQuestion(generateQuestion(grade));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!isPlaying ? (
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
          {/* 게임 상태 */}
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
            <div className="text-lg">점수: {score}</div>
            <div className="text-lg">남은 시간: {timeLeft}초</div>
          </div>

          {/* 달리기 트랙 */}
          <div className="relative h-20 bg-gray-200 rounded-lg overflow-hidden">
            <motion.div
              className="absolute bottom-0 w-16 h-16"
              animate={{ x: `${(position * 100) / 10}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                🏃
              </div>
            </motion.div>
          </div>

          {/* 문제 영역 */}
          <AnimatePresence mode="wait">
            {question && (
              <motion.div
                key={question.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-center">{question.question}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 rounded-lg text-xl font-bold transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
} 