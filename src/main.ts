import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { LyricsSelectScene } from './scenes/LyricsSelectScene';
import { ResultScene } from './scenes/ResultScene';
import { PreloaderScene } from './scenes/PreloaderScene';
import { GAME_HEIGHT, GAME_WIDTH } from './constants';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'app',
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%',
  },
  scene: [PreloaderScene, MainMenuScene, LyricsSelectScene, BattleScene, ResultScene],
};

new Phaser.Game(config);
