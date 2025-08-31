import Phaser from 'phaser';
import type { GameState, LyricsPattern, TimingResult } from '../types';
import { BEAT_INTERVAL, PERFECT_TIMING_WINDOW, GOOD_TIMING_WINDOW, LYRICS_PATTERNS, SCENE_KEYS, FONT_STYLES, COLORS } from '../constants';

export class BattleScene extends Phaser.Scene {
  private gameState!: GameState;
  private beatTimer!: Phaser.Time.TimerEvent;
  private nextBeatTime: number = 0;
  private playerLyrics: LyricsPattern[] = [];
  private opponentLyrics: LyricsPattern[] = []; // For MC Rookie
  private backgroundMusic!: Phaser.Sound.BaseSound;

  // UI Elements
  private battleStartText?: Phaser.GameObjects.Text;
  private playerScoreText!: Phaser.GameObjects.Text;
  private opponentScoreText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private opponentActionText!: Phaser.GameObjects.Text;
  private beatMarker!: Phaser.GameObjects.Text;
  private lyricsButtons: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: SCENE_KEYS.BATTLE });
  }

  init(data: { selectedLyrics: LyricsPattern[] }) {
    // Receive selected lyrics from the previous scene, with a fallback for testing
    this.playerLyrics = data.selectedLyrics || LYRICS_PATTERNS.slice(0, 4);
    // For "MC Rookie", the opponent chooses from a basic pool of lyrics.
    this.opponentLyrics = LYRICS_PATTERNS.filter(p => p.type === 'attack' || p.type === 'technical');
  }

  create() {
    this.gameState = {
      currentTurn: 1,
      playerScore: 0,
      opponentScore: 0,
      beatCount: 0,
      gamePhase: 'waiting', // Start with opponent's turn
      opponentLyric: null,
    };

    this.createLayout();
    this.setupBeatTimer();

    this.scale.on('resize', this.onResize, this);
  }

  private createLayout(): void {
    const { width, height } = this.scale;

    // Destroy existing UI elements before redrawing
    if (this.battleStartText) this.battleStartText.destroy();
    if (this.playerScoreText) this.playerScoreText.destroy();
    if (this.opponentScoreText) this.opponentScoreText.destroy();
    if (this.turnText) this.turnText.destroy();
    if (this.feedbackText) this.feedbackText.destroy();
    if (this.opponentActionText) this.opponentActionText.destroy();
    if (this.beatMarker) this.beatMarker.destroy();
    this.lyricsButtons.forEach(b => b.destroy());
    this.lyricsButtons = [];

    // Top UI Elements
    const topMargin = height * 0.05;
    const scoreOffset = width * 0.05;

    this.battleStartText = this.add.text(width * 0.5, topMargin, 'BATTLE START', { ...FONT_STYLES.SUBTITLE, color: COLORS.RED }).setOrigin(0.5);
    this.playerScoreText = this.add.text(scoreOffset, topMargin, `YOU: ${this.gameState.playerScore}`, { ...FONT_STYLES.BODY, color: COLORS.GREEN }).setOrigin(0, 0.5);
    this.opponentScoreText = this.add.text(width - scoreOffset, topMargin, `CPU: ${this.gameState.opponentScore}`, { ...FONT_STYLES.BODY, color: COLORS.RED }).setOrigin(1, 0.5);
    this.turnText = this.add.text(width * 0.5, topMargin + 40, `Turn: ${this.gameState.currentTurn}/4`, FONT_STYLES.BODY).setOrigin(0.5);

    // Mid-Screen Action/Feedback
    this.opponentActionText = this.add.text(width * 0.5, height * 0.3, '', FONT_STYLES.BATTLE_OPPONENT_ACTION).setOrigin(0.5);
    this.feedbackText = this.add.text(width * 0.5, height * 0.45, '', FONT_STYLES.BATTLE_FEEDBACK).setOrigin(0.5);
    this.beatMarker = this.add.text(width * 0.5, height * 0.2, '●', FONT_STYLES.SUBTITLE).setOrigin(0.5).setVisible(false);

    this.backgroundMusic = this.sound.add('battle-music', { loop: true });
    this.backgroundMusic.play();

    this.createLyricsButtons();
    this.updateScoreDisplay(); // Ensure score is up-to-date after redraw
  }

  private onResize(): void {
    this.createLayout();
  }

  private setupBeatTimer(): void {
    this.nextBeatTime = this.time.now;
    this.beatTimer = this.time.addEvent({
      delay: BEAT_INTERVAL,
      callback: this.onBeat,
      callbackScope: this,
      loop: true,
    });
  }

  private onBeat(): void {
    this.gameState.beatCount++;
    this.nextBeatTime += BEAT_INTERVAL;

    this.beatMarker.setVisible(true);
    this.tweens.add({ targets: this.beatMarker, alpha: 0, duration: BEAT_INTERVAL / 2, onComplete: () => this.beatMarker.setAlpha(1).setVisible(false) });

    // The game loop is based on an 8-beat cycle (2 measures)
    if (this.gameState.beatCount % 8 === 1) { // On the 1st beat, the opponent performs
        this.opponentTurn();
    } else if (this.gameState.beatCount % 8 === 5) { // On the 5th beat, it's the player's turn to respond
        this.playerTurn();
    }
  }

  private opponentTurn() {
    this.gameState.gamePhase = 'waiting';
    this.toggleLyricsButtons(false);

    const opponentChoice = this.opponentLyrics[Phaser.Math.Between(0, this.opponentLyrics.length - 1)];
    this.gameState.opponentLyric = opponentChoice;

    // Simplified scoring for opponent
    const opponentRhythmScore = Math.random() > 0.2 ? 50 : 30; // 80% chance of Perfect
    const opponentTurnScore = opponentRhythmScore + opponentChoice.rhymeScore;
    this.gameState.opponentScore += opponentTurnScore;
    this.updateScoreDisplay();

    this.opponentActionText.setText(`[CPU] ${opponentChoice.text.replace('\n', ' / ')}`);
    this.feedbackText.setText('');
  }

  private playerTurn() {
    this.feedbackText.setText('YOUR TURN: SELECT!');
    this.gameState.gamePhase = 'selecting';
    this.toggleLyricsButtons(true);
  }

  private createLyricsButtons(): void {
    const { width, height } = this.scale;
    const buttonStyle = { ...FONT_STYLES.LYRIC_TEXT, font: '16px Arial', padding: { x: 10, y: 5 }, wordWrap: { width: width * 0.8 } };

    const isPortrait = height > width;

    this.playerLyrics.forEach((lyric, index) => {
      let xPos, yPos;
      if (isPortrait) {
        // Single column layout for portrait mode
        xPos = width * 0.5;
        yPos = height * 0.65 + index * 60;
      } else {
        // 2x2 grid for landscape mode
        xPos = width * 0.3 + (index % 2) * (width * 0.4);
        yPos = height * 0.7 + Math.floor(index / 2) * 70;
      }

      const button = this.add.text(xPos, yPos, lyric.text.replace('\n', ' / '), buttonStyle)
        .setOrigin(0.5).setInteractive();

      button.on('pointerdown', () => this.handlePlayerInput(lyric));
      this.lyricsButtons.push(button);
    });
    this.toggleLyricsButtons(this.gameState.gamePhase === 'selecting');
  }

  private handlePlayerInput(lyric: LyricsPattern): void {
    if (this.gameState.gamePhase !== 'selecting') return;

    this.gameState.gamePhase = 'performing';
    this.toggleLyricsButtons(false);

    // Scoring is based on three components as per the spec:

    // 1. Rhythm Score: Based on timing accuracy
    const timingError = Math.abs(this.time.now - this.nextBeatTime);
    let timingResult: TimingResult;
    if (timingError <= PERFECT_TIMING_WINDOW) timingResult = { accuracy: 'perfect', score: 50 };
    else if (timingError <= GOOD_TIMING_WINDOW) timingResult = { accuracy: 'good', score: 30 };
    else timingResult = { accuracy: 'miss', score: 0 };

    // 2. Lyrics Choice Score: Based on countering the opponent's lyric type
    let choiceScore = 0;
    if (this.gameState.opponentLyric && lyric.countersTo.includes(this.gameState.opponentLyric.type)) {
        choiceScore = 50; // Max score for a successful counter
    }

    // 3. Rhyme Score: An intrinsic score based on the lyric's quality
    const rhymeScore = lyric.rhymeScore;

    const totalScore = timingResult.score + choiceScore + rhymeScore;
    this.gameState.playerScore += totalScore;

    this.updateScoreDisplay();
    this.showFeedback(timingResult, choiceScore, rhymeScore);
    this.advanceTurn();
  }

  private updateScoreDisplay(): void {
    this.playerScoreText.setText(`YOU: ${this.gameState.playerScore}`);
    this.opponentScoreText.setText(`CPU: ${this.gameState.opponentScore}`);
  }

  private showFeedback(timing: TimingResult, choiceScore: number, rhymeScore: number): void {
    const feedback = `Rhythm: ${timing.accuracy.toUpperCase()} +${timing.score}\nChoice: +${choiceScore}\nRhyme: +${rhymeScore}`;
    this.feedbackText.setText(feedback);
    this.opponentActionText.setText(''); // Clear opponent text
  }

  private advanceTurn(): void {
    if (this.gameState.currentTurn < 4) {
      this.gameState.currentTurn++;
      this.time.delayedCall(1500, () => {
        this.turnText.setText(`Turn: ${this.gameState.currentTurn}/4`);
        this.feedbackText.setText('');
      });
    } else {
        this.time.delayedCall(2000, () => this.endBattle());
    }
  }

  private endBattle(): void {
    this.backgroundMusic.stop();
    this.beatTimer.destroy();
    this.gameState.gamePhase = 'result';
    this.feedbackText.setText(`FINISH!\nFinal Score: ${this.gameState.playerScore}`);

    this.time.delayedCall(3000, () => {
      this.scene.start(SCENE_KEYS.RESULT, {
          playerScore: this.gameState.playerScore,
          opponentScore: this.gameState.opponentScore
      });
    });
  }

  private toggleLyricsButtons(isEnabled: boolean): void {
    this.lyricsButtons.forEach(button => {
        button.setInteractive(isEnabled).setAlpha(isEnabled ? 1 : 0.5);
    });
  }

  shutdown() {
    this.scale.off('resize', this.onResize, this);
    if (this.beatTimer) {
      this.beatTimer.destroy();
    }
  }
}
