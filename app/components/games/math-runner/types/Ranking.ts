export interface RankingEntry {
  id: string;
  playerName: string;
  score: number;
  grade: number;
  date: string;
}

export interface RankingState {
  entries: RankingEntry[];
  isLoading: boolean;
  error: string | null;
} 