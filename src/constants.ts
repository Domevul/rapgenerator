import { LyricsPattern } from './types';

export const LYRICS_PATTERNS: LyricsPattern[] = [
  // 攻撃タイプ
  {
    id: 'A1',
    text: '俺のフロウは最強、ビートを支配する\nお前のライムは弱小、勝負にならない',
    type: 'attack',
    rhymeScore: 20,
    countersTo: ['technical'],
  },
  {
    id: 'A2',
    text: 'ここは俺のステージ、お前は帰れ\n実力の差を見せてやる、これが真のMC',
    type: 'attack',
    rhymeScore: 25,
    countersTo: ['technical'],
  },
  {
    id: 'A3',
    text: 'お前のスキルじゃ俺には勝てない\nこのバトルで証明する、俺がナンバーワン',
    type: 'attack',
    rhymeScore: 20,
    countersTo: ['technical'],
  },

  // 技巧タイプ
  {
    id: 'B1',
    text: '韻を踏むのは俺の専門、リズムも完璧\n君のスタイルじゃこのバトル、勝利は不可能',
    type: 'technical',
    rhymeScore: 30,
    countersTo: ['counter'],
  },
  {
    id: 'B2',
    text: 'ワードプレイで魅せる俺のアート\nメタファーとライムで編む最高のパート',
    type: 'technical',
    rhymeScore: 30,
    countersTo: ['counter'],
  },
  {
    id: 'B3',
    text: 'フロウとビートが俺の武器\n音楽と言葉で作る完璧な仕組み',
    type: 'technical',
    rhymeScore: 25,
    countersTo: ['counter'],
  },

  // カウンタータイプ
  {
    id: 'C1',
    text: 'そんな挑発じゃ俺は動じない\n冷静にライムで返すのが俺のスタイル',
    type: 'counter',
    rhymeScore: 15,
    countersTo: ['attack'],
  },
  {
    id: 'C2',
    text: 'お前の攻撃は見透かした\n今度は俺のターン、逆転開始だ',
    type: 'counter',
    rhymeScore: 15,
    countersTo: ['attack'],
  },
  {
    id: 'C3',
    text: '弱い犬ほどよく吠える、俺は結果で語る\n最後に笑うのは誰か、もうすぐ分かる',
    type: 'counter',
    rhymeScore: 20,
    countersTo: ['attack'],
  },

  // クロージングタイプ
  {
    id: 'D1',
    text: 'これで決着、俺の勝利は確定\nお前もよく頑張った、でも俺が上だ',
    type: 'closing',
    rhymeScore: 10,
    countersTo: [],
  },
  {
    id: 'D2',
    text: '4ターンかけて証明した、俺のスキルの高さ\n次回があるならまた来い、今日は俺の勝ち',
    type: 'closing',
    rhymeScore: 10,
    countersTo: [],
  },
  {
    id: 'D3',
    text: '最後のライムで締めくくる、この勝負は俺のもの\n観客も納得の結果だろう、お疲れ様でした',
    type: 'closing',
    rhymeScore: 10,
    countersTo: [],
  },
];

export const BATTLE_BPM = 90;
export const BEAT_INTERVAL = 60000 / BATTLE_BPM; // ms per beat
export const PERFECT_TIMING_WINDOW = 50; // ms
export const GOOD_TIMING_WINDOW = 100; // ms
