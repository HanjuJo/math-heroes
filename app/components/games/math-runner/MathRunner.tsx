'use client';

import React, { useEffect, useState, useRef } from 'react';
import { generateProblem } from './utils/problemGenerator';
import { audioManager } from '@/app/utils/audioManager';
import { Obstacle, OBSTACLE_TYPES } from './types/Obstacle';
import { generateObstacle, updateObstacles, checkCollision } from './utils/obstacleManager';
import { PowerUp, POWERUP_TYPES } from './types/PowerUp';
import { generatePowerUp, updatePowerUps, checkPowerUpCollision, applyPowerUpEffect } from './utils/powerUpManager';
import styles from './MathRunner.module.css';

interface MathRunnerProps {
  grade: number;
}

interface GameState {
  score: number;
  speed: number;
  distance: number;
  isJumping: boolean;
  isGameOver: boolean;
  currentProblem: {
    question: string;
    answer: number;
    options: number[];
  } | null;
  obstacles: Obstacle[];
  powerUps: PowerUp[];
  activePowerUps: PowerUp[];
  characterY: number;
  isShielded: boolean;
  scoreMultiplier: number;
}

const CHARACTER_WIDTH = 80;
const CHARACTER_HEIGHT = 80;
const GROUND_Y = 20;
const JUMP_HEIGHT = 200;
const JUMP_DURATION = 500;

export default function MathRunner({ grade }: MathRunnerProps) {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    speed: 5,
    distance: 0,
    isJumping: false,
    isGameOver: false,
    currentProblem: null,
    obstacles: [],
    powerUps: [],
    activePowerUps: [],
    characterY: GROUND_Y,
    isShielded: false,
    scoreMultiplier: 1
  });

  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const characterRef = useRef<HTMLDivElement>(null);

  // 게임 초기화
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      currentProblem: generateProblem(grade),
      obstacles: [generateObstacle(0)],
      powerUps: [generatePowerUp(0)],
      activePowerUps: []
    }));

    // 키보드 이벤트 리스너 추가
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [grade]);

  // 게임 루프
  useEffect(() => {
    if (gameState.isGameOver) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setGameState(prev => {
        // 장애물 업데이트
        const updatedObstacles = updateObstacles(prev.obstacles, prev.distance, prev.speed);
        
        // 파워업 업데이트
        const updatedPowerUps = updatePowerUps(prev.powerUps, prev.distance, prev.speed);
        
        // 활성 파워업 시간 체크 및 효과 제거
        const currentTime = Date.now();
        const updatedActivePowerUps = prev.activePowerUps.filter(powerUp => {
          const isActive = currentTime - powerUp.startTime < powerUp.duration;
          if (!isActive) {
            // 파워업 효과 제거
            switch (powerUp.type) {
              case 'shield':
                prev.isShielded = false;
                break;
              case 'speed':
                prev.speed = prev.speed / 1.5;
                break;
              case 'score':
                prev.scoreMultiplier = 1;
                break;
            }
          }
          return isActive;
        });

        // 파워업 충돌 체크
        updatedPowerUps.forEach(powerUp => {
          if (checkPowerUpCollision(200, prev.characterY, CHARACTER_WIDTH, CHARACTER_HEIGHT, powerUp)) {
            audioManager?.playSound('powerup');
            powerUp.active = true;
            powerUp.startTime = Date.now();
            updatedActivePowerUps.push(powerUp);
            const updatedState = applyPowerUpEffect(powerUp.type, prev);
            Object.assign(prev, updatedState);
          }
        });

        // 장애물 충돌 체크 (무적 상태가 아닐 때만)
        const collision = !prev.isShielded && updatedObstacles.some(obstacle =>
          checkCollision(200, prev.characterY, CHARACTER_WIDTH, CHARACTER_HEIGHT, obstacle)
        );

        if (collision) {
          audioManager?.playSound('incorrect');
          return { ...prev, isGameOver: true };
        }

        return {
          ...prev,
          distance: prev.distance + (prev.speed * deltaTime) / 1000,
          obstacles: updatedObstacles,
          powerUps: updatedPowerUps.filter(p => !p.active),
          activePowerUps: updatedActivePowerUps
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver]);

  // 점프 처리
  const handleJump = () => {
    if (gameState.isJumping) return;

    audioManager?.playSound('jump');
    setGameState(prev => ({ ...prev, isJumping: true }));

    // 점프 애니메이션
    const jumpStart = performance.now();
    const jumpLoop = (timestamp: number) => {
      const elapsed = timestamp - jumpStart;
      const progress = Math.min(elapsed / JUMP_DURATION, 1);
      
      // 사인 곡선을 사용한 부드러운 점프 모션
      const height = Math.sin(progress * Math.PI) * JUMP_HEIGHT;
      
      setGameState(prev => ({
        ...prev,
        characterY: GROUND_Y + height
      }));

      if (progress < 1) {
        requestAnimationFrame(jumpLoop);
      } else {
        setGameState(prev => ({ ...prev, isJumping: false, characterY: GROUND_Y }));
      }
    };

    requestAnimationFrame(jumpLoop);
  };

  // 답안 제출 처리
  const handleAnswer = (answer: number) => {
    if (!gameState.currentProblem) return;

    if (answer === gameState.currentProblem.answer) {
      // 정답 처리
      audioManager?.playSound('correct');
      audioManager?.playSound('coin');
      setGameState(prev => ({
        ...prev,
        score: prev.score + Math.ceil(prev.speed * prev.scoreMultiplier),
        speed: prev.speed + 2,
        currentProblem: generateProblem(grade)
      }));
    } else {
      // 오답 처리
      audioManager?.playSound('incorrect');
      setGameState(prev => ({
        ...prev,
        speed: Math.max(5, prev.speed - 2),
        currentProblem: generateProblem(grade)
      }));
    }
  };

  // 게임 재시작
  const handleRestart = () => {
    audioManager?.playSound('click');
    setGameState({
      score: 0,
      speed: 5,
      distance: 0,
      isJumping: false,
      isGameOver: false,
      currentProblem: generateProblem(grade),
      obstacles: [generateObstacle(0)],
      powerUps: [generatePowerUp(0)],
      activePowerUps: [],
      characterY: GROUND_Y,
      isShielded: false,
      scoreMultiplier: 1
    });
    lastTimeRef.current = 0;
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.background} />
      
      {/* 장애물 렌더링 */}
      {gameState.obstacles.map(obstacle => (
        <div
          key={obstacle.id}
          className={styles.obstacle}
          style={{
            left: `${obstacle.x}px`,
            bottom: `${obstacle.y}px`,
            width: `${obstacle.width}px`,
            height: `${obstacle.height}px`,
            backgroundImage: `url(${OBSTACLE_TYPES[obstacle.type].image})`
          }}
        />
      ))}

      {/* 파워업 렌더링 */}
      {gameState.powerUps.map(powerUp => (
        <div
          key={powerUp.id}
          className={styles.powerUp}
          style={{
            left: `${powerUp.x}px`,
            bottom: `${powerUp.y}px`,
            width: `${powerUp.width}px`,
            height: `${powerUp.height}px`,
            backgroundImage: `url(${POWERUP_TYPES[powerUp.type].image})`
          }}
        />
      ))}

      <div 
        ref={characterRef}
        className={`${styles.character} ${gameState.isJumping ? styles.jumping : ''}`}
        style={{ bottom: `${gameState.characterY}px` }}
      >
        <img src="/images/characters/runner.png" alt="Runner" />
      </div>

      <div className={styles.stats}>
        <div>점수: {Math.floor(gameState.score)}</div>
        <div>속도: {gameState.speed.toFixed(1)}</div>
        <div>거리: {Math.floor(gameState.distance)}m</div>
      </div>

      {gameState.currentProblem && (
        <div className={styles.gameInterface}>
          <div className={styles.problem}>
            <div className="text-2xl font-bold mb-4">{gameState.currentProblem.question}</div>
            <div className={styles.options}>
              {gameState.currentProblem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={styles.option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 활성 파워업 표시 */}
      <div className={styles.activePowerUps}>
        {gameState.activePowerUps.map(powerUp => (
          <div key={powerUp.id} className={styles.activePowerUp}>
            {POWERUP_TYPES[powerUp.type].effect}
          </div>
        ))}
      </div>

      {gameState.isGameOver && (
        <div className={styles.gameOver}>
          <div className={styles.gameOverContent}>
            <h2 className="text-2xl font-bold mb-4">게임 오버!</h2>
            <p className="mb-4">최종 점수: {Math.floor(gameState.score)}</p>
            <button
              onClick={handleRestart}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              다시 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 