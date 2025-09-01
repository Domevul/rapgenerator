import Phaser from 'phaser';
import { FONT_STYLES, SCENE_KEYS } from '../constants';
import { SimpleButton } from '../ui/SimpleButton';

export class ResultScene extends Phaser.Scene {
  private playerScore: number = 0;
  private opponentScore: number = 0;
  private uiElements: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: SCENE_KEYS.RESULT });
  }

  init(data: { playerScore: number, opponentScore: number }) {
    this.playerScore = data.playerScore || 0;
    this.opponentScore = data.opponentScore || 0;
  }

  create() {
    this.createLayout();
    this.scale.on('resize', this.onResize, this);
  }

  private onResize() {
    this.createLayout();
  }

  private createLayout() {
    this.uiElements.forEach(el => el.destroy());
    this.uiElements = [];

    const { width, height } = this.scale;

    let resultText: string;
    let resultStyle: Phaser.Types.GameObjects.Text.TextStyle;

    if (this.playerScore > this.opponentScore) {
      resultText = 'YOU WIN!';
      resultStyle = FONT_STYLES.RESULT_WIN;
    } else if (this.playerScore < this.opponentScore) {
      resultText = 'YOU LOSE...';
      resultStyle = FONT_STYLES.RESULT_LOSE;
    } else {
      resultText = 'DRAW';
      resultStyle = FONT_STYLES.RESULT_DRAW;
    }

    const resultTitle = this.add.text(width / 2, height * 0.3, resultText, resultStyle).setOrigin(0.5);

    const playerScoreText = this.add.text(width / 2, height * 0.5, `Your Score: ${this.playerScore}`, FONT_STYLES.SUBTITLE).setOrigin(0.5);

    const opponentScoreText = this.add.text(width / 2, height * 0.6, `Opponent's Score: ${this.opponentScore}`, FONT_STYLES.SUBTITLE).setOrigin(0.5);

    const playAgainButton = new SimpleButton(this, width / 2, height * 0.75, 'Play Again', () => {
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });

    this.uiElements.push(resultTitle, playerScoreText, opponentScoreText, playAgainButton);
  }

  shutdown() {
    this.scale.off('resize', this.onResize, this);
  }
}
