import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene';
import { MainMenuScene } from './scenes/MainMenuScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'app',
  scene: [MainMenuScene, BattleScene]
};

new Phaser.Game(config);
