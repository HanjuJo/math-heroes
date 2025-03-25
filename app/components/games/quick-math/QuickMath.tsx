import React, { useState, useEffect, useCallback } from 'react';
import styles from './QuickMath.module.css';

interface QuickMathProps {
  grade: number;
  onScoreUpdate?: (score: number) => void;
}

interface Problem {
  question: string;
  answer: number;
  options: number[];
  timeLimit: number;
}

export default function QuickMath({ grade, onScoreUpdate }: QuickMathProps) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const generateProblem = useCallback(() => {
    let num1: number, num2: number, answer: number;
    let timeLimit: number;
    const operators = grade <= 2 ? ['+', '-'] : ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    switch(grade) {
      case 1:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        timeLimit = 10;
        break;
      case 2:
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        timeLimit = 8;
        break;
      default:
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        timeLimit = 6;
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
      options: options.sort(() => Math.random() - 0.5),
      timeLimit
    };
  }, [grade]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsGameOver(false);
    setStreak(0);
    setMultiplier(1);
    setTotalProblems(0);
    setCorrectAnswers(0);
    setCurrentProblem(generateProblem());
  };

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            if (score > highScore) {
              setHighScore(score);
            }
            if (onScoreUpdate) {
              onScoreUpdate(score);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isGameOver, score, highScore, onScoreUpdate]);

  useEffect(() => {
    if (currentProblem && !isGameOver) {
      const timer = setInterval(() => {
        setCurrentProblem(prev => {
          if (prev && prev.timeLimit <= 1) {
            handleAnswer(-1); // 시간 초과
            return generateProblem();
          }
          return prev ? { ...prev, timeLimit: prev.timeLimit - 1 } : null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentProblem, isGameOver, generateProblem]);

  const handleAnswer = (selectedAnswer: number) => {
    if (!currentProblem || isGameOver) return;

    setTotalProblems(prev => prev + 1);

    if (selectedAnswer === currentProblem.answer) {
      const newStreak = streak + 1;
      const newMultiplier = Math.floor(newStreak / 3) + 1;
      const timeBonus = Math.floor(currentProblem.timeLimit * 2);
      const points = (10 + timeBonus) * newMultiplier;

      setScore(prev => prev + points);
      setStreak(newStreak);
      setMultiplier(newMultiplier);
      setCorrectAnswers(prev => prev + 1);

      if (newStreak % 3 === 0) {
        alert(`대단해요! ${newStreak}연속 정답! ${newMultiplier}배 점수 보너스!`);
      }
    } else {
      setStreak(0);
      setMultiplier(1);
    }

    setCurrentProblem(generateProblem());
  };

  return (
    <div className={styles.container}>
      {!timeLeft && !isGameOver ? (
        <div className={styles.startScreen}>
          <h2>빠른 수학</h2>
          <p>
            60초 동안 최대한 많은 문제를 맞혀보세요!<br />
            연속으로 맞추면 점수가 배가 됩니다!<br />
            빠르게 맞출수록 더 많은 점수를 얻을 수 있어요!
          </p>
          <div className={styles.highScore}>최고 점수: {highScore}</div>
          <button onClick={startGame} className={styles.startButton}>
            게임 시작
          </button>
        </div>
      ) : (
        <div className={styles.gameScreen}>
          <div className={styles.stats}>
            <div>시간: {timeLeft}초</div>
            <div>점수: {score}</div>
            <div>연속: {streak}</div>
            <div>배율: x{multiplier}</div>
          </div>

          {currentProblem && (
            <div className={styles.problem}>
              <div className={styles.timer}>
                남은 시간: {currentProblem.timeLimit}초
              </div>
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
          <h2>게임 종료!</h2>
          <div className={styles.results}>
            <p>최종 점수: {score}</p>
            <p>정답률: {Math.round((correctAnswers / totalProblems) * 100)}%</p>
            <p>최고 연속: {streak}</p>
            {score > highScore && (
              <p className={styles.newRecord}>새로운 기록 달성! 🎉</p>
            )}
          </div>
          <button onClick={startGame} className={styles.startButton}>
            다시 시작
          </button>
        </div>
      )}
    </div>
  );
} 