import Phaser from 'phaser';
import { LyricsPattern } from '../../../types';
import { TextButtonOptions } from '../';
import { FONT_STYLES } from '../../../constants';
import { PhraseButton } from './PhraseButton';

interface LyricsPhraseOptions {
  lyricsPattern: LyricsPattern;
  onClick: () => void;
  width?: number;
  height?: number;
}

export class LyricsPhrase extends Phaser.GameObjects.Container {
  private lyricsPattern: LyricsPattern;
  private wordButton: PhraseButton;

  constructor(scene: Phaser.Scene, options: LyricsPhraseOptions) {
    super(scene, 0, 0);
    this.lyricsPattern = options.lyricsPattern;

    const button = new PhraseButton(
      scene,
      TextButtonOptions.secondary({
        textConfig: {
          text: this.lyricsPattern.word,
          style: { ...FONT_STYLES.LYRIC_TEXT, wordWrap: { width: (options.width ?? 400) - 40 } },
        },
        padding: 20,
        cornerRadius: 8,
        onClick: () => {
          options.onClick();
        },
      }),
      this.lyricsPattern.word,
    );

    this.add(button);
    this.wordButton = button;

    const bounds = this.getBounds();
    this.setSize(bounds.width, bounds.height);
  }

  public getLyricsPattern(): LyricsPattern {
    return this.lyricsPattern;
  }

  public setDisabled(isDisabled: boolean) {
    this.wordButton.setDisabled(isDisabled);
  }
}
