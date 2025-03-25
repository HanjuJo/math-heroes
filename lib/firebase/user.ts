import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { UserProfile, Achievement, UserStats } from '../types/user';

// 사용자 프로필 생성
export const createUserProfile = async (userId: string, nickname: string, grade: number) => {
  try {
    const userProfile: UserProfile = {
      id: userId,
      nickname,
      grade,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`, // 기본 아바타
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      friends: [],
      achievements: [],
      stats: {
        totalPlayTime: 0,
        gamesPlayed: 0,
        highScores: {},
        learningProgress: {
          [grade]: {
            addition: 0,
            subtraction: 0,
            multiplication: 0,
            division: 0,
          },
        },
      },
    };

    await setDoc(doc(db, 'users', userId), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// 사용자 프로필 조회
export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      lastLoginAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// 친구 추가
export const addFriend = async (userId: string, friendId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      friends: arrayUnion(friendId),
    });
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

// 친구 삭제
export const removeFriend = async (userId: string, friendId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      friends: arrayRemove(friendId),
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

// 업적 달성
export const unlockAchievement = async (userId: string, achievement: Achievement) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      achievements: arrayUnion({
        ...achievement,
        unlockedAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    throw error;
  }
};

// 학습 진도 업데이트
export const updateLearningProgress = async (
  userId: string,
  grade: number,
  subject: string,
  progress: number
) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`stats.learningProgress.${grade}.${subject}`]: progress,
    });
  } catch (error) {
    console.error('Error updating learning progress:', error);
    throw error;
  }
};

// 게임 통계 업데이트
export const updateGameStats = async (
  userId: string,
  gameId: string,
  score: number,
  playTime: number
) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserProfile;

    const currentHighScore = userData.stats.highScores[gameId]?.score || 0;
    
    await updateDoc(userRef, {
      'stats.totalPlayTime': userData.stats.totalPlayTime + playTime,
      'stats.gamesPlayed': userData.stats.gamesPlayed + 1,
      [`stats.highScores.${gameId}`]: score > currentHighScore
        ? { score, date: new Date().toISOString() }
        : userData.stats.highScores[gameId],
    });
  } catch (error) {
    console.error('Error updating game stats:', error);
    throw error;
  }
}; 