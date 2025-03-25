'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MathPuzzleGameProps {
  grade: number;
}

interface PuzzlePiece {
  id: number;
  value: number;
  isSelected: boolean;
}

interface Puzzle {
  pieces: PuzzlePiece[];
  target: number;
  operations: string[];
  solution: string;
}

const generatePuzzle = (grade: number): Puzzle => {
  const operations = grade === 1 ? ['+'] : ['+', '-'];
  const maxNumber = grade === 1 ? 10 : 20;
  
  // 숫자 조각 생성
  const numbers: number[] = [];
  for (let i = 0; i < 6; i++) {
    numbers.push(Math.floor(Math.random() * maxNumber) + 1);
  }

  // 목표 숫자와 해답 생성
  let target: number;
  let solution: string;

  if (grade === 1) {
    const num1 = numbers[0];
    const num2 = numbers[1];
    target = num1 + num2;
    solution = `${num1} + ${num2} = ${target}`;
  } else {
    const num1 = numbers[0];
    const num2 = numbers[1];
    const operation = Math.random() < 0.5 ? '+' : '-';
    target = operation === '+' ? num1 + num2 : num1 - num2;
    solution = `${num1} ${operation} ${num2} = ${target}`;
  }

  const pieces: PuzzlePiece[] = numbers.map((value, index) => ({
    id: index,
    value,
    isSelected: false,
  }));

  return {
    pieces: shuffleArray(pieces),
    target,
    operations,
    solution,
  };
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function MathPuzzleGame({ grade }: MathPuzzleGameProps) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [selectedPieces, setSelectedPieces] = useState<PuzzlePiece[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'end'>('ready');

  const startGame = () => {
    setPuzzle(generatePuzzle(grade));
    setScore(0);
    setGameStatus('playing');
    setMessage('숫자를 선택하고 연산자를 사용해 목표 숫자를 만드세요!');
  };

  const handlePieceClick = (piece: PuzzlePiece) => {
    if (selectedPieces.length < 2 && !piece.isSelected) {
      setSelectedPieces([...selectedPieces, piece]);
      setPuzzle(prev => {
        if (!prev) return null;
        return {
          ...prev,
          pieces: prev.pieces.map(p =>
            p.id === piece.id ? { ...p, isSelected: true } : p
          ),
        };
      });
    }
  };

  const handleOperationClick = (operation: string) => {
    if (selectedPieces.length !== 2) return;

    const num1 = selectedPieces[0].value;
    const num2 = selectedPieces[1].value;
    let result: number;

    switch (operation) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      default:
        return;
    }

    if (result === puzzle?.target) {
      setScore(score + 10);
      setMessage('정답입니다! 🎉');
      setTimeout(() => {
        setPuzzle(generatePuzzle(grade));
        setSelectedPieces([]);
        setSelectedOperation(null);
        setMessage('다음 퍼즐을 풀어보세요!');
      }, 1500);
    } else {
      setMessage('틀렸습니다. 다시 시도해보세요.');
      setSelectedPieces([]);
      setSelectedOperation(null);
      setPuzzle(prev => {
        if (!prev) return null;
        return {
          ...prev,
          pieces: prev.pieces.map(p => ({ ...p, isSelected: false })),
        };
      });
    }
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
            {puzzle && (
              <div className="text-lg">목표 숫자: {puzzle.target}</div>
            )}
          </div>

          {/* 메시지 */}
          <div className="bg-gray-100 p-4 rounded-lg text-center text-lg font-bold">
            {message}
          </div>

          {/* 퍼즐 영역 */}
          {puzzle && (
            <div className="space-y-8">
              {/* 숫자 조각 */}
              <div className="grid grid-cols-3 gap-4">
                {puzzle.pieces.map((piece) => (
                  <motion.button
                    key={piece.id}
                    onClick={() => handlePieceClick(piece)}
                    className={`p-6 rounded-lg text-2xl font-bold ${
                      piece.isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={piece.isSelected}
                  >
                    {piece.value}
                  </motion.button>
                ))}
              </div>

              {/* 연산자 */}
              <div className="flex justify-center gap-4">
                {puzzle.operations.map((operation) => (
                  <motion.button
                    key={operation}
                    onClick={() => handleOperationClick(operation)}
                    className="w-16 h-16 bg-green-100 text-green-800 rounded-full text-2xl font-bold hover:bg-green-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={selectedPieces.length !== 2}
                  >
                    {operation}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 