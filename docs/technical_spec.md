# 技術仕様

## 採用技術スタック
- **ゲームエンジン**: Phaser.js 3.70+ + TypeScript
- **ビルドツール**: Vite
- **音響処理**: Phaser Audio（WebAudio APIベース）
- **開発手法**: AI駆動開発（Claude/GPT活用）

## システム要件
1. **BGM・効果音再生**: Phaser Audio Systemによる高精度音楽制御
2. **ゲームループ**: Phaser Scene管理による安定した60FPS描画
3. **リズム判定**: Timer Eventによるビート同期とタイミング精度測定
4. **UI**: Phaser GameObjectsによるレスポンシブゲームUI

## Scene構成
1. **MainMenuScene**: タイトル画面・設定
2. **LyricsSelectScene**: 歌詞パターン選択画面
3. **BattleScene**: メインゲームプレイ画面
4. **ResultScene**: 結果表示・スコア確認

## データ構造
```typescript
// 歌詞パターンデータ
interface LyricsPattern {
  id: string;
  text: string;
  type: 'attack' | 'technical' | 'counter' | 'closing';
  rhymeScore: number;
  countersTo: string[];
}

// ゲーム状態
interface GameState {
  currentTurn: number;
  selectedLyrics: LyricsPattern | null;
  playerScore: number;
  opponentScore: number;
  beatCount: number;
  gamePhase: 'selecting' | 'performing' | 'waiting';
}

// Scene間データ共有
interface GameData {
  selectedPatterns: LyricsPattern[];
  difficulty: 'easy' | 'normal' | 'hard';
  musicBPM: number;
}

// タイミング判定
interface TimingResult {
  accuracy: 'perfect' | 'good' | 'miss';
  score: number;
  timestamp: number;
}
```

## Phaser実装の特徴
```typescript
// BattleScene実装例
class BattleScene extends Phaser.Scene {
  private beatTimer!: Phaser.Time.TimerEvent;
  private gameState: GameState;

  create() {
    // 音楽開始とビート同期
    this.sound.play('battleBgm');
    this.setupBeatTimer();

    // UI要素配置
    this.createLyricsButtons();
    this.createScoreDisplay();
  }

  private setupBeatTimer(): void {
    const beatInterval = 60000 / 90; // BPM90
    this.beatTimer = this.time.addEvent({
      delay: beatInterval,
      callback: this.onBeat,
      loop: true
    });
  }

  private onBeat(): void {
    this.gameState.beatCount++;
    this.showBeatMarker();

    if (this.gameState.beatCount % 4 === 0) {
      this.enablePlayerInput();
    }
  }
}
```
