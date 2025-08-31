import Phaser from 'phaser';
import { FONT_STYLES, SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../constants';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
  }

  create() {
    this.add
      .text(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.4, 'ラップバトルゲーム', FONT_STYLES.TITLE)
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.6, 'クリックして開始', FONT_STYLES.SUBTITLE)
      .setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start(SCENE_KEYS.LYRICS_SELECT);
    });
  }
}
