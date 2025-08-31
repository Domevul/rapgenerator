import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { LyricsSelectScene } from './scenes/LyricsSelectScene';
import { ResultScene } from './scenes/ResultScene';
import { PreloaderScene } from './scenes/PreloaderScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'app',
    width: '100%',
    height: '100%',
  },
  scene: [PreloaderScene, MainMenuScene, LyricsSelectScene, BattleScene, ResultScene],
};

new Phaser.Game(config);
