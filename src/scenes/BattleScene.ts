import Phaser from 'phaser';
import type { GameState, LyricsPattern, TimingResult } from '../types';
import {
  BEAT_INTERVAL,
  PERFECT_TIMING_WINDOW,
  GREAT_TIMING_WINDOW,
  GOOD_TIMING_WINDOW,
  LYRICS_PATTERNS,
  SCENE_KEYS,
  FONT_STYLES,
} from '../constants';
import {
  GridLayout,
  TextButton,
  TextButtonOptions,
  Colors,
  LyricsPhrase,
} from '../ui/components';

export class BattleScene extends Phaser.Scene {
  private gameState!: GameState;
  private beatTimer!: Phaser.Time.TimerEvent;
  private nextBeatTime: number = 0;
  private playerTurnBeatTime: number = 0;
  private playerLyrics: LyricsPattern[] = [];
  private opponentLyrics: LyricsPattern[] = []; // For MC Rookie
  private activeLyric: LyricsPattern | null = null;

  // UI Elements
  private playerScoreText!: TextButton;
  private opponentScoreText!: TextButton;
  private turnText!: TextButton;
  private opponentActionText!: TextButton;
  private feedbackText!: TextButton;
  private beatMarker!: TextButton;
  private lyricsPhrases: LyricsPhrase[] = [];

  constructor() {
    super({ key: SCENE_KEYS.BATTLE });
  }

  init(data: { selectedLyrics: LyricsPattern[] }) {
    this.playerLyrics = data.selectedLyrics || LYRICS_PATTERNS.slice(0, 4);
    this.opponentLyrics = LYRICS_PATTERNS.filter(
      (p) => p.type === 'attack' || p.type === 'technical',
    );
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
    this.children.removeAll(true);
    const { width, height } = this.scale;

    const mainLayout = new GridLayout(this, {
      x: width / 2,
      y: height / 2,
      width,
      height,
      rows: 4,
      columns: 3,
      padding: 10,
    });
    this.add.existing(mainLayout);

    // Top UI
    this.playerScoreText = new TextButton(
      this,
      TextButtonOptions.dark({
        textConfig: {
          text: 'YOU: 0',
          style: { ...FONT_STYLES.BODY, color: Colors.toHexString(Colors.success) },
        },
        disabled: true,
      }),
    );
    this.opponentScoreText = new TextButton(
      this,
      TextButtonOptions.dark({
        textConfig: {
          text: 'CPU: 0',
          style: { ...FONT_STYLES.BODY, color: Colors.toHexString(Colors.danger) },
        },
        disabled: true,
      }),
    );
    this.turnText = new TextButton(
      this,
      TextButtonOptions.dark({
        textConfig: { text: 'Turn: 1/4', style: FONT_STYLES.BODY },
        disabled: true,
      }),
    );

    mainLayout.addContentAt(0, 0, this.playerScoreText);
    mainLayout.addContentAt(0, 1, this.turnText);
    mainLayout.addContentAt(0, 2, this.opponentScoreText);

    // Mid-Screen Action/Feedback - Placed manually since grid doesn't support span
    this.opponentActionText = new TextButton(
      this,
      TextButtonOptions.light({
        textConfig: { text: '', style: FONT_STYLES.BATTLE_OPPONENT_ACTION },
        disabled: true,
      }),
    ).setPosition(width / 2, height * 0.3);
    this.add.existing(this.opponentActionText);

    this.feedbackText = new TextButton(
      this,
      TextButtonOptions.light({
        textConfig: { text: '', style: FONT_STYLES.BATTLE_FEEDBACK },
        disabled: true,
      }),
    ).setPosition(width / 2, height * 0.45);
    this.add.existing(this.feedbackText);

    this.beatMarker = new TextButton(
      this,
      TextButtonOptions.light({
        textConfig: { text: '●', style: FONT_STYLES.SUBTITLE },
        disabled: true,
      }),
    ).setPosition(width / 2, height * 0.2).setVisible(false);
    this.add.existing(this.beatMarker);

    // Player Lyric Buttons
    const lyricsLayout = new GridLayout(this, {
      width: width,
      height: height * 0.4,
      rows: 2,
      columns: 2,
      padding: 20,
    });

    this.lyricsPhrases = this.playerLyrics.map((lyric) => {
      const phrase = new LyricsPhrase(this, {
        lyricsPattern: lyric,
        width: width / 2,
        onClick: () => this.handlePlayerInput(lyric),
      });
      return phrase;
    });
    lyricsLayout.addContentAt(0, 0, this.lyricsPhrases[0]);
    lyricsLayout.addContentAt(0, 1, this.lyricsPhrases[1]);
    lyricsLayout.addContentAt(1, 0, this.lyricsPhrases[2]);
    lyricsLayout.addContentAt(1, 1, this.lyricsPhrases[3]);

    // Add the lyrics layout to the main scene, positioned at the bottom
    lyricsLayout.setPosition(width / 2, height * 0.75);
    this.add.existing(lyricsLayout);

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

    if (this.beatMarker && this.beatMarker.scene) {
      this.beatMarker.setVisible(true);
      this.tweens.add({
        targets: this.beatMarker,
        alpha: 0,
        duration: BEAT_INTERVAL / 2,
        onComplete: () => this.beatMarker.setAlpha(1).setVisible(false),
      });
    }

    if (this.gameState.beatCount % 8 === 1) {
      this.opponentTurn();
    } else if (this.gameState.beatCount % 8 === 5) {
      this.playerTurn();
    }
  }

  private opponentTurn() {
    this.gameState.gamePhase = 'waiting';
    this.activeLyric = null;

    const opponentChoice =
      this.opponentLyrics[Phaser.Math.Between(0, this.opponentLyrics.length - 1)];
    this.gameState.opponentLyric = opponentChoice;

    const opponentRhythmScore = Math.random() > 0.2 ? 50 : 30;
    const opponentTurnScore = opponentRhythmScore + opponentChoice.rhymeScore;
    this.gameState.opponentScore += opponentTurnScore;
    this.updateScoreDisplay();

    this.opponentActionText.setText({
      text: `[CPU] ${opponentChoice.text.replace('\n', ' / ')}`,
    });
    this.feedbackText.setText({ text: '' });
    this.lyricsPhrases.forEach((phrase) => phrase.setDisabled(false));
  }

  private playerTurn() {
    this.feedbackText.setText({ text: 'YOUR TURN: SELECT!' });
    this.gameState.gamePhase = 'selecting';
    this.playerTurnBeatTime = this.nextBeatTime;
    this.lyricsPhrases.forEach((phrase) => phrase.setDisabled(false));
  }

  private handlePlayerInput(lyric: LyricsPattern): void {
    if (this.gameState.gamePhase !== 'selecting' || this.activeLyric) return;

    this.gameState.gamePhase = 'performing';
    this.activeLyric = lyric;
    this.lyricsPhrases.forEach((phrase) => {
      if (phrase.getLyricsPattern().id !== lyric.id) {
        phrase.setDisabled(true);
      }
    });

    const timingError = Math.abs(this.time.now - this.playerTurnBeatTime);
    let timingResult: TimingResult;
    if (timingError <= PERFECT_TIMING_WINDOW)
      timingResult = { accuracy: 'perfect', score: 50 };
    else if (timingError <= GREAT_TIMING_WINDOW)
      timingResult = { accuracy: 'great', score: 30 };
    else if (timingError <= GOOD_TIMING_WINDOW)
      timingResult = { accuracy: 'good', score: 15 };
    else timingResult = { accuracy: 'miss', score: 0 };

    let choiceScore = 0;
    if (
      this.gameState.opponentLyric &&
      lyric.countersTo.includes(this.gameState.opponentLyric.type)
    ) {
      choiceScore = 50;
    }

    const rhymeScore = lyric.rhymeScore;
    const totalScore = timingResult.score + choiceScore + rhymeScore;
    this.gameState.playerScore += totalScore;

    this.updateScoreDisplay();
    this.showFeedback(timing);
    this.advanceTurn();
  }

  private updateScoreDisplay(): void {
    this.playerScoreText.setText({ text: `YOU: ${this.gameState.playerScore}` });
    this.opponentScoreText.setText({
      text: `CPU: ${this.gameState.opponentScore}`,
    });
  }

  private showFeedback(
    timing: TimingResult
  ): void {
    this.showTimingFeedback(timing);

    if (timing.accuracy === 'perfect') {
      this.flashScreen();
    }

    this.feedbackText.setText({ text: '' });
    this.opponentActionText.setText({ text: '' });
  }

  private showTimingFeedback(timing: TimingResult): void {
    const { width, height } = this.scale;
    let color = Colors.toHexString(Colors.secondary);
    if (timing.accuracy === 'perfect') color = Colors.toHexString(Colors.warning);
    if (timing.accuracy === 'great') color = Colors.toHexString(Colors.success);
    if (timing.accuracy === 'good') color = Colors.toHexString(Colors.primary);

    const feedbackText = this.add
      .text(width / 2, height / 2, timing.accuracy.toUpperCase(), {
        ...FONT_STYLES.TITLE,
        color,
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setScale(0.5);

    this.tweens.add({
      targets: feedbackText,
      alpha: 1,
      scale: 1.1,
      duration: 200,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => {
        this.tweens.add({
          targets: feedbackText,
          alpha: 0,
          duration: 300,
          delay: 200,
          onComplete: () => {
            feedbackText.destroy();
          },
        });
      },
    });
  }

  private flashScreen(): void {
    this.cameras.main.flash(150, 255, 255, 180); // duration, r, g, b
  }

  private advanceTurn(): void {
    if (this.gameState.currentTurn < 4) {
      this.gameState.currentTurn++;
      this.time.delayedCall(1500, () => {
        this.turnText.setText({
          text: `Turn: ${this.gameState.currentTurn}/4`,
        });
        this.feedbackText.setText({ text: '' });
      });
    } else {
      this.time.delayedCall(2000, () => this.endBattle());
    }
  }

  private endBattle(): void {
    this.beatTimer.destroy();
    this.gameState.gamePhase = 'result';
    this.feedbackText.setText({
      text: `FINISH!\nFinal Score: ${this.gameState.playerScore}`,
    });

    this.time.delayedCall(3000, () => {
      this.scene.start(SCENE_KEYS.RESULT, {
        playerScore: this.gameState.playerScore,
        opponentScore: this.gameState.opponentScore,
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
