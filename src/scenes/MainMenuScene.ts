import Phaser from 'phaser';
import { FONT_STYLES, SCENE_KEYS } from '../constants';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
  }

  create() {
    this.add.text(400, 250, 'ラップバトルゲーム', FONT_STYLES.TITLE).setOrigin(0.5);

    this.add.text(400, 350, 'クリックして開始', FONT_STYLES.SUBTITLE).setOrigin(0.5);

    this.input.on('pointerdown', () => {
      this.scene.start(SCENE_KEYS.LYRICS_SELECT);
    });
  }
}
