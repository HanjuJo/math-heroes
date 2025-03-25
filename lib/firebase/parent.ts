import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface ParentProfile {
  id: string;
  email: string;
  children: string[]; // 자녀 사용자 ID 배열
  notifications: boolean;
  weeklyReportEnabled: boolean;
}

interface StudyReport {
  userId: string;
  week: string;
  totalStudyTime: number;
  gameResults: {
    [gameId: string]: {
      timesPlayed: number;
      averageScore: number;
      improvement: number;
    };
  };
  subjectProgress: {
    [subject: string]: number;
  };
  recommendations: string[];
}

// 부모 프로필 생성
export const createParentProfile = async (parentId: string, email: string) => {
  try {
    const parentProfile: ParentProfile = {
      id: parentId,
      email,
      children: [],
      notifications: true,
      weeklyReportEnabled: true,
    };

    await setDoc(doc(db, 'parents', parentId), parentProfile);
    return parentProfile;
  } catch (error) {
    console.error('Error creating parent profile:', error);
    throw error;
  }
};

// 자녀 계정 연결
export const linkChildAccount = async (parentId: string, childId: string) => {
  try {
    const parentRef = doc(db, 'parents', parentId);
    await updateDoc(parentRef, {
      children: arrayUnion(childId),
    });

    // 자녀 계정에도 부모 정보 추가
    const childRef = doc(db, 'users', childId);
    await updateDoc(childRef, {
      parentId,
    });
  } catch (error) {
    console.error('Error linking child account:', error);
    throw error;
  }
};

// 주간 학습 리포트 생성
export const generateWeeklyReport = async (userId: string): Promise<StudyReport> => {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    // 사용자의 게임 기록 조회
    const gamesRef = collection(db, 'scores');
    const gamesQuery = query(
      gamesRef,
      where('userId', '==', userId),
      where('timestamp', '>=', weekStart.toISOString())
    );
    const gamesSnapshot = await getDocs(gamesQuery);

    // 게임별 통계 계산
    const gameResults: StudyReport['gameResults'] = {};
    gamesSnapshot.forEach((doc) => {
      const data = doc.data();
      if (!gameResults[data.gameId]) {
        gameResults[data.gameId] = {
          timesPlayed: 0,
          averageScore: 0,
          improvement: 0,
        };
      }
      gameResults[data.gameId].timesPlayed++;
      gameResults[data.gameId].averageScore =
        (gameResults[data.gameId].averageScore * (gameResults[data.gameId].timesPlayed - 1) +
          data.score) /
        gameResults[data.gameId].timesPlayed;
    });

    // 사용자 프로필에서 과목별 진도 가져오기
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    const report: StudyReport = {
      userId,
      week: weekStart.toISOString().split('T')[0],
      totalStudyTime: userData?.stats?.totalPlayTime || 0,
      gameResults,
      subjectProgress: userData?.stats?.learningProgress[userData.grade] || {},
      recommendations: generateRecommendations(gameResults, userData?.stats?.learningProgress[userData.grade]),
    };

    // 리포트 저장
    await setDoc(doc(db, 'weeklyReports', `${userId}_${report.week}`), report);

    return report;
  } catch (error) {
    console.error('Error generating weekly report:', error);
    throw error;
  }
};

// 학습 추천사항 생성
const generateRecommendations = (
  gameResults: StudyReport['gameResults'],
  progress: { [subject: string]: number }
): string[] => {
  const recommendations: string[] = [];

  // 게임 참여도 기반 추천
  Object.entries(gameResults).forEach(([gameId, stats]) => {
    if (stats.timesPlayed < 3) {
      recommendations.push(`${gameId} 게임을 더 많이 플레이해보세요.`);
    }
  });

  // 과목별 진도 기반 추천
  Object.entries(progress).forEach(([subject, progressRate]) => {
    if (progressRate < 50) {
      recommendations.push(`${subject} 과목의 학습이 더 필요합니다.`);
    }
  });

  return recommendations;
};

// 알림 설정 업데이트
export const updateNotificationSettings = async (
  parentId: string,
  settings: { notifications?: boolean; weeklyReportEnabled?: boolean }
) => {
  try {
    const parentRef = doc(db, 'parents', parentId);
    await updateDoc(parentRef, settings);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
}; 