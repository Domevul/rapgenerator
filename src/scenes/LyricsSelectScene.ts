import Phaser from 'phaser';
import { COLORS, FONT_STYLES, LYRICS_PATTERNS, SCENE_KEYS } from '../constants';
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
    super({ key: SCENE_KEYS.LYRICS_SELECT });
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

    this.titleText = this.add.text(width * 0.5, 50, '歌詞を4つ選択してください', FONT_STYLES.SUBTITLE).setOrigin(0.5);

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
    const listHeight = this.lyricsContainer.getData('contentHeight') || 0;

    this.scrollMaxY = scrollAreaY;
    this.scrollMinY = scrollAreaY + scrollAreaHeight - listHeight;

    // If list is shorter than the area, don't allow scrolling
    if (listHeight < scrollAreaHeight) {
        this.scrollMinY = scrollAreaY;
    }

    this.lyricsContainer.y = this.scrollMaxY; // Reset position

    this.startButton = this.add.text(width * 0.5, height - 60, 'バトル開始', FONT_STYLES.BUTTON).setOrigin(0.5);

    this.updateStartButtonState();
  }

  private renderLyrics(width: number): void {
    let yPos = 0;
    const textWidth = width * 0.8;

    LYRICS_PATTERNS.forEach(lyric => {
      const lyricTextStyle = { ...FONT_STYLES.LYRIC_TEXT, wordWrap: { width: textWidth } };
      const lyricText = this.add.text(0, yPos, `[${lyric.type}] ${lyric.text.replace('\n', ' / ')}`, lyricTextStyle)
      .setOrigin(0.5, 0)
      .setInteractive({ useHandCursor: true });

      lyricText.on('pointerdown', () => {
        this.toggleLyricSelection(lyric, lyricText);
      });

      this.lyricsContainer.add(lyricText);
      yPos += lyricText.height + 15;
    });

    const contentHeight = yPos > 0 ? yPos - 15 : 0;
    this.lyricsContainer.setData('contentHeight', contentHeight);
  }

  private onWheel(_pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number): void {
    if (this.scrollMinY >= this.scrollMaxY) return; // No need to scroll

    const newY = this.lyricsContainer.y - deltaY * 0.5;

    // Clamp the position within the defined scroll boundaries
    this.lyricsContainer.y = Phaser.Math.Clamp(newY, this.scrollMinY, this.scrollMaxY);
  }

  private onResize(_gameSize: Phaser.Structs.Size): void {
    this.createLayout();
  }

  private toggleLyricSelection(lyric: LyricsPattern, lyricText: Phaser.GameObjects.Text): void {
    const index = this.selectedLyrics.findIndex(l => l.id === lyric.id);

    if (index > -1) {
      this.selectedLyrics.splice(index, 1);
      lyricText.setBackgroundColor(COLORS.DARK_GREY);
    } else {
      if (this.selectedLyrics.length < 4) {
        this.selectedLyrics.push(lyric);
        lyricText.setBackgroundColor(COLORS.GREEN);
      }
    }
    this.updateStartButtonState();
  }

  private updateStartButtonState(): void {
    if (this.selectedLyrics.length === 4) {
      this.startButton.setInteractive({ useHandCursor: true });
      this.startButton.setColor(COLORS.WHITE);
      this.startButton.setBackgroundColor(COLORS.PRIMARY);
      this.startButton.off('pointerdown');
      this.startButton.on('pointerdown', () => {
        this.scale.off('resize', this.onResize, this);
        this.input.off('wheel', this.onWheel, this);
        this.scene.start(SCENE_KEYS.BATTLE, { selectedLyrics: this.selectedLyrics });
      });
    } else {
      this.startButton.disableInteractive();
      this.startButton.setColor(COLORS.GREY);
      this.startButton.setBackgroundColor(COLORS.SECONDARY);
    }
  }

  shutdown() {
    this.scale.off('resize', this.onResize, this);
    this.input.off('wheel', this.onWheel, this);
  }
}
