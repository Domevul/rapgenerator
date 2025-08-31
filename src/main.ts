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
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloaderScene, MainMenuScene, LyricsSelectScene, BattleScene, ResultScene],
};

new Phaser.Game(config);
