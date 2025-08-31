import Phaser from 'phaser';
import { GameState, LyricsPattern, TimingResult } from '../types';
import {
  BATTLE_BPM,
  BEAT_INTERVAL,
  LYRICS_PATTERNS,
  PERFECT_TIMING_WINDOW,
  GOOD_TIMING_WINDOW,
} from '../constants';

export class BattleScene extends Phaser.Scene {
  private gameState!: GameState;
  private beatTimer!: Phaser.Time.TimerEvent;
  private nextBeatTime: number = 0;

  // UI Elements
  private playerScoreText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private beatMarker!: Phaser.GameObjects.Text;
  private lyricsButtons: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: 'BattleScene' });
  }

  create() {
    this.gameState = {
      currentTurn: 1,
      playerScore: 0,
      opponentScore: 0, // Not used in prototype
      beatCount: 0,
      gamePhase: 'selecting',
    };

    this.add.text(400, 50, 'BATTLE START', { font: '32px Arial', color: '#ff0000' }).setOrigin(0.5);
    this.playerScoreText = this.add.text(50, 50, `Score: 0`, { font: '24px Arial', color: '#ffffff' });
    this.turnText = this.add.text(750, 50, `Turn: 1/4`, { font: '24px Arial', color: '#ffffff' }).setOrigin(1, 0);
    this.feedbackText = this.add.text(400, 300, '', { font: '48px Arial', color: '#ffff00' }).setOrigin(0.5);
    this.beatMarker = this.add.text(400, 150, '●', { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5).setVisible(false);

    this.createLyricsButtons();
    this.setupBeatTimer();
  }

  private setupBeatTimer(): void {
    this.nextBeatTime = this.time.now + BEAT_INTERVAL;
    this.beatTimer = this.time.addEvent({
      delay: BEAT_INTERVAL,
      callback: this.onBeat,
      callbackScope: this,
      loop: true,
    });
  }

  private onBeat(): void {
    this.gameState.beatCount++;
    this.nextBeatTime = this.time.now + BEAT_INTERVAL;

    // Simple visual feedback for the beat
    this.beatMarker.setVisible(true);
    this.tweens.add({
        targets: this.beatMarker,
        alpha: 0,
        duration: BEAT_INTERVAL / 2,
        ease: 'Power1',
        onComplete: () => {
            this.beatMarker.setVisible(false);
            this.beatMarker.setAlpha(1);
        }
    });

    // Enable input every 4 beats (one measure)
    if (this.gameState.beatCount % 4 === 0) {
      this.feedbackText.setText('SELECT!');
      this.gameState.gamePhase = 'selecting';
      this.toggleLyricsButtons(true);
    }
  }

  private createLyricsButtons(): void {
    // For prototype, just use first 3 attack lyrics
    const sampleLyrics = LYRICS_PATTERNS.slice(0, 3);

    sampleLyrics.forEach((lyric, index) => {
      const button = this.add.text(400, 400 + index * 50, lyric.text.replace('\n', ' / '), {
        font: '20px Arial',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

      button.on('pointerdown', () => {
        this.handlePlayerInput(lyric);
      });

      this.lyricsButtons.push(button);
    });

    this.toggleLyricsButtons(false); // Initially disabled
  }

  private handlePlayerInput(lyric: LyricsPattern): void {
    if (this.gameState.gamePhase !== 'selecting') {
      return;
    }
    this.gameState.gamePhase = 'performing';
    this.toggleLyricsButtons(false);

    const timingError = Math.abs(this.time.now - this.nextBeatTime);
    let timingResult: TimingResult;

    if (timingError <= PERFECT_TIMING_WINDOW) {
      timingResult = { accuracy: 'perfect', score: 50 };
    } else if (timingError <= GOOD_TIMING_WINDOW) {
      timingResult = { accuracy: 'good', score: 30 };
    } else {
      timingResult = { accuracy: 'miss', score: 0 };
    }

    // Add rhyme score
    const totalScore = timingResult.score + lyric.rhymeScore;
    this.gameState.playerScore += totalScore;

    this.updateScoreDisplay();
    this.showFeedback(timingResult, lyric);
    this.advanceTurn();
  }

  private updateScoreDisplay(): void {
    this.playerScoreText.setText(`Score: ${this.gameState.playerScore}`);
  }

  private showFeedback(timing: TimingResult, lyric: LyricsPattern): void {
    const feedback = `${timing.accuracy.toUpperCase()}!\n+${timing.score} (Rhythm)\n+${lyric.rhymeScore} (Rhyme)`;
    this.feedbackText.setText(feedback);

    this.time.delayedCall(1000, () => {
        if (this.gameState.gamePhase !== 'selecting') {
            this.feedbackText.setText('');
        }
    });
  }

  private advanceTurn(): void {
    if (this.gameState.currentTurn < 4) {
      this.gameState.currentTurn++;
      this.turnText.setText(`Turn: ${this.gameState.currentTurn}/4`);
    } else {
      this.endBattle();
    }
  }

  private endBattle(): void {
    this.beatTimer.destroy();
    this.gameState.gamePhase = 'result';
    this.feedbackText.setText(`FINISH!\nFinal Score: ${this.gameState.playerScore}`);
    this.toggleLyricsButtons(false);

    this.time.delayedCall(3000, () => {
        // For now, just restart the main menu
        this.scene.start('MainMenuScene');
    });
  }

  private toggleLyricsButtons(isEnabled: boolean): void {
    this.lyricsButtons.forEach(button => {
        if (isEnabled) {
            button.setInteractive();
            button.setAlpha(1);
        } else {
            button.disableInteractive();
            button.setAlpha(0.5);
        }
    });
  }
}
