export interface Obstacle {
  id: string;
  type: 'rock' | 'spike' | 'bird';
  x: number;
  y: number;
  width: number;
  height: number;
}

export const OBSTACLE_TYPES = {
  rock: {
    width: 40,
    height: 40,
    image: '/images/obstacles/rock.png'
  },
  spike: {
    width: 30,
    height: 50,
    image: '/images/obstacles/spike.png'
  },
  bird: {
    width: 50,
    height: 30,
    image: '/images/obstacles/bird.png'
  }
}; 