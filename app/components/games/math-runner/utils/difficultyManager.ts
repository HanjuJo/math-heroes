export interface DifficultySettings {
  baseSpeed: number;
  speedIncrease: number;
  obstacleFrequency: number;
  powerUpFrequency: number;
  scoreMultiplier: number;
}

export const DIFFICULTY_LEVELS: Record<string, DifficultySettings> = {
  easy: {
    baseSpeed: 4,
    speedIncrease: 1.5,
    obstacleFrequency: 0.7,
    powerUpFrequency: 0.15,
    scoreMultiplier: 1
  },
  normal: {
    baseSpeed: 5,
    speedIncrease: 2,
    obstacleFrequency: 1,
    powerUpFrequency: 0.1,
    scoreMultiplier: 1.5
  },
  hard: {
    baseSpeed: 6,
    speedIncrease: 2.5,
    obstacleFrequency: 1.3,
    powerUpFrequency: 0.08,
    scoreMultiplier: 2
  }
};

export function getDifficultyForGrade(grade: number): DifficultySettings {
  if (grade <= 2) return DIFFICULTY_LEVELS.easy;
  if (grade <= 4) return DIFFICULTY_LEVELS.normal;
  return DIFFICULTY_LEVELS.hard;
}

export function adjustDifficultyByScore(
  settings: DifficultySettings,
  score: number
): DifficultySettings {
  const scoreMultiplier = Math.floor(score / 100);
  return {
    ...settings,
    baseSpeed: settings.baseSpeed + scoreMultiplier * 0.5,
    obstacleFrequency: Math.min(settings.obstacleFrequency + scoreMultiplier * 0.1, 2),
    powerUpFrequency: Math.max(settings.powerUpFrequency - scoreMultiplier * 0.01, 0.05)
  };
} 