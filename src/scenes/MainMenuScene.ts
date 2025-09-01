import Phaser from 'phaser';
import { FONT_STYLES, SCENE_KEYS } from '../constants';

export class MainMenuScene extends Phaser.Scene {
  private uiElements: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
  }

  create() {
    this.createLayout();
    this.scale.on('resize', this.onResize, this);

    this.input.once('pointerdown', () => {
      this.scene.start(SCENE_KEYS.LYRICS_SELECT);
    });
  }

  private onResize() {
    this.createLayout();
  }

  private createLayout() {
    this.uiElements.forEach(el => el.destroy());
    this.uiElements = [];

    const { width, height } = this.scale;

    const title = this.add
      .text(width * 0.5, height * 0.4, 'ラップバトルゲーム', FONT_STYLES.TITLE)
      .setOrigin(0.5);

    const startText = this.add
      .text(width * 0.5, height * 0.6, 'クリックして開始', FONT_STYLES.SUBTITLE)
      .setOrigin(0.5);

    this.uiElements.push(title, startText);
  }

  shutdown() {
    this.scale.off('resize', this.onResize, this);
  }
}
