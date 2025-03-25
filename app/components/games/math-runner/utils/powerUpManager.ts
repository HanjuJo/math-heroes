import { PowerUp, POWERUP_TYPES } from '../types/PowerUp';

export function generatePowerUp(distance: number): PowerUp {
  const types = ['shield', 'speed', 'score'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const specs = POWERUP_TYPES[type];

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    x: distance + 800, // 화면 밖에서 시작
    y: Math.random() * 150 + 50, // 50-200px 높이
    width: specs.width,
    height: specs.height,
    active: false,
    duration: specs.duration
  };
}

export function updatePowerUps(
  powerUps: PowerUp[],
  distance: number,
  speed: number
): PowerUp[] {
  // 파워업 위치 업데이트
  const updatedPowerUps = powerUps.map(powerUp => ({
    ...powerUp,
    x: powerUp.x - speed * 2
  }));

  // 화면 밖으로 나간 파워업 제거
  const filteredPowerUps = updatedPowerUps.filter(
    powerUp => powerUp.x > -powerUp.width
  );

  // 새로운 파워업 생성 (10% 확률)
  if (Math.random() < 0.1 && filteredPowerUps.length < 2) {
    filteredPowerUps.push(generatePowerUp(distance));
  }

  return filteredPowerUps;
}

export function checkPowerUpCollision(
  characterX: number,
  characterY: number,
  characterWidth: number,
  characterHeight: number,
  powerUp: PowerUp
): boolean {
  return (
    characterX < powerUp.x + powerUp.width &&
    characterX + characterWidth > powerUp.x &&
    characterY < powerUp.y + powerUp.height &&
    characterY + characterHeight > powerUp.y
  );
}

interface GameState {
  isShielded: boolean;
  speed: number;
  scoreMultiplier: number;
  [key: string]: any;
}

export function applyPowerUpEffect(
  powerUpType: PowerUp['type'],
  gameState: GameState
): GameState {
  switch (powerUpType) {
    case 'shield':
      return {
        ...gameState,
        isShielded: true
      };
    case 'speed':
      return {
        ...gameState,
        speed: gameState.speed * 1.5
      };
    case 'score':
      return {
        ...gameState,
        scoreMultiplier: 2
      };
  }
} 