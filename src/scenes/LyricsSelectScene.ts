import Phaser from 'phaser';
import { COLORS, FONT_STYLES, LYRICS_PATTERNS, SCENE_KEYS } from '../constants';
import type { LyricsPattern } from '../types';
import {
  LinearLayout,
  Styles,
  TextButton,
  TextButtonOptions,
} from '../ui/components';

export class LyricsSelectScene extends Phaser.Scene {
  private selectedLyrics: LyricsPattern[] = [];
  private startButton!: TextButton;
  private lyricsContainer!: LinearLayout;
  private scrollableContainer!: Phaser.GameObjects.Container;
  private scrollMinY: number = 0;
  private scrollMaxY: number = 0;
  private titleText!: Phaser.GameObjects.Text;
  private maskGraphics!: Phaser.GameObjects.Graphics;
  private lyricButtons: TextButton[] = [];

  constructor() {
    super({ key: SCENE_KEYS.LYRICS_SELECT });
  }

  create() {
    this.selectedLyrics = [];
    this.lyricButtons = [];
    this.createLayout();
    this.input.on('wheel', this.onWheel, this);
    this.scale.on('resize', this.onResize, this);
  }

  private onResize(gameSize: Phaser.Structs.Size): void {
    this.createLayout();
  }

  private createLayout(): void {
    // Clean up previous layout
    this.children.removeAll(true);

    const { width, height } = this.scale;

    this.titleText = this.add
      .text(width * 0.5, 50, '歌詞を4つ選択してください', FONT_STYLES.SUBTITLE)
      .setOrigin(0.5);

    const scrollAreaY = 120;
    const scrollAreaHeight = height - 240;
    const scrollAreaWidth = width * 0.8;

    // A container that will be scrolled
    this.scrollableContainer = this.add.container(width * 0.5, scrollAreaY);

    this.renderLyrics(scrollAreaWidth);
    this.scrollableContainer.add(this.lyricsContainer);

    // Create a mask for the scrollable area
    this.maskGraphics = this.make.graphics();
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRect(
      (width - scrollAreaWidth) / 2,
      scrollAreaY,
      scrollAreaWidth,
      scrollAreaHeight,
    );
    const mask = this.maskGraphics.createGeometryMask();
    this.scrollableContainer.setMask(mask);

    // Define scroll boundaries
    const listHeight = this.lyricsContainer.height;
    this.scrollMaxY = 0; // Relative to the scrollableContainer
    this.scrollMinY = scrollAreaHeight - listHeight;

    if (listHeight < scrollAreaHeight) {
      this.scrollMinY = 0;
    }

    this.scrollableContainer.y = Phaser.Math.Clamp(
      this.scrollableContainer.y,
      this.scrollMinY + scrollAreaY, // convert to world coordinates for initial clamp
      this.scrollMaxY + scrollAreaY,
    );

    const startButtonOptions = TextButtonOptions.primary({
      textConfig: {
        text: 'バトル開始',
        style: FONT_STYLES.BUTTON,
      },
      padding: 10,
      cornerRadius: 8,
    });
    this.startButton = new TextButton(this, startButtonOptions)
      .setPosition(width * 0.5, height - 60)
      .setEnabled(false);
    this.add.existing(this.startButton);

    this.updateStartButtonState();
  }

  private renderLyrics(width: number): void {
    this.lyricButtons = [];
    this.lyricsContainer = new LinearLayout(this, {
      orientation: 'vertical',
      padding: 10,
      desiredWidth: width,
    });

    LYRICS_PATTERNS.forEach((lyric) => {
      const isSelected = this.selectedLyrics.some((l) => l.id === lyric.id);
      const style = isSelected
        ? Styles.success()
        : Styles.secondary();

      const buttonOptions: TextButtonOptions = {
        textConfig: {
          text: `[${lyric.type}] ${lyric.text.replace('\n', ' / ')}`,
          style: {
            font: FONT_STYLES.LYRIC_TEXT.font,
            color: FONT_STYLES.LYRIC_TEXT.color,
            wordWrap: { width: width - 20 },
          },
        },
        backgroundStyles: style.graphics,
        padding: 10,
        cornerRadius: 5,
        onClick: () => {
          this.toggleLyricSelection(lyric, lyricButton);
        },
      };

      const lyricButton = new TextButton(this, buttonOptions);
      this.lyricButtons.push(lyricButton);
      this.lyricsContainer.addContents(lyricButton);
    });
  }

  private onWheel(
    _pointer: Phaser.Input.Pointer,
    _gameObjects: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    deltaY: number,
  ): void {
    if (this.scrollMinY >= this.scrollMaxY) return; // No need to scroll

    // Note: We are moving the container that holds the LinearLayout
    const newY = this.lyricsContainer.y - deltaY * 0.5;

    // Clamp the position within the defined scroll boundaries
    this.lyricsContainer.y = Phaser.Math.Clamp(
      newY,
      this.scrollMinY,
      this.scrollMaxY,
    );
  }

  private toggleLyricSelection(
    lyric: LyricsPattern,
    lyricButton: TextButton,
  ): void {
    const index = this.selectedLyrics.findIndex((l) => l.id === lyric.id);

    if (index > -1) {
      this.selectedLyrics.splice(index, 1);
      lyricButton.setBackground(Styles.secondary().graphics);
    } else {
      if (this.selectedLyrics.length < 4) {
        this.selectedLyrics.push(lyric);
        lyricButton.setBackground(Styles.success().graphics);
      }
    }
    this.updateStartButtonState();
  }

  private updateStartButtonState(): void {
    const enabled = this.selectedLyrics.length === 4;
    this.startButton.setEnabled(enabled);

    if (enabled) {
      this.startButton.setOnClick(() => {
        this.scene.start(SCENE_KEYS.BATTLE, {
          selectedLyrics: this.selectedLyrics,
        });
      });
    } else {
      this.startButton.setOnClick(null); // Remove click handler
    }
  }

  shutdown() {
    this.input.off('wheel', this.onWheel, this);
    this.scale.off('resize', this.onResize, this);
  }
}
