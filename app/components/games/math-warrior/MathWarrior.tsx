'use client';

import React, { useState, useEffect } from 'react';
import styles from './MathWarrior.module.css';

interface MathWarriorProps {
  grade: number;
  onScoreUpdate?: (score: number) => void;
}

interface Character {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  experience: number;
  level: number;
}

interface Monster {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  experience: number;
}

interface Item {
  name: string;
  effect: string;
  price: number;
}

export default function MathWarrior({ grade, onScoreUpdate }: MathWarriorProps) {
  const [character, setCharacter] = useState<Character>({
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    experience: 0,
    level: 1
  });

  const [monster, setMonster] = useState<Monster | null>(null);
  const [problem, setProblem] = useState<{ question: string; answer: number; options: number[] } | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [gold, setGold] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState('');

  const items: Item[] = [
    { name: '체력 포션', effect: 'health', price: 50 },
    { name: '공격력 포션', effect: 'attack', price: 75 },
    { name: '방어구', effect: 'defense', price: 100 }
  ];

  const generateMonster = () => {
    const names = ['슬라임', '고블린', '오크', '드래곤'];
    const index = Math.floor(Math.random() * names.length);
    const level = Math.floor(character.level * 0.8) + 1;

    return {
      name: names[index],
      health: 50 + level * 10,
      maxHealth: 50 + level * 10,
      attack: 5 + level * 2,
      experience: 20 + level * 5
    };
  };

  const generateProblem = () => {
    let num1, num2, operator;
    const operators = grade <= 2 ? ['+', '-'] : ['+', '-', '*', '/'];
    
    switch(grade) {
      case 1:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 2:
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        break;
      default:
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
    }

    operator = operators[Math.floor(Math.random() * operators.length)];
    let answer: number;

    switch(operator) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case '*': answer = num1 * num2; break;
      case '/':
        answer = num1;
        num1 = answer * num2;
        answer = num1 / num2;
        break;
      default: answer = num1 + num2;
    }

    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + (Math.floor(Math.random() * 10) - 5);
      if (!options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }

    return {
      question: `${num1} ${operator} ${num2} = ?`,
      answer,
      options: options.sort(() => Math.random() - 0.5)
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setMonster(generateMonster());
    setProblem(generateProblem());
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!problem || !monster) return;

    if (selectedAnswer === problem.answer) {
      // 정답 처리
      const damage = character.attack;
      const newMonsterHealth = monster.health - damage;
      setMessage(`정답! ${monster.name}에게 ${damage}의 피해를 입혔습니다!`);

      if (newMonsterHealth <= 0) {
        // 몬스터 처치
        const earnedGold = Math.floor(Math.random() * 30) + 20;
        setGold(prev => prev + earnedGold);
        setCharacter(prev => ({
          ...prev,
          experience: prev.experience + monster.experience
        }));
        setMessage(`${monster.name}을(를) 물리쳤습니다! ${earnedGold} 골드를 획득했습니다!`);
        setMonster(generateMonster());
      } else {
        setMonster({ ...monster, health: newMonsterHealth });
      }
    } else {
      // 오답 처리
      const damage = Math.max(1, monster.attack - character.defense);
      const newHealth = character.health - damage;
      setMessage(`틀렸습니다! ${monster.name}에게 ${damage}의 피해를 받았습니다.`);

      if (newHealth <= 0) {
        setCharacter(prev => ({ ...prev, health: 0 }));
        setGameStarted(false);
        setMessage('게임 오버! 다시 도전해보세요.');
        if (onScoreUpdate) {
          onScoreUpdate(character.experience);
        }
      } else {
        setCharacter(prev => ({ ...prev, health: newHealth }));
      }
    }
    setProblem(generateProblem());
  };

  const useItem = (item: Item) => {
    switch (item.effect) {
      case 'health':
        setCharacter(prev => ({
          ...prev,
          health: Math.min(prev.maxHealth, prev.health + 30)
        }));
        break;
      case 'attack':
        setCharacter(prev => ({
          ...prev,
          attack: prev.attack + 5
        }));
        break;
      case 'defense':
        setCharacter(prev => ({
          ...prev,
          defense: prev.defense + 3
        }));
        break;
    }
    setInventory(prev => prev.filter(i => i !== item));
  };

  const buyItem = (item: Item) => {
    if (gold >= item.price) {
      setGold(prev => prev - item.price);
      setInventory(prev => [...prev, item]);
      setMessage(`${item.name}을(를) 구매했습니다!`);
    } else {
      setMessage('골드가 부족합니다!');
    }
  };

  useEffect(() => {
    if (character.experience >= character.level * 100) {
      setCharacter(prev => ({
        ...prev,
        level: prev.level + 1,
        maxHealth: prev.maxHealth + 20,
        health: prev.maxHealth + 20,
        attack: prev.attack + 3,
        defense: prev.defense + 2,
        experience: 0
      }));
      setMessage(`레벨 업! ${character.level + 1}레벨이 되었습니다!`);
    }
  }, [character.experience, character.level]);

  return (
    <div className={styles.container}>
      {!gameStarted ? (
        <div className={styles.startScreen}>
          <h2>수학 용사</h2>
          <p>몬스터를 물리치고 수학 실력을 키워보세요!</p>
          <button onClick={startGame} className={styles.startButton}>
            게임 시작
          </button>
        </div>
      ) : (
        <div className={styles.gameScreen}>
          <div className={styles.status}>
            <div className={styles.characterStatus}>
              <h3>용사 (Lv.{character.level})</h3>
              <div className={styles.healthBar}>
                <div 
                  className={styles.healthFill} 
                  style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
                />
                <span>{character.health}/{character.maxHealth}</span>
              </div>
              <div>공격력: {character.attack}</div>
              <div>방어력: {character.defense}</div>
              <div>경험치: {character.experience}/{character.level * 100}</div>
              <div>골드: {gold}</div>
            </div>

            {monster && (
              <div className={styles.monsterStatus}>
                <h3>{monster.name}</h3>
                <div className={styles.healthBar}>
                  <div 
                    className={styles.healthFill} 
                    style={{ width: `${(monster.health / monster.maxHealth) * 100}%` }}
                  />
                  <span>{monster.health}/{monster.maxHealth}</span>
                </div>
              </div>
            )}
          </div>

          {message && <div className={styles.message}>{message}</div>}

          {problem && (
            <div className={styles.problem}>
              <h3>{problem.question}</h3>
              <div className={styles.options}>
                {problem.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={styles.optionButton}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.inventory}>
            <h3>인벤토리</h3>
            <div className={styles.items}>
              {inventory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => useItem(item)}
                  className={styles.itemButton}
                >
                  {item.name} 사용
                </button>
              ))}
            </div>
          </div>

          <div className={styles.shop}>
            <h3>상점</h3>
            <div className={styles.items}>
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => buyItem(item)}
                  className={styles.shopButton}
                >
                  {item.name} ({item.price} 골드)
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 