'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './MathRunner.module.css';

interface MathRunnerProps {
  grade: number;
  onScoreUpdate?: (score: number) => void;
}

interface Problem {
  question: string;
  answer: number;
  options: number[];
}

export default function MathRunner({ grade, onScoreUpdate }: MathRunnerProps) {
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<number[]>([]);
  const [speed, setSpeed] = useState(5);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);

  const gameLoopRef = useRef<number>();
  const characterRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateProblem = () => {
    let num1: number, num2: number, answer: number;
    const operators = grade <= 2 ? ['+', '-'] : ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

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
      if (!options.includes(wrongAnswer) && wrongAnswer > 0) {
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
    setScore(0);
    setLives(3);
    setCombo(0);
    setSpeed(5);
    setPosition(0);
    setObstacles([]);
    setIsRunning(true);
    setIsGameOver(false);
    setCurrentProblem(generateProblem());
  };

  const handleJump = () => {
    if (!isJumping && isRunning) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isJumping, isRunning]);

  const gameLoop = (timestamp: number) => {
    if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
    const deltaTime = timestamp - lastUpdateRef.current;
    
    if (deltaTime >= 16) { // 약 60fps
      setPosition(prev => prev + speed);
      setObstacles(prev => {
        const newObstacles = prev
          .map(x => x - speed)
          .filter(x => x > -50);
        
        if (Math.random() < 0.02) {
          newObstacles.push(800);
        }
        return newObstacles;
      });

      const characterElement = characterRef.current;
      if (characterElement) {
        const characterRect = characterElement.getBoundingClientRect();
        obstacles.forEach(obstacleX => {
          const obstacleRect = {
            left: obstacleX,
            right: obstacleX + 30,
            top: 300,
            bottom: 350
          };

          if (!isJumping &&
              characterRect.right > obstacleRect.left &&
              characterRect.left < obstacleRect.right &&
              characterRect.bottom > obstacleRect.top) {
            handleCollision();
          }
        });
      }
      
      lastUpdateRef.current = timestamp;
    }

    if (isRunning && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    if (isRunning && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isRunning, isGameOver]);

  const handleCollision = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setIsGameOver(true);
        if (onScoreUpdate) {
          onScoreUpdate(score);
        }
      }
      return newLives;
    });
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!currentProblem || !isRunning) return;

    if (selectedAnswer === currentProblem.answer) {
      const newCombo = combo + 1;
      const comboBonus = Math.floor(newCombo / 3) * 5;
      setScore(prev => prev + 10 + comboBonus);
      setCombo(newCombo);
      setSpeed(prev => Math.min(prev + 0.2, 10));
      
      if (newCombo % 3 === 0) {
        alert(`대단해요! ${newCombo}콤보 달성! 보너스 점수 ${comboBonus}점!`);
      }
    } else {
      setCombo(0);
      setSpeed(prev => Math.max(prev - 0.5, 5));
      handleCollision();
    }
    
    setCurrentProblem(generateProblem());
  };

  return (
    <div className={styles.container}>
      {!isRunning && !isGameOver ? (
        <div className={styles.startScreen}>
          <h2>수학 달리기</h2>
          <p>
            스페이스바로 점프하고 장애물을 피하세요!<br />
            문제를 맞추면 점수를 얻고 속도가 올라갑니다.<br />
            연속으로 맞추면 콤보 보너스!
          </p>
          <button onClick={startGame} className={styles.startButton}>
            게임 시작
          </button>
        </div>
      ) : (
        <div className={styles.gameScreen}>
          <div className={styles.stats}>
            <div>점수: {score}</div>
            <div>생명: {'❤️'.repeat(lives)}</div>
            <div>콤보: {combo}</div>
            <div>속도: {Math.round(speed * 10)}km/h</div>
          </div>

          <div className={styles.gameArea}>
            <div
              ref={characterRef}
              className={`${styles.character} ${isJumping ? styles.jumping : ''}`}
              style={{ transform: `translateX(${position}px)` }}
            />
            
            {obstacles.map((x, i) => (
              <div
                key={i}
                className={styles.obstacle}
                style={{ left: `${x}px` }}
              />
            ))}
          </div>

          {currentProblem && (
            <div className={styles.problem}>
              <h3>{currentProblem.question}</h3>
              <div className={styles.options}>
                {currentProblem.options.map((option, index) => (
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
        </div>
      )}

      {isGameOver && (
        <div className={styles.gameOverScreen}>
          <h2>게임 오버!</h2>
          <p>최종 점수: {score}</p>
          <button onClick={startGame} className={styles.startButton}>
            다시 시작
          </button>
        </div>
      )}
    </div>
  );
} 