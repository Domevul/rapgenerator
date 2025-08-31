import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  create() {
    this.add.text(400, 300, 'Hello World from BattleScene!', {
      font: '32px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);
  }
}
