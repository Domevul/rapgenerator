// 歌詞パターンデータ
export interface LyricsPattern {
  id: string;
  text: string;
  type: 'attack' | 'technical' | 'counter' | 'closing';
  rhymeScore: number;
  countersTo: Array<'attack' | 'technical' | 'counter' | 'closing'>;
}

// ゲーム状態
export interface GameState {
  currentTurn: number;
  playerScore: number;
  opponentScore: number;
  beatCount: number;
  gamePhase: 'selecting' | 'performing' | 'waiting' | 'result';
  opponentLyric: LyricsPattern | null;
}

// Scene間データ共有
export interface GameData {
  selectedPatterns: LyricsPattern[];
  difficulty: 'easy' | 'normal' | 'hard';
  musicBPM: number;
}

// タイミング判定
export interface TimingResult {
  accuracy: 'perfect' | 'great' | 'good' | 'miss';
  score: number;
}
