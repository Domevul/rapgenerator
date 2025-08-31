import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    this.add.text(400, 250, 'ラップバトルゲーム', {
      font: '48px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 350, 'クリックして開始', {
      font: '32px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.on('pointerdown', () => {
      this.scene.start('LyricsSelectScene');
    });
  }
}
