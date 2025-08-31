import Phaser from 'phaser';
import { FONT_STYLES, SCENE_KEYS } from '../constants';
import { SimpleButton } from '../ui/SimpleButton';

export class ResultScene extends Phaser.Scene {
  private playerScore: number = 0;
  private opponentScore: number = 0;

  constructor() {
    super({ key: SCENE_KEYS.RESULT });
  }

  init(data: { playerScore: number, opponentScore: number }) {
    this.playerScore = data.playerScore || 0;
    this.opponentScore = data.opponentScore || 0;
  }

  create() {
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

    this.add.text(400, 200, resultText, resultStyle).setOrigin(0.5);

    this.add.text(400, 300, `Your Score: ${this.playerScore}`, FONT_STYLES.SUBTITLE).setOrigin(0.5);

    this.add.text(400, 350, `Opponent's Score: ${this.opponentScore}`, FONT_STYLES.SUBTITLE).setOrigin(0.5);

    new SimpleButton(this, 400, 450, 'Play Again', () => {
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });
  }
}
