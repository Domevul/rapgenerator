import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene';
import { TitleScene } from './scenes/TitleScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'app',
  scene: [TitleScene, BattleScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 200 }
    }
  }
};

new Phaser.Game(config);
