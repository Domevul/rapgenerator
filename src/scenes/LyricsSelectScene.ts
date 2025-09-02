import Phaser from 'phaser';
import { FONT_STYLES, LYRICS_PATTERNS, SCENE_KEYS } from '../constants';
import type { LyricsPattern } from '../types';
import {
  Colors,
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
  private maskGraphics!: Phaser.GameObjects.Graphics;
  private lyricButtons: TextButton[] = [];
  private scrollbar!: Phaser.GameObjects.Graphics;
  private scrollbarThumb!: Phaser.GameObjects.Graphics;
  private scrollbarThumbHeight: number = 0;
  private isDragging = false;
  private dragStartY = 0;
  private contentDragStartY = 0;
  private contentStartRawY = 0;

  constructor() {
    super({ key: SCENE_KEYS.LYRICS_SELECT });
  }

  create() {
    this.selectedLyrics = [];
    this.lyricButtons = [];
    this.createLayout();
    this.input.on('wheel', this.onWheel, this);
    this.scale.on('resize', this.onResize, this);

    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);
  }

  private onResize(): void {
    this.createLayout();
  }

  private createLayout(): void {
    // Clean up previous layout
    this.children.removeAll(true);
    if (this.scrollbar) this.scrollbar.destroy();
    if (this.scrollbarThumb) this.scrollbarThumb.destroy();

    const { width, height } = this.scale;

    this.add
      .text(width * 0.5, 50, '歌詞を4つ選択してください', FONT_STYLES.SUBTITLE)
      .setOrigin(0.5);

    const scrollAreaY = 120;
    const scrollAreaHeight = height - 240;
    const scrollAreaWidth = width * 0.8;
    const scrollAreaX = (width - scrollAreaWidth) / 2;

    // A container that will be scrolled
    this.scrollableContainer = this.add.container(width * 0.5, scrollAreaY);
    this.scrollableContainer.setInteractive(
      new Phaser.Geom.Rectangle(
        -scrollAreaWidth / 2,
        0,
        scrollAreaWidth,
        scrollAreaHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );

    this.renderLyrics(scrollAreaWidth);
    this.scrollableContainer.add(this.lyricsContainer);

    // Create a mask for the scrollable area
    this.maskGraphics = this.make.graphics();
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRect(scrollAreaX, scrollAreaY, scrollAreaWidth, scrollAreaHeight);
    const mask = this.maskGraphics.createGeometryMask();
    this.scrollableContainer.setMask(mask);

    // Define scroll boundaries
    const listHeight = this.lyricsContainer.height;
    this.scrollMaxY = 0;
    this.scrollMinY = Math.min(0, scrollAreaHeight - listHeight);

    // Create scrollbar
    this.createScrollbar(
      scrollAreaX + scrollAreaWidth + 5,
      scrollAreaY,
      scrollAreaHeight,
      listHeight,
    );

    this.updateScrollbarThumb();

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

      const fullText = lyric.collocation.replace('...', `[${lyric.word}]`);
      const buttonOptions: TextButtonOptions = {
        textConfig: {
          text: `[${lyric.type}] ${fullText.replace('\n', ' / ')}`,
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

  private createScrollbar(
    x: number,
    y: number,
    height: number,
    contentHeight: number,
  ): void {
    if (contentHeight <= height) return;

    this.scrollbar = this.add
      .graphics()
      .fillStyle(Colors.light, 0.5)
      .fillRect(x, y, 8, height);

    this.scrollbarThumb = this.add
      .graphics()
      .fillStyle(Colors.secondary, 1)
      .fillRect(x, y, 8, 50); // Initial thumb

    this.scrollbarThumb.setInteractive(
      new Phaser.Geom.Rectangle(x, y, 8, height),
      Phaser.Geom.Rectangle.Contains,
    );
  }

  private updateScrollbarThumb(): void {
    if (!this.scrollbar) return;

    const scrollAreaHeight = this.scrollableContainer.input?.hitArea.height ?? 0;
    const contentHeight = this.lyricsContainer.height;
    const scrollableRatio = scrollAreaHeight / contentHeight;

    if (scrollableRatio >= 1) {
      this.scrollbar.setVisible(false);
      this.scrollbarThumb.setVisible(false);
      return;
    }

    this.scrollbar.setVisible(true);
    this.scrollbarThumb.setVisible(true);

    const thumbHeight = scrollAreaHeight * scrollableRatio;
    this.scrollbarThumb.clear();
    this.scrollbarThumb.fillStyle(Colors.secondary, 1);
    this.scrollbarThumb.fillRect(this.scrollbar.x, this.scrollbar.y, 8, thumbHeight);

    const scrollPercentage =
      this.lyricsContainer.y / (this.scrollMinY - this.scrollMaxY);
    const thumbY =
      this.scrollbar.y + (scrollAreaHeight - thumbHeight) * scrollPercentage;
    this.scrollbarThumb.y = thumbY;
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.scrollbarThumb && this.scrollbarThumb.input.hitArea.contains(pointer.x, pointer.y)) {
      this.isDragging = true;
      this.dragStartY = pointer.y - this.scrollbarThumb.y;
    } else if (this.scrollableContainer.getBounds().contains(pointer.x, pointer.y)) {
      this.isDragging = true;
      this.contentDragStartY = pointer.y;
      this.contentStartRawY = this.lyricsContainer.y;
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isDragging) return;

    // Check if the drag started on the scrollbar thumb
    if (this.dragStartY > 0) {
      const scrollAreaHeight = this.scrollableContainer.input?.hitArea.height ?? 0;
      const thumbHeight = this.scrollbarThumb.displayHeight;
      const scrollbarY = this.scrollbar.y;
      const newThumbY = Phaser.Math.Clamp(pointer.y - this.dragStartY, scrollbarY, scrollbarY + scrollAreaHeight - thumbHeight);
      let scrollPercentage = (newThumbY - scrollbarY) / (scrollAreaHeight - thumbHeight);
      if (isNaN(scrollPercentage)) {
        scrollPercentage = 0;
      }
      this.lyricsContainer.y = Phaser.Math.Clamp(this.scrollMinY * scrollPercentage, this.scrollMinY, this.scrollMaxY);
    } else {
      const dy = pointer.y - this.contentDragStartY;
      const newY = this.contentStartRawY + dy;
      this.lyricsContainer.y = Phaser.Math.Clamp(newY, this.scrollMinY, this.scrollMaxY);
    }

    this.updateScrollbarThumb();
  }

  private onPointerUp(): void {
    this.isDragging = false;
    this.dragStartY = 0;
  }

  private onWheel(
    _pointer: Phaser.Input.Pointer,
    _gameObjects: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    deltaY: number,
  ): void {
    if (this.scrollMinY >= this.scrollMaxY) return;

    const newY = this.lyricsContainer.y - deltaY * 0.5;
    this.lyricsContainer.y = Phaser.Math.Clamp(
      newY,
      this.scrollMinY,
      this.scrollMaxY,
    );

    this.updateScrollbarThumb();
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
    this.input.off('pointerdown', this.onPointerDown, this);
    this.input.off('pointermove', this.onPointerMove, this);
    this.input.off('pointerup', this.onPointerUp, this);
  }
}
