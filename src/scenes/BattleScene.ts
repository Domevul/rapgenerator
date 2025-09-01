import Phaser from 'phaser';
import type { GameState, LyricsPattern, TimingResult } from '../types';
import {
  BEAT_INTERVAL,
  PERFECT_TIMING_WINDOW,
  GOOD_TIMING_WINDOW,
  LYRICS_PATTERNS,
  SCENE_KEYS,
  FONT_STYLES,
  COLORS,
} from '../constants';

export class BattleScene extends Phaser.Scene {
  private gameState!: GameState;
  private beatTimer!: Phaser.Time.TimerEvent;
  private nextBeatTime: number = 0;
  private playerTurnBeatTime: number = 0;
  private playerLyrics: LyricsPattern[] = [];
  private opponentLyrics: LyricsPattern[] = []; // For MC Rookie

  // UI Elements
  private uiElements: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: SCENE_KEYS.BATTLE });
  }

  init(data: { selectedLyrics: LyricsPattern[] }) {
    this.playerLyrics = data.selectedLyrics || LYRICS_PATTERNS.slice(0, 4);
    this.opponentLyrics = LYRICS_PATTERNS.filter(p => p.type === 'attack' || p.type === 'technical');
  }

  create() {
    this.gameState = {
      currentTurn: 1,
      playerScore: 0,
      opponentScore: 0,
      beatCount: 0,
      gamePhase: 'waiting',
      opponentLyric: null,
    };

    this.createLayout();
    this.setupBeatTimer();

    this.scale.on('resize', this.onResize, this);
  }

  private onResize() {
    this.createLayout();
  }

  private createLayout(): void {
    // Clear previous UI elements
    this.uiElements.forEach(element => element.destroy());
    this.uiElements = [];

    const { width, height } = this.scale;

    // Top UI Elements
    const topMargin = height * 0.05;
    const scoreOffset = width * 0.05;

    this.uiElements.push(this.add.text(width * 0.5, topMargin, 'BATTLE START', { ...FONT_STYLES.SUBTITLE, color: COLORS.RED }).setOrigin(0.5));
    const playerScoreText = this.add.text(scoreOffset, topMargin, `YOU: ${this.gameState.playerScore}`, { ...FONT_STYLES.BODY, color: COLORS.GREEN }).setOrigin(0, 0.5);
    const opponentScoreText = this.add.text(width - scoreOffset, topMargin, `CPU: ${this.gameState.opponentScore}`, { ...FONT_STYLES.BODY, color: COLORS.RED }).setOrigin(1, 0.5);
    const turnText = this.add.text(width * 0.5, topMargin + 40, `Turn: ${this.gameState.currentTurn}/4`, FONT_STYLES.BODY).setOrigin(0.5);
    this.uiElements.push(playerScoreText, opponentScoreText, turnText);

    // Mid-Screen Action/Feedback
    const opponentActionText = this.add.text(width * 0.5, height * 0.3, '', FONT_STYLES.BATTLE_OPPONENT_ACTION).setOrigin(0.5);
    const feedbackText = this.add.text(width * 0.5, height * 0.45, '', FONT_STYLES.BATTLE_FEEDBACK).setOrigin(0.5);
    const beatMarker = this.add.text(width * 0.5, height * 0.2, '●', FONT_STYLES.SUBTITLE).setOrigin(0.5).setVisible(false);
    this.uiElements.push(opponentActionText, feedbackText, beatMarker);

    // Assign to class properties where needed for updates
    this.data.set('playerScoreText', playerScoreText);
    this.data.set('opponentScoreText', opponentScoreText);
    this.data.set('turnText', turnText);
    this.data.set('opponentActionText', opponentActionText);
    this.data.set('feedbackText', feedbackText);
    this.data.set('beatMarker', beatMarker);

    this.createLyricsButtons();
    this.updateScoreDisplay();
  }

  private setupBeatTimer(): void {
    this.nextBeatTime = this.time.now;
    if (this.beatTimer) this.beatTimer.destroy();
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

    const beatMarker = this.data.get('beatMarker') as Phaser.GameObjects.Text;
    if(beatMarker && beatMarker.scene) {
        beatMarker.setVisible(true);
        this.tweens.add({ targets: beatMarker, alpha: 0, duration: BEAT_INTERVAL / 2, onComplete: () => beatMarker.setAlpha(1).setVisible(false) });
    }

    if (this.gameState.beatCount % 8 === 1) {
        this.opponentTurn();
    } else if (this.gameState.beatCount % 8 === 5) {
        this.playerTurn();
    }
  }

  private opponentTurn() {
    this.gameState.gamePhase = 'waiting';

    const opponentChoice = this.opponentLyrics[Phaser.Math.Between(0, this.opponentLyrics.length - 1)];
    this.gameState.opponentLyric = opponentChoice;

    const opponentRhythmScore = Math.random() > 0.2 ? 50 : 30;
    const opponentTurnScore = opponentRhythmScore + opponentChoice.rhymeScore;
    this.gameState.opponentScore += opponentTurnScore;
    this.updateScoreDisplay();

    const opponentActionText = this.data.get('opponentActionText') as Phaser.GameObjects.Text;
    opponentActionText.setText(`[CPU] ${opponentChoice.text.replace('\n', ' / ')}`);
    (this.data.get('feedbackText') as Phaser.GameObjects.Text).setText('');
  }

  private playerTurn() {
    (this.data.get('feedbackText') as Phaser.GameObjects.Text).setText('YOUR TURN: SELECT!');
    this.gameState.gamePhase = 'selecting';
    this.playerTurnBeatTime = this.nextBeatTime;
  }

  private createLyricsButtons(): void {
    const { width, height } = this.scale;
    const buttonStyle = { ...FONT_STYLES.LYRIC_TEXT, font: '16px Arial', padding: { x: 10, y: 5 }, wordWrap: { width: width * 0.8 } };
    const lyricsButtons: Phaser.GameObjects.Text[] = [];

    const isPortrait = height > width;

    this.playerLyrics.forEach((lyric, index) => {
      let xPos, yPos;
      if (isPortrait) {
        xPos = width * 0.5;
        yPos = height * 0.65 + index * 60;
      } else {
        xPos = width * 0.3 + (index % 2) * (width * 0.4);
        yPos = height * 0.7 + Math.floor(index / 2) * 70;
      }

      const button = this.add.text(xPos, yPos, lyric.text.replace('\n', ' / '), buttonStyle)
        .setOrigin(0.5).setInteractive();

      button.on('pointerdown', () => this.handlePlayerInput(lyric));
      this.uiElements.push(button);
      lyricsButtons.push(button);
    });
    this.data.set('lyricsButtons', lyricsButtons);
  }

  private handlePlayerInput(lyric: LyricsPattern): void {
    if (this.gameState.gamePhase !== 'selecting') return;

    this.gameState.gamePhase = 'performing';

    const timingError = Math.abs(this.time.now - this.playerTurnBeatTime);
    let timingResult: TimingResult;
    if (timingError <= PERFECT_TIMING_WINDOW) timingResult = { accuracy: 'perfect', score: 50 };
    else if (timingError <= GOOD_TIMING_WINDOW) timingResult = { accuracy: 'good', score: 30 };
    else timingResult = { accuracy: 'miss', score: 0 };

    let choiceScore = 0;
    if (this.gameState.opponentLyric && lyric.countersTo.includes(this.gameState.opponentLyric.type)) {
        choiceScore = 50;
    }

    const rhymeScore = lyric.rhymeScore;
    const totalScore = timingResult.score + choiceScore + rhymeScore;
    this.gameState.playerScore += totalScore;

    this.updateScoreDisplay();
    this.showFeedback(timingResult, choiceScore, rhymeScore);
    this.advanceTurn();
  }

  private updateScoreDisplay(): void {
    (this.data.get('playerScoreText') as Phaser.GameObjects.Text).setText(`YOU: ${this.gameState.playerScore}`);
    (this.data.get('opponentScoreText') as Phaser.GameObjects.Text).setText(`CPU: ${this.gameState.opponentScore}`);
  }

  private showFeedback(timing: TimingResult, choiceScore: number, rhymeScore: number): void {
    const feedback = `Rhythm: ${timing.accuracy.toUpperCase()} +${timing.score}\nChoice: +${choiceScore}\nRhyme: +${rhymeScore}`;
    (this.data.get('feedbackText') as Phaser.GameObjects.Text).setText(feedback);
    (this.data.get('opponentActionText') as Phaser.GameObjects.Text).setText('');
  }

  private advanceTurn(): void {
    if (this.gameState.currentTurn < 4) {
      this.gameState.currentTurn++;
      this.time.delayedCall(1500, () => {
        (this.data.get('turnText') as Phaser.GameObjects.Text).setText(`Turn: ${this.gameState.currentTurn}/4`);
        (this.data.get('feedbackText') as Phaser.GameObjects.Text).setText('');
      });
    } else {
        this.time.delayedCall(2000, () => this.endBattle());
    }
  }

  private endBattle(): void {
    this.beatTimer.destroy();
    this.gameState.gamePhase = 'result';
    (this.data.get('feedbackText') as Phaser.GameObjects.Text).setText(`FINISH!\nFinal Score: ${this.gameState.playerScore}`);

    this.time.delayedCall(3000, () => {
      this.scene.start(SCENE_KEYS.RESULT, {
          playerScore: this.gameState.playerScore,
          opponentScore: this.gameState.opponentScore
      });
    });
  }

  shutdown() {
    this.scale.off('resize', this.onResize, this);
    if (this.beatTimer) {
      this.beatTimer.destroy();
    }
  }
}
