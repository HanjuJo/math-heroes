import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase 초기화
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();

// 익명 로그인
export const signInAnonymousUser = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Anonymous sign in error:', error);
    return null;
  }
};

// 사용자 점수 저장
export const saveScore = async (userId: string, gameId: string, score: number, grade: number) => {
  try {
    const scoreRef = doc(db, 'scores', `${userId}_${gameId}`);
    const scoreDoc = await getDoc(scoreRef);
    
    if (!scoreDoc.exists() || scoreDoc.data().score < score) {
      await setDoc(scoreRef, {
        userId,
        gameId,
        score,
        grade,
        timestamp: new Date().toISOString()
      });
    }
    
    // 게임별 최고 점수 업데이트
    const highScoreRef = doc(db, 'highScores', gameId);
    const highScoreDoc = await getDoc(highScoreRef);
    
    if (!highScoreDoc.exists() || highScoreDoc.data().score < score) {
      await setDoc(highScoreRef, {
        userId,
        score,
        grade,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Score save error:', error);
  }
};

// 게임별 랭킹 조회
export const getGameRanking = async (gameId: string, grade?: number) => {
  try {
    const scoresRef = collection(db, 'scores');
    let q = query(
      scoresRef,
      orderBy('score', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const ranking = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return ranking;
  } catch (error) {
    console.error('Ranking fetch error:', error);
    return [];
  }
};

// 사용자 진행 상황 저장
export const saveProgress = async (userId: string, gameId: string, progress: any) => {
  try {
    const progressRef = doc(db, 'progress', `${userId}_${gameId}`);
    await setDoc(progressRef, {
      ...progress,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Progress save error:', error);
  }
};

// 사용자 진행 상황 조회
export const getProgress = async (userId: string, gameId: string) => {
  try {
    const progressRef = doc(db, 'progress', `${userId}_${gameId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      return progressDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Progress fetch error:', error);
    return null;
  }
}; 