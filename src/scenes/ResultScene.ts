import Phaser from 'phaser';

export class ResultScene extends Phaser.Scene {
  private playerScore: number = 0;
  private opponentScore: number = 0;

  constructor() {
    super({ key: 'ResultScene' });
  }

  init(data: { playerScore: number, opponentScore: number }) {
    this.playerScore = data.playerScore || 0;
    this.opponentScore = data.opponentScore || 0;
  }

  create() {
    let resultText: string;
    let resultColor: string;

    if (this.playerScore > this.opponentScore) {
      resultText = 'YOU WIN!';
      resultColor = '#00ff00';
    } else if (this.playerScore < this.opponentScore) {
      resultText = 'YOU LOSE...';
      resultColor = '#ff0000';
    } else {
      resultText = 'DRAW';
      resultColor = '#ffff00';
    }

    this.add.text(400, 200, resultText, {
      font: '64px Arial',
      color: resultColor
    }).setOrigin(0.5);

    this.add.text(400, 300, `Your Score: ${this.playerScore}`, {
      font: '32px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 350, `Opponent's Score: ${this.opponentScore}`, {
      font: '32px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    const playAgainButton = this.add.text(400, 450, 'Play Again', {
      font: '32px Arial',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playAgainButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
