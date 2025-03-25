export interface UserProfile {
  id: string;
  nickname: string;
  grade: number;
  avatar: string;
  createdAt: string;
  lastLoginAt: string;
  friends: string[];
  achievements: Achievement[];
  stats: UserStats;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

export interface UserStats {
  totalPlayTime: number;
  gamesPlayed: number;
  highScores: {
    [gameId: string]: {
      score: number;
      date: string;
    };
  };
  learningProgress: {
    [grade: number]: {
      [subject: string]: number; // 진도율 (0-100)
    };
  };
} 