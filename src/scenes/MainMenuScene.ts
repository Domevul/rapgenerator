import Phaser from 'phaser';
import { FONT_STYLES, SCENE_KEYS } from '../constants';

export class MainMenuScene extends Phaser.Scene {
  private titleText?: Phaser.GameObjects.Text;
  private startText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
  }

  create() {
    this.createLayout();

    this.input.on('pointerdown', () => {
      this.scale.off('resize', this.onResize, this);
      this.scene.start(SCENE_KEYS.LYRICS_SELECT);
    });

    this.scale.on('resize', this.onResize, this);
  }

  private createLayout(): void {
    // Clear old objects if they exist
    if (this.titleText) this.titleText.destroy();
    if (this.startText) this.startText.destroy();

    const { width, height } = this.scale;

    this.titleText = this.add.text(width * 0.5, height * 0.4, 'ラップバトルゲーム', FONT_STYLES.TITLE).setOrigin(0.5);
    this.startText = this.add.text(width * 0.5, height * 0.6, 'クリックして開始', FONT_STYLES.SUBTITLE).setOrigin(0.5);
  }

  private onResize(): void {
    this.createLayout();
  }

  shutdown() {
    this.scale.off('resize', this.onResize, this);
  }
}
