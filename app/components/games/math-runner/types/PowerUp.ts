export interface PowerUp {
  id: string;
  type: 'shield' | 'speed' | 'score';
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  duration: number;
}

export const POWERUP_TYPES = {
  shield: {
    width: 30,
    height: 30,
    image: '/images/powerups/shield.png',
    duration: 5000, // 5초
    effect: '장애물 무적'
  },
  speed: {
    width: 30,
    height: 30,
    image: '/images/powerups/speed.png',
    duration: 3000, // 3초
    effect: '이동 속도 증가'
  },
  score: {
    width: 30,
    height: 30,
    image: '/images/powerups/score.png',
    duration: 7000, // 7초
    effect: '점수 2배'
  }
}; 