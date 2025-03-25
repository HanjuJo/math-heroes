'use client';

import { useState, useEffect, useCallback } from 'react';

interface Problem {
  question: string;
  answer: number;
  options: number[];
}

interface Props {
  searchParams: { grade?: string };
}

export default function MathRunner({ searchParams }: Props) {
  const [grade, setGrade] = useState(1);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const gradeFromParams = parseInt(searchParams?.grade || '1');
    setGrade(isNaN(gradeFromParams) ? 1 : gradeFromParams);
  }, []);

  const generateProblem = useCallback(() => {
    let num1, num2, operators;
    
    switch(grade) {
      case 1:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operators = ['+'];
        break;
      case 2:
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operators = ['+', '-'];
        break;
      case 3:
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        operators = ['+', '-', '*'];
        break;
      case 4:
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        operators = ['+', '-', '*'];
        break;
      case 5:
        num1 = Math.floor(Math.random() * 500) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        operators = ['+', '-', '*'];
        break;
      case 6:
        num1 = Math.floor(Math.random() * 1000) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        operators = ['+', '-', '*'];
        break;
      default:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operators = ['+'];
    }
    
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let answer;
    let question;
    
    switch(operator) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case '-':
        // 뺄셈의 경우 항상 양수가 나오도록 큰 수에서 작은 수를 빼기
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
      case '*':
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
      default:
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
    }

    // 보기 생성
    const options = [answer];
    const maxOffset = Math.min(10, Math.floor(answer * 0.3)); // 답의 30% 또는 최대 10까지의 오차
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * maxOffset * 2) - maxOffset;
      const option = answer + offset;
      if (!options.includes(option) && option >= 0) {
        options.push(option);
      }
    }
    
    return {
      question,
      answer,
      options: options.sort(() => Math.random() - 0.5) // 보기 순서 섞기
    };
  }, [grade]);

  const startGame = () => {
    setDistance(0);
    setScore(0);
    setConsecutiveCorrect(0);
    setGameOver(false);
    setIsRunning(true);
    const newProblem = generateProblem();
    setProblem(newProblem);
    setTimeLeft(5);
  };

  const checkAnswer = (selectedAnswer: number) => {
    if (!problem) return;
    
    const correct = selectedAnswer === problem.answer;
    
    if (correct) {
      setDistance(prev => prev + 100);
      setConsecutiveCorrect(prev => prev + 1);
      
      if (distance + 100 >= 1000) {
        setScore(prev => prev + 100);
        setGameOver(true);
        setIsRunning(false);
        return;
      }
      
      if (consecutiveCorrect + 1 >= 3) {
        setScore(prev => prev + 10);
        setConsecutiveCorrect(0);
      }
      
      const newProblem = generateProblem();
      setProblem(newProblem);
      setTimeLeft(5);
    } else {
      setGameOver(true);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!isRunning || !problem) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          setIsRunning(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isRunning, problem]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">수학달리기</h1>
      
      {!isRunning && !gameOver && (
        <div className="text-center">
          <button
            onClick={startGame}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-600"
          >
            게임 시작
          </button>
        </div>
      )}
      
      {isRunning && problem && (
        <div className="space-y-4">
          <div className="flex justify-between text-xl">
            <div>거리: {distance}m / 1000m</div>
            <div>점수: {score}</div>
            <div>시간: {timeLeft}초</div>
          </div>
          
          <div className="text-2xl text-center font-bold my-8">
            {problem.question}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {problem.options.map((option, index) => (
              <button
                key={index}
                onClick={() => checkAnswer(option)}
                className="bg-white border-2 border-blue-500 text-blue-500 px-6 py-4 rounded-lg text-xl hover:bg-blue-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {gameOver && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">
            게임 종료!
          </h2>
          <p className="text-xl">
            최종 점수: {score}점
          </p>
          <p className="text-xl">
            달린 거리: {distance}m
          </p>
          <button
            onClick={startGame}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-600"
          >
            다시 시작
          </button>
        </div>
      )}
    </div>
  );
} 