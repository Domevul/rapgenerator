import Phaser from 'phaser';
import { LYRICS_PATTERNS } from '../constants';
import type { LyricsPattern } from '../types';

export class LyricsSelectScene extends Phaser.Scene {
  private selectedLyrics: LyricsPattern[] = [];
  private startButton!: Phaser.GameObjects.Text;
  private lyricsContainer!: Phaser.GameObjects.Container;
  private scrollMinY: number = 0;
  private scrollMaxY: number = 0;
  private titleText!: Phaser.GameObjects.Text;
  private maskGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'LyricsSelectScene' });
  }

  create() {
    this.selectedLyrics = [];
    this.createLayout();
    this.input.on('wheel', this.onWheel, this);
    this.scale.on('resize', this.onResize, this);
  }

  private createLayout(): void {
    const { width, height } = this.scale;

    // Clear old objects if resizing
    if (this.titleText) this.titleText.destroy();
    if (this.startButton) this.startButton.destroy();
    if (this.lyricsContainer) this.lyricsContainer.destroy();
    if (this.maskGraphics) this.maskGraphics.destroy();

    this.titleText = this.add.text(width * 0.5, 50, '歌詞を4つ選択してください', {
      font: '32px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    const scrollAreaY = 120;
    const scrollAreaHeight = height - 200;

    this.lyricsContainer = this.add.container(width * 0.5, scrollAreaY);

    this.renderLyrics(width);

    // Create a mask for the scrollable area
    this.maskGraphics = this.make.graphics();
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRect(0, scrollAreaY, width, scrollAreaHeight);
    const mask = this.maskGraphics.createGeometryMask();
    this.lyricsContainer.setMask(mask);

    // Define scroll boundaries
    const listHeight = this.lyricsContainer.getBounds().height;

    this.scrollMaxY = scrollAreaY;
    this.scrollMinY = scrollAreaY + scrollAreaHeight - listHeight;

    // If list is shorter than the area, don't allow scrolling
    if (listHeight < scrollAreaHeight) {
        this.scrollMinY = scrollAreaY;
    }

    this.lyricsContainer.y = this.scrollMaxY; // Reset position

    this.startButton = this.add.text(width * 0.5, height - 60, 'バトル開始', {
      font: '32px Arial',
      color: '#888888',
      backgroundColor: '#555555',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.updateStartButtonState();
  }

  private renderLyrics(width: number): void {
    let yPos = 0;
    const textWidth = width * 0.8;

    LYRICS_PATTERNS.forEach(lyric => {
      const lyricText = this.add.text(0, yPos, `[${lyric.type}] ${lyric.text.replace('\n', ' / ')}`, {
        font: '20px Arial',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 10, y: 10 },
        wordWrap: { width: textWidth }
      })
      .setOrigin(0.5, 0)
      .setInteractive({ useHandCursor: true });

      lyricText.on('pointerdown', () => {
        this.toggleLyricSelection(lyric, lyricText);
      });

      this.lyricsContainer.add(lyricText);
      yPos += lyricText.height + 15;
    });
  }

  private onWheel(pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number): void {
    if (this.scrollMinY >= this.scrollMaxY) return; // No need to scroll

    const newY = this.lyricsContainer.y - deltaY * 0.5;

    // Clamp the position within the defined scroll boundaries
    this.lyricsContainer.y = Phaser.Math.Clamp(newY, this.scrollMinY, this.scrollMaxY);
  }

  private onResize(gameSize: Phaser.Structs.Size): void {
    this.createLayout();
  }

  private toggleLyricSelection(lyric: LyricsPattern, lyricText: Phaser.GameObjects.Text): void {
    const index = this.selectedLyrics.findIndex(l => l.id === lyric.id);

    if (index > -1) {
      this.selectedLyrics.splice(index, 1);
      lyricText.setBackgroundColor('#333333');
    } else {
      if (this.selectedLyrics.length < 4) {
        this.selectedLyrics.push(lyric);
        lyricText.setBackgroundColor('#00ff00');
      }
    }
    this.updateStartButtonState();
  }

  private updateStartButtonState(): void {
    if (this.selectedLyrics.length === 4) {
      this.startButton.setInteractive({ useHandCursor: true });
      this.startButton.setColor('#ffffff');
      this.startButton.setBackgroundColor('#008800');
      this.startButton.off('pointerdown');
      this.startButton.on('pointerdown', () => {
        this.scale.off('resize', this.onResize, this);
        this.input.off('wheel', this.onWheel, this);
        this.scene.start('BattleScene', { selectedLyrics: this.selectedLyrics });
      });
    } else {
      this.startButton.disableInteractive();
      this.startButton.setColor('#888888');
      this.startButton.setBackgroundColor('#555555');
    }
  }

  shutdown() {
    this.scale.off('resize', this.onResize, this);
    this.input.off('wheel', this.onWheel, this);
  }
}
