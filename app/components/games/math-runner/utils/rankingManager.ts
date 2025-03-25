import { RankingEntry } from '../types/Ranking';

const RANKING_STORAGE_KEY = 'math_runner_rankings';

export function saveScore(playerName: string, score: number, grade: number): void {
  const rankings = loadRankings();
  const newEntry: RankingEntry = {
    id: Math.random().toString(36).substr(2, 9),
    playerName,
    score,
    grade,
    date: new Date().toISOString()
  };

  rankings.push(newEntry);
  rankings.sort((a, b) => b.score - a.score);
  
  // 상위 100개만 유지
  const topRankings = rankings.slice(0, 100);
  localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(topRankings));
}

export function loadRankings(): RankingEntry[] {
  const rankingsJson = localStorage.getItem(RANKING_STORAGE_KEY);
  if (!rankingsJson) return [];
  return JSON.parse(rankingsJson);
}

export function getTopRankings(grade?: number, limit: number = 10): RankingEntry[] {
  const rankings = loadRankings();
  const filteredRankings = grade
    ? rankings.filter(entry => entry.grade === grade)
    : rankings;
  return filteredRankings.slice(0, limit);
}

export function getPlayerRank(score: number, grade?: number): number {
  const rankings = loadRankings();
  const filteredRankings = grade
    ? rankings.filter(entry => entry.grade === grade)
    : rankings;
  return filteredRankings.filter(entry => entry.score > score).length + 1;
}

export function clearRankings(): void {
  localStorage.removeItem(RANKING_STORAGE_KEY);
} 