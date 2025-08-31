import Phaser from 'phaser';
import { LYRICS_PATTERNS } from '../constants';
import { LyricsPattern } from '../types';

export class LyricsSelectScene extends Phaser.Scene {
  private selectedLyrics: LyricsPattern[] = [];
  private startButton!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'LyricsSelectScene' });
  }

  create() {
    this.add.text(400, 50, '歌詞を4つ選択してください', {
      font: '32px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.renderLyrics();

    this.startButton = this.add.text(400, 550, 'バトル開始', {
      font: '32px Arial',
      color: '#888888',
      backgroundColor: '#555555',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.updateStartButtonState();
  }

  private renderLyrics(): void {
    let yPos = 100;
    LYRICS_PATTERNS.forEach(lyric => {
      const lyricText = this.add.text(100, yPos, `[${lyric.type}] ${lyric.text.replace('\n', ' / ')}`, {
        font: '16px Arial',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 5, y: 5 },
        wordWrap: { width: 600 }
      })
      .setInteractive({ useHandCursor: true });

      lyricText.on('pointerdown', () => {
        this.toggleLyricSelection(lyric, lyricText);
      });

      yPos += lyricText.height + 10;
    });
  }

  private toggleLyricSelection(lyric: LyricsPattern, lyricText: Phaser.GameObjects.Text): void {
    const index = this.selectedLyrics.findIndex(l => l.id === lyric.id);

    if (index > -1) {
      // Deselect
      this.selectedLyrics.splice(index, 1);
      lyricText.setBackgroundColor('#333333');
    } else {
      // Select
      if (this.selectedLyrics.length < 4) {
        this.selectedLyrics.push(lyric);
        lyricText.setBackgroundColor('#00ff00'); // Highlight selected
      }
    }
    this.updateStartButtonState();
  }

  private updateStartButtonState(): void {
    if (this.selectedLyrics.length === 4) {
      this.startButton.setInteractive({ useHandCursor: true });
      this.startButton.setColor('#ffffff');
      this.startButton.setBackgroundColor('#008800');
      this.startButton.off('pointerdown'); // Remove old listeners
      this.startButton.on('pointerdown', () => {
        this.scene.start('BattleScene', { selectedLyrics: this.selectedLyrics });
      });
    } else {
      this.startButton.disableInteractive();
      this.startButton.setColor('#888888');
      this.startButton.setBackgroundColor('#555555');
    }
  }
}
