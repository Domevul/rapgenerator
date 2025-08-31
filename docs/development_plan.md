# 開発計画

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
