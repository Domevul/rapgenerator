import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    this.add.text(400, 250, 'My Game', {
      font: '48px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 350, 'Click to Start', {
      font: '32px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.on('pointerdown', () => {
      this.scene.start('BattleScene');
    });
  }
}
