import Phaser from 'phaser';
import { FONT_STYLES, SCENE_KEYS } from '../constants';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOADER });
  }

  preload() {
    // In a real game, you would load assets here, e.g.:
    // this.load.image('player', 'assets/player.png');
    // this.load.audio('music', 'assets/music.mp3');
  }

  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2, 'Loading...', FONT_STYLES.TITLE).setOrigin(0.5);

    // No assets to load, so transition immediately
    this.scene.start(SCENE_KEYS.MAIN_MENU);
  }
}
