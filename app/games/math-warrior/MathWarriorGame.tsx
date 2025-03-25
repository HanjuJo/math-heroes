'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MathWarriorGameProps {
  grade: number;
}

interface Character {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  exp: number;
  image: string;
}

interface Monster {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  exp: number;
  question: string;
  answer: number;
  options: number[];
  image: string;
}

const generateMonster = (grade: number): Monster => {
  let num1: number, num2: number, answer: number;
  const names = ['슬라임', '고블린', '오크', '드래곤'];
  
  switch(grade) {
    case 1:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 + num2;
      return {
        name: names[Math.floor(Math.random() * 2)],
        level: 1,
        hp: 50,
        maxHp: 50,
        exp: 10,
        question: `${num1} + ${num2} = ?`,
        answer,
        options: shuffleArray([answer, answer + 1, answer - 1, answer + 2]),
        image: '🧟‍♂️'
      };
    case 2:
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      answer = num1 + num2;
      return {
        name: names[Math.floor(Math.random() * 3)],
        level: 2,
        hp: 80,
        maxHp: 80,
        exp: 20,
        question: `${num1} + ${num2} = ?`,
        answer,
        options: shuffleArray([answer, answer + 2, answer - 2, answer + 3]),
        image: '👹'
      };
    default:
      return generateMonster(1);
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

export default function MathWarriorGame({ grade }: MathWarriorGameProps) {
  const [character, setCharacter] = useState<Character>({
    name: '용사',
    level: 1,
    hp: 100,
    maxHp: 100,
    exp: 0,
    image: '🦸‍♂️'
  });
  
  const [monster, setMonster] = useState<Monster | null>(null);
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'win' | 'lose'>('ready');
  const [message, setMessage] = useState<string>('');

  const startGame = () => {
    setGameStatus('playing');
    setMonster(generateMonster(grade));
    setMessage('몬스터가 나타났다!');
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!monster) return;

    if (selectedAnswer === monster.answer) {
      // 정답 처리
      const newMonsterHp = monster.hp - 20;
      if (newMonsterHp <= 0) {
        // 몬스터 처치
        const newExp = character.exp + monster.exp;
        if (newExp >= 100) {
          // 레벨업
          setCharacter({
            ...character,
            level: character.level + 1,
            hp: character.maxHp + 20,
            maxHp: character.maxHp + 20,
            exp: newExp - 100
          });
          setMessage('레벨업! 🎉');
        } else {
          setCharacter({
            ...character,
            exp: newExp
          });
        }
        setMonster(null);
        setMessage('몬스터를 물리쳤다!');
        setTimeout(() => {
          setMonster(generateMonster(grade));
          setMessage('새로운 몬스터가 나타났다!');
        }, 1500);
      } else {
        setMonster({
          ...monster,
          hp: newMonsterHp
        });
        setMessage('정답! 몬스터에게 데미지를 입혔다!');
      }
    } else {
      // 오답 처리
      const newCharacterHp = character.hp - 10;
      if (newCharacterHp <= 0) {
        setCharacter({
          ...character,
          hp: 0
        });
        setGameStatus('lose');
        setMessage('게임 오버...');
      } else {
        setCharacter({
          ...character,
          hp: newCharacterHp
        });
        setMessage('틀렸다! 몬스터의 공격을 받았다!');
      }
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
            <div className="space-y-2">
              <div className="text-lg">
                {character.image} {character.name} Lv.{character.level}
              </div>
              <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                />
              </div>
              <div className="text-sm">HP: {character.hp}/{character.maxHp}</div>
              <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(character.exp / 100) * 100}%` }}
                />
              </div>
              <div className="text-sm">EXP: {character.exp}/100</div>
            </div>
            
            {monster && (
              <div className="space-y-2">
                <div className="text-lg text-right">
                  {monster.name} Lv.{monster.level} {monster.image}
                </div>
                <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-right">
                  HP: {monster.hp}/{monster.maxHp}
                </div>
              </div>
            )}
          </div>

          {/* 메시지 */}
          <div className="bg-gray-100 p-4 rounded-lg text-center text-lg font-bold">
            {message}
          </div>

          {/* 전투 영역 */}
          {monster && gameStatus === 'playing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-center">
                {monster.question}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {monster.options.map((option) => (
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

          {/* 게임 오버 */}
          {gameStatus === 'lose' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600 mb-4">게임 오버</h2>
              <button
                onClick={() => {
                  setCharacter({
                    ...character,
                    hp: character.maxHp
                  });
                  setGameStatus('ready');
                }}
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