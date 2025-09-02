import type { LyricsPattern } from './types';

export const LYRICS_PATTERNS: LyricsPattern[] = [
  // 攻撃タイプ
  {
    id: 'A1',
    word: '最強',
    collocation: '俺のフロウは...、ビートを支配する\nお前のライムは弱小、勝負にならない',
    type: 'attack',
    rhymeScore: 20,
    countersTo: ['technical'],
  },
  {
    id: 'A2',
    word: 'ステージ',
    collocation: 'ここは俺の...、お前は帰れ\n実力の差を見せてやる、これが真のMC',
    type: 'attack',
    rhymeScore: 25,
    countersTo: ['technical'],
  },
  {
    id: 'A3',
    word: '証明',
    collocation: 'お前のスキルじゃ俺には勝てない\nこのバトルで...する、俺がナンバーワン',
    type: 'attack',
    rhymeScore: 20,
    countersTo: ['technical'],
  },

  // 技巧タイプ
  {
    id: 'B1',
    word: '専門',
    collocation: '韻を踏むのは俺の...、リズムも完璧\n君のスタイルじゃこのバトル、勝利は不可能',
    type: 'technical',
    rhymeScore: 30,
    countersTo: ['counter'],
  },
  {
    id: 'B2',
    word: 'アート',
    collocation: 'ワードプレイで魅せる俺の...\nメタファーとライムで編む最高のパート',
    type: 'technical',
    rhymeScore: 30,
    countersTo: ['counter'],
  },
  {
    id: 'B3',
    word: '武器',
    collocation: 'フロウとビートが俺の...\n音楽と言葉で作る完璧な仕組み',
    type: 'technical',
    rhymeScore: 25,
    countersTo: ['counter'],
  },

  // カウンタータイプ
  {
    id: 'C1',
    word: 'スタイル',
    collocation: 'そんな挑発じゃ俺は動じない\n冷静にライムで返すのが俺の...',
    type: 'counter',
    rhymeScore: 15,
    countersTo: ['attack'],
  },
  {
    id: 'C2',
    word: '逆転',
    collocation: 'お前の攻撃は見透かした\n今度は俺のターン、...開始だ',
    type: 'counter',
    rhymeScore: 15,
    countersTo: ['attack'],
  },
  {
    id: 'C3',
    word: '結果',
    collocation: '弱い犬ほどよく吠える、俺は...で語る\n最後に笑うのは誰か、もうすぐ分かる',
    type: 'counter',
    rhymeScore: 20,
    countersTo: ['attack'],
  },

  // クロージングタイプ
  {
    id: 'D1',
    word: '確定',
    collocation: 'これで決着、俺の勝利は...\nお前もよく頑張った、でも俺が上だ',
    type: 'closing',
    rhymeScore: 10,
    countersTo: [],
  },
  {
    id: 'D2',
    word: '証明',
    collocation: '4ターンかけて...した、俺のスキルの高さ\n次回があるならまた来い、今日は俺の勝ち',
    type: 'closing',
    rhymeScore: 10,
    countersTo: [],
  },
  {
    id: 'D3',
    word: '締めくくる',
    collocation: '最後のライムで...、この勝負は俺のもの\n観客も納得の結果だろう、お疲れ様でした',
    type: 'closing',
    rhymeScore: 10,
    countersTo: [],
  },
];

export const BATTLE_BPM = 90;
export const BEAT_INTERVAL = 60000 / BATTLE_BPM; // ms per beat
export const PERFECT_TIMING_WINDOW = 60; // ms
export const GREAT_TIMING_WINDOW = 120; // ms
export const GOOD_TIMING_WINDOW = 200; // ms

export const SCENE_KEYS = {
  PRELOADER: 'PreloaderScene',
  MAIN_MENU: 'MainMenuScene',
  LYRICS_SELECT: 'LyricsSelectScene',
  BATTLE: 'BattleScene',
  RESULT: 'ResultScene',
} as const;

export const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#212121',
  GREY: '#757575',
  LIGHT_GREY: '#E0E0E0',
  DARK_GREY: '#F5F5F5',
  GREEN: '#4CAF50',
  RED: '#F44336',
  YELLOW: '#FFEB3B',
  PRIMARY: '#2196F3',
  SECONDARY: '#E0E0E0',
  TERTIARY: '#E91E63',
} as const;

export const FONT_STYLES = {
  TITLE: { font: '84px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.BLACK },
  SUBTITLE: { font: '56px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.BLACK },
  BODY: { font: '42px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.BLACK },
  BUTTON: { font: '52px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.BLACK, backgroundColor: COLORS.SECONDARY, padding: { x: 15, y: 8 } },
  LYRIC_TEXT: { font: '36px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.BLACK, backgroundColor: COLORS.DARK_GREY, padding: { x: 15, y: 15 } },
  BATTLE_FEEDBACK: { font: '56px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.PRIMARY, align: 'center' },
  BATTLE_OPPONENT_ACTION: { font: '42px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.TERTIARY, align: 'center' },
  RESULT_WIN: { font: '112px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.GREEN },
  RESULT_LOSE: { font: '112px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.RED },
  RESULT_DRAW: { font: '112px "M PLUS Rounded 1c", Arial, sans-serif', color: COLORS.YELLOW },
} as const;
