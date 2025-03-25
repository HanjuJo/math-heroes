import { Obstacle, OBSTACLE_TYPES } from '../types/Obstacle';

export function generateObstacle(distance: number): Obstacle {
  const types = ['rock', 'spike', 'bird'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const specs = OBSTACLE_TYPES[type];

  // 새는 위쪽에, 바위와 가시는 아래쪽에 배치
  const y = type === 'bird' ? 
    Math.random() * 100 + 150 : // 150-250px 높이
    20; // 지면 근처

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    x: distance + 800, // 화면 밖에서 시작
    y,
    width: specs.width,
    height: specs.height
  };
}

export function updateObstacles(
  obstacles: Obstacle[], 
  distance: number, 
  speed: number
): Obstacle[] {
  // 장애물 위치 업데이트
  const updatedObstacles = obstacles.map(obstacle => ({
    ...obstacle,
    x: obstacle.x - speed * 2 // 속도의 2배로 이동
  }));

  // 화면 밖으로 나간 장애물 제거
  const filteredObstacles = updatedObstacles.filter(
    obstacle => obstacle.x > -obstacle.width
  );

  // 새로운 장애물 생성 (일정 간격으로)
  const lastObstacle = filteredObstacles[filteredObstacles.length - 1];
  if (!lastObstacle || lastObstacle.x < 600) {
    filteredObstacles.push(generateObstacle(distance));
  }

  return filteredObstacles;
}

export function checkCollision(
  characterX: number,
  characterY: number,
  characterWidth: number,
  characterHeight: number,
  obstacle: Obstacle
): boolean {
  // 충돌 여유 공간 (히트박스를 실제 크기보다 작게)
  const margin = 10;

  return (
    characterX + margin < obstacle.x + obstacle.width &&
    characterX + characterWidth - margin > obstacle.x &&
    characterY + margin < obstacle.y + obstacle.height &&
    characterY + characterHeight - margin > obstacle.y
  );
} 