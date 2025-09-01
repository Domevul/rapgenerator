import Phaser from 'phaser';
import { FONT_STYLES, SCENE_KEYS } from '../constants';
import { TextButton, TextButtonOptions } from '../ui/components';

export class MainMenuScene extends Phaser.Scene {
  private uiElements: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
  }

  create() {
    this.createLayout();
    this.scale.on('resize', this.onResize, this);
  }

  private onResize() {
    this.createLayout();
  }

  private createLayout() {
    // Stop any running tweens and clear previous elements
    this.tweens.killAll();
    this.uiElements.forEach(el => el.destroy());
    this.uiElements = [];

    const { width, height } = this.scale;

    const title = this.add
      .text(width * 0.5, height * 0.4, 'ラップバトルゲーム', FONT_STYLES.TITLE)
      .setOrigin(0.5);

    // Add a subtle pulsing animation to the title
    this.tweens.add({
        targets: title,
        scale: 1.05,
        duration: 1500,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    const startButton = new TextButton(
      this,
      TextButtonOptions.primary({
        textConfig: { text: 'ゲーム開始', style: FONT_STYLES.BUTTON },
        padding: 15,
        cornerRadius: 8,
        onClick: () => {
          this.scene.start(SCENE_KEYS.LYRICS_SELECT);
        },
      }),
    ).setPosition(width * 0.5, height * 0.65);
    this.add.existing(startButton);


    this.uiElements.push(title, startButton);
  }

  shutdown() {
    this.tweens.killAll();
    this.scale.off('resize', this.onResize, this);
  }
}
