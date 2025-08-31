# Phaser.js + TypeScript コーディングガイド

## 1. はじめに
このガイドは、Phaser.jsとTypeScriptを使用して、スケーラブルで保守性の高いゲームを開発するためのベストプラクティスをまとめたものです。このプロジェクトは既に多くのベストプラクティスに従っていますが、今後の開発の指針としてご活用ください。

---

## 2. プロジェクト構造
関心事の分離（Separation of Concerns）を意識した、明確なディレクトリ構造を維持します。

```
/src
├── assets/         # 画像、音声、JSONなどの静的アセット
├── scenes/         # ゲームシーン（MainMenu, Battle, etc.）
├── ui/             # 再利用可能なUIコンポーネント（Button, ScrollViewなど）
├── managers/       # グローバルな管理クラス（GameStateManager, AudioManagerなど）
├── constants.ts    # ゲーム全体で使われる定数（物理演算の値、UIのサイズなど）
├── types.ts        # TypeScriptの型定義（interface, type）
└── main.ts         # ゲームのエントリーポイント、Phaserの初期化
```

- **scenes**: ゲームの各画面（状態）をカプセル化します。
- **ui**: 複数のシーンで再利用するUI要素（ボタン、ダイアログ等）をクラスとして定義します。
- **managers**: シーンをまたいで状態を管理したり、音響を制御したりするグローバルなロジックを配置します。

---

## 3. TypeScriptの構成 (`tsconfig.json`)
厳格な型チェックを有効にすることで、多くの潜在的なバグをコンパイル時に検出できます。

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true, // 必須
    "noUnusedLocals": true, // 未使用のローカル変数を禁止
    "noUnusedParameters": true, // 未使用の引数を禁止
    "forceConsistentCasingInFileNames": true, // ファイル名の大文字・小文字を区別
    "moduleResolution": "bundler"
  },
  "include": ["src"]
}
```

- **`"strict": true`**: 型安全性の根幹です。`null`や`undefined`の可能性を常に意識したコーディングが可能になります。
- **`noUnused...`**: コードのクリーンさを保ち、リファクタリングを容易にします。

---

## 4. 状態管理
### 4-1. シーン内での状態管理
各シーンは、自身の状態を`private`プロパティとして保持するべきです。

```typescript
// BattleScene.ts
export class BattleScene extends Phaser.Scene {
    private playerScore: number = 0;
    private currentTurn: number = 1;
    private playerHealth!: Phaser.GameObjects.Image; // !: createで必ず初期化

    create() {
        this.playerScore = 0;
        this.currentTurn = 1;
        this.playerHealth = this.add.image(100, 100, 'health-bar');
    }
}
```
- **`private`**: シーンの内部状態が外部から不用意に変更されるのを防ぎます。
- **`!` (Non-null Assertion Operator)**: `create`メソッドで必ず初期化されるプロパティに使用し、コンパイラに`null`でないことを伝えます。

### 4-2. シーン間のデータ共有
- **単純なデータ**: `this.scene.start('NextScene', { score: 100 });` のように、`init`メソッド経由でデータを渡します。
- **複雑・永続的なデータ**: Phaserの[Registry](https://newdocs.phaser.io/docs/3.70.0/Phaser.Data.DataManager)や、シングルトンパターンを利用した`GameStateManager`クラスを作成して管理します。

```typescript
// GameStateManager.ts (シングルトンの例)
export class GameStateManager {
    private static instance: GameStateManager;
    public score: number = 0;

    private constructor() {}

    public static getInstance(): GameStateManager {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }
}

// シーンでの利用
const gameState = GameStateManager.getInstance();
gameState.score += 10;
```

---

## 5. シーンの実装
### 5-1. シーンキーの定数化
シーンを呼び出す際のキー（文字列）は、タイプミスを防ぎ、IDEの補完を効かせるために定数化します。

```typescript
// constants.ts
export const SCENE_KEYS = {
    PRELOADER: 'PreloaderScene',
    MAIN_MENU: 'MainMenuScene',
    BATTLE: 'BattleScene',
} as const;

// MainMenuScene.ts
import { SCENE_KEYS } from '../constants';
this.scene.start(SCENE_KEYS.BATTLE);
```

### 5-2. ライフサイクルメソッド
Phaserのライフサイクルメソッドを正しく使い分けます。
- **`constructor()`**: シーンキーを設定します。`super({ key: SCENE_KEYS.MAIN_MENU });`
- **`init(data)`**: シーン遷移時にデータを受け取ります。
- **`preload()`**: アセット（画像、音声）をロードします。
- **`create()`**: ゲームオブジェクトを生成・配置します。`init`や`preload`が完了した後に呼ばれます。
- **`update(time, delta)`**: ゲームループごとに呼ばれます。パフォーマンスに影響するため、重い処理は避けます。
- **`shutdown()`**: シーンが停止する際に呼ばれ、イベントリスナーの解除などクリーンアップ処理を行います。

---

## 6. UI開発
### 6-1. 再利用可能なUIコンポーネント
ボタンやカードなど、繰り返し使うUI要素はクラスとしてカプセル化します。`Phaser.GameObjects.Container`を継承すると便利です。

```typescript
// ui/SimpleButton.ts
export class SimpleButton extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void) {
        super(scene, x, y);
        // ... ボタンの背景とテキストを作成 ...
        this.setInteractive(...)
            .on('pointerdown', onClick);
        scene.add.existing(this);
    }
}
```

### 6-2. スタイル（色・フォント）の定数化
UIの色やフォントサイズは定数として一元管理すると、デザインの変更が容易になります。

```typescript
// constants.ts
export const UI_STYLE = {
    FONT_FAMILY: 'Arial',
    FONT_SIZE_NORMAL: '24px',
    COLOR_PRIMARY: '#ffffff',
    COLOR_DANGER: '#ff0000',
} as const;
```

---

## 7. パフォーマンス
- **オブジェクトの再利用**: 弾丸など、大量に生成・破棄されるオブジェクトは、[オブジェクトプール](https://newdocs.phaser.io/docs/3.70.0/Phaser.GameObjects.Group#get)を利用して再利用し、ガベージコレクションの負荷を減らします。
- **`update`ループの最適化**: `update`内で`new`や重い計算を避けます。
- **画像の最適化**: テクスチャアトラス（Texture Atlas）を使い、描画コールを削減します。
- **イベントリスナーのクリーンアップ**: `shutdown`メソッドや、オブジェクトが破棄される際に`off()`や`removeListener()`を呼び、メモリリークを防ぎます。

---

## 8. コードスタイル
- **命名規則**:
  - `class`, `interface`: `PascalCase` (例: `BattleScene`)
  - `function`, `variable`: `camelCase` (例: `playerScore`)
  - `const` (定数): `UPPER_SNAKE_CASE` (例: `BATTLE_BPM`)
- **`private`/`public`**: クラスのメンバーは、外部に公開する必要がなければ`private`を原則とします。
- **Readonly**: 変更されるべきでないプロパティには`readonly`修飾子を付け、不変性（Immutability）を高めます。
  `public readonly sceneKey: string;`
