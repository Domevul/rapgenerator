#ラップバトルゲーム - 改訂版企画書

## ゲーム概要
- **ジャンル**: リズムアクション + デッキ構築
- **プラットフォーム**: ブラウザ
- **プレイ時間**: 15分（チャプター1）
- **開発規模**: 個人開発
- **コア体験**: 事前のワード選択戦略とリアルタイムリズム判定の融合

## コアゲームループ

### 1. 事前準備フェーズ（歌詞構築）

#### 1-1. 歌詞パターン選択システム
- **選択方式**: 3-4つの完成歌詞パターンから1つを選択
- **歌詞構成**: 各パターンは4行構成（1ターン分）
- **韻構造**: 各パターンで韻の踏み方が異なる（AA-BB型、AB-AB型等）
- **戦略要素**: 相手のスタイルや前ターンの内容に応じた歌詞選択

#### 1-2. 歌詞パターン例
```
パターンA（攻撃的）:
- word: 「最強」
- collocation: 「俺のフロウは...、ビートを支配する / お前のライムは弱小、勝負にならない」

パターンB（技巧的）:
- word: 「専門」
- collocation: 「韻を踏むのは俺の...、リズムも完璧 / 君のスタイルじゃこのバトル、勝利は不可能」

パターンC（挑発的）:
- word: 「ステージ」
- collocation: 「ここは俺の...、お前は帰れ / 実力の差を見せてやる、これが真のMC」
```

### 2. バトルフェーズ（リアルタイム）

#### 2-1. 歌詞選択とリズム判定
- **UI**: 事前選択した3-4の歌詞パターンがボタンとして表示
- **操作**: 相手のラップを聞いた後、適切な歌詞を選択してタップ
- **リズム判定**: 選択後、ビートに合わせて歌詞を「発動」
- **判定**: Perfect / Great / Goodの3段階精度判定
  - **Perfect**: ±30ms (コード内: 60ms window)
  - **Great**: ±60ms (コード内: 120ms window)
  - **Good**: ±100ms (コード内: 200ms window)

#### 2-2. ターン構成
- **総ターン数**: 4ターン
- **1ターン構成**: 4小節（16拍）
- **進行順序**:
  1. 相手のラップ（固定パフォーマンス）
  2. 自分のラップ（プレイヤー操作）
  3. 以下交互に4ターンまで継続

#### 2-3. 分岐システム（簡素化）
- **分岐タイミング**: 3-4ターン目のみ
- **分岐パターン**: 2通りの展開
- **分岐条件**: 1-2ターン目の総合スコアに基づく
  - 高スコア: 相手が本気モードで挑発的な内容
  - 低スコア: 相手が優勢で余裕のある内容

### 3. 評価システム

#### 3-1. スコア算出
- **歌詞選択得点**: 相手のラップに対する適切性（0-50点）
  - 攻撃的ラップに対して攻撃的歌詞で返す等の適合性
- **リズム得点**: タイミング精度（Perfect: 50点、Great: 30点、Good: 15点）
- **韻評価得点**: 選択した歌詞の韻の巧みさ（事前定義済み、0-30点）
- **合計**: 各ターン最大130点、4ターンで勝敗判定

#### 3-2. 視覚的フィードバック
- **良い選択**: 観客の歓声、「Yeah!」「Nice!」の表示
- **微妙な選択**: 観客の静寂、「...」の表示
- **悪い選択**: 観客から「？」マーク、ブーイング
- **Perfect判定**: 特別なビジュアルエフェクト、画面フラッシュ

#### 3-3. 勝利条件
- **判定**: 4ターン終了後の累積スコアで勝敗決定
- **演出**: 最終ジャッジで観客とMCの反応により結果表現
- **勝利**: 相手より総合得点が高い場合

## チャプター1仕様

### 対戦相手
- **キャラクター**: 初心者向けNPC「MC Rookie」
- **特徴**: 基本的な韻とシンプルなフロウを使用
- **難易度**: BPM90の楽曲、複雑な韻パターンなし

### 使用可能歌詞パターン（12個）

**攻撃タイプ**
- A1「俺のフロウは最強、ビートを支配する / お前のライムは弱小、勝負にならない」
- A2「ここは俺のステージ、お前は帰れ / 実力の差を見せてやる、これが真のMC」
- A3「お前のスキルじゃ俺には勝てない / このバトルで証明する、俺がナンバーワン」

**技巧タイプ**
- B1「韻を踏むのは俺の専門、リズムも完璧 / 君のスタイルじゃこのバトル、勝利は不可能」
- B2「ワードプレイで魅せる俺のアート / メタファーとライムで編む最高のパート」
- B3「フロウとビートが俺の武器 / 音楽と言葉で作る完璧な仕組み」

**カウンタータイプ**
- C1「そんな挑発じゃ俺は動じない / 冷静にライムで返すのが俺のスタイル」
- C2「お前の攻撃は見透かした / 今度は俺のターン、逆転開始だ」
- C3「弱い犬ほどよく吠える、俺は結果で語る / 最後に笑うのは誰か、もうすぐ分かる」

**クロージングタイプ**
- D1「これで決着、俺の勝利は確定 / お前もよく頑張った、でも俺が上だ」
- D2「4ターンかけて証明した、俺のスキルの高さ / 次回があるならまた来い、今日は俺の勝ち」
- D3「最後のライムで締めくくる、この勝負は俺のもの / 観客も納得の結果だろう、お疲れ様でした」

### 段階的チュートリアル
1. **Step 1**: 固定ワードでのリズム練習
2. **Step 2**: 事前ワード選択の練習
3. **Step 3**: 実際のバトル体験

## 技術仕様

### 採用技術スタック
- **ゲームエンジン**: Phaser.js 3.70+ + TypeScript
- **ビルドツール**: Vite
- **音響処理**: Phaser Audio（WebAudio APIベース）
- **開発手法**: AI駆動開発（Claude/GPT活用）

### システム要件
1. **BGM・効果音再生**: Phaser Audio Systemによる高精度音楽制御
2. **ゲームループ**: Phaser Scene管理による安定した60FPS描画
3. **リズム判定**: Timer Eventによるビート同期とタイミング精度測定
4. **UI**: Phaserスケールマネージャーを活用したフルスクリーンレスポンシブUI

### Scene構成
1. **MainMenuScene**: タイトル画面・設定
2. **LyricsSelectScene**: 歌詞パターン選択画面
3. **BattleScene**: メインゲームプレイ画面
4. **ResultScene**: 結果表示・スコア確認

### データ構造
```typescript
// 歌詞パターンデータ
interface LyricsPattern {
  id: string;
  word: string;
  collocation: string;
  type: 'attack' | 'technical' | 'counter' | 'closing';
  rhymeScore: number;
  countersTo: Array<'attack' | 'technical' | 'counter' | 'closing'>;
}

// ゲーム状態
interface GameState {
  currentTurn: number;
  playerScore: number;
  opponentScore: number;
  beatCount: number;
  gamePhase: 'selecting' | 'performing' | 'waiting' | 'result';
  opponentLyric: LyricsPattern | null; // 現在の相手の歌詞
}

// Scene間データ共有
interface GameData {
  selectedPatterns: LyricsPattern[]; // LyricsSelectSceneからBattleSceneへ渡される
  difficulty: 'easy' | 'normal' | 'hard';
  musicBPM: number;
}

// タイミング判定
interface TimingResult {
  accuracy: 'perfect' | 'great' | 'good' | 'miss';
  timestamp: number;
}
```

### Phaser実装の特徴

```typescript
// main.tsでのPhaser設定例
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'app',
    mode: Phaser.Scale.RESIZE, // ウィンドウサイズに応じてリサイズ
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%',
  },
  scene: [PreloaderScene, MainMenuScene, LyricsSelectScene, BattleScene, ResultScene],
};

new Phaser.Game(config);
```

### レスポンシブUIとレイアウト

本ゲームは、多様な画面サイズに対応するため、レスポンシブデザインを採用しています。

#### 1. 相対的なUI要素の配置
UI要素は、固定のピクセル座標ではなく、現在の画面サイズに対する相対的な位置に配置されます。これにより、ウィンドウサイズが変更されてもレイアウトが維持されます。

- **実装**: 各シーンの `create` やレイアウト更新メソッド内で `this.scale.width` と `this.scale.height` を使用して座標を計算します。
- **例**:
  - 画面中央: `this.scale.width * 0.5`
  - 画面下部: `this.scale.height - 50`

#### 2. スクロール可能なリスト
`LyricsSelectScene`のようにコンテンツが画面の高さを超える可能性がある場合、スクロール可能なコンテナを実装します。

- `Phaser.GameObjects.Container` にコンテンツを格納します。
- `Graphics` オブジェクトでマスクを作成し、表示領域を限定します。
- マウスの `wheel` イベントをリッスンし、コンテナのY座標を動かしてスクロールを実現します。

#### 3. 動的なレイアウト更新
ウィンドウのリサイズに対応するため、`resize`イベントを監視し、レイアウトを再計算・再配置する処理を実装します。

```typescript
// LyricsSelectSceneでのレスポンシブ対応例
export class LyricsSelectScene extends Phaser.Scene {

  create() {
    this.createLayout(); // 初期レイアウト作成
    this.scale.on('resize', this.onResize, this); // リサイズイベントの監視
  }

  private onResize(gameSize: Phaser.Structs.Size): void {
    // このメソッドでUI要素の再配置やマスクの再生成を行う
    this.createLayout();
  }

  private createLayout(): void {
    // UI要素を this.scale.width と this.scale.height を基準に配置
    const title = this.add.text(this.scale.width * 0.5, 50, '歌詞を4つ選択', ...);
    const startButton = this.add.text(this.scale.width * 0.5, this.scale.height - 50, 'バトル開始', ...);

    // スクロールエリアも画面サイズに基づいて設定
    const scrollAreaY = 120;
    const scrollAreaHeight = this.scale.height - 200;
    // ...マスクやコンテナのセットアップ...
  }
}
```

## 開発フェーズ

### Phase 1: Phaserベースプロトタイプ（1週間）
**目標**: 基本ゲームループの確立
- **BattleScene実装**: 1つのSceneで完結するプロトタイプ
- **音楽同期システム**: Phaser Timer Eventによるビート管理
- **基本UI**: 3つの歌詞選択ボタン＋タイミング判定表示
- **評価システム**: シンプルなスコア計算とフィードバック

**技術実装内容**:
```typescript
// 最小限のScene構成
class PrototypeScene extends Phaser.Scene {
  // ビート管理
  private setupBeatSystem(): void
  // 歌詞選択UI
  private createLyricsInterface(): void
  // タイミング判定
  private handlePlayerInput(): TimingResult
  // スコア表示
  private updateScoreDisplay(): void
}
```

**成果物**:
- 4ターン完走可能な動作するゲーム
- 音楽とゲームプレイの基本同期
- 勝敗判定とスコア表示

### Phase 2: Scene分離とUI向上（1週間）
**目標**: 本格的なゲーム構造への発展
- **Scene管理**: MainMenu → LyricsSelect → Battle → Result
- **状態管理**: Scene間でのデータ共有システム
- **歌詞選択画面**: 12パターンの歌詞から選択するUI
- **演出強化**: トランジションアニメーションとエフェクト

**技術実装内容**:
```typescript
// Scene遷移管理
class GameManager {
  private sceneData: GameData;
  public transitionTo(sceneName: string, data?: any): void
}

// 歌詞選択Scene
class LyricsSelectScene extends Phaser.Scene {
  private displayLyricsOptions(): void
  private validateSelection(): boolean
  private proceedToBattle(): void
}
```

**成果物**:
- 完全なScene遷移システム
- 戦略的な歌詞選択体験
- ゲームとしての完成度向上

### Phase 3: 分岐・演出・ポリッシュ（1週間）
**目標**: 商品レベルのゲーム体験
- **動的分岐**: プレイヤーパフォーマンスに応じたNPC反応変化
- **視覚演出**: パーティクルエフェクト、画面シェイク、フラッシュ
- **音響演出**: 効果音、観客反応サウンド
- **最終調整**: バランス調整、バグ修正、パフォーマンス最適化

**技術実装内容**:
```typescript
// 演出システム
class EffectManager {
  public showParticleEffect(type: string): void
  public playAudienceReaction(level: number): void
  public screenShake(intensity: number): void
}

// 分岐システム
class NPCBehavior {
  public generateResponse(playerPerformance: number): LyricsPattern
}
```

**成果物**:
- 完成版ゲーム
- チュートリアルとヘルプ
- 最終的な演出とポリッシュ

## 成功指標
- **技術的達成**: 3週間以内での完成
- **ゲーム性**: Scene遷移の滑らかさとリズム同期精度
- **プレイ体験**: 60FPS維持とタイミング判定の正確性
- **AI開発効率**: TypeScriptによるコード品質とPhaserサンプル活用度

## リスクと対策
- **Phaser学習コスト**: AI支援により既存サンプルを活用して迅速習得
- **音楽同期精度**: Phaser Timer Eventの高精度タイミング制御で対応
- **モバイル対応**: Phaser標準のタッチイベント処理で対応
- **パフォーマンス**: WebGLレンダラーによる安定した60FPS維持
