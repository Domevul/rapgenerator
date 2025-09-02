import Phaser from 'phaser';
import { LyricsPattern } from '../../../types';
import { TextButtonOptions, FONT_STYLES } from '../';
import { PhraseButton } from './PhraseButton';

interface LyricsPhraseOptions {
  lyricsPattern: LyricsPattern;
  onClick: () => void;
  width?: number;
  height?: number;
}

export class LyricsPhrase extends Phaser.GameObjects.Container {
  private lyricsPattern: LyricsPattern;
  private phraseButtons: PhraseButton[];

  constructor(scene: Phaser.Scene, options: LyricsPhraseOptions) {
    super(scene, 0, 0);
    this.lyricsPattern = options.lyricsPattern;
    this.phraseButtons = [];

    const phrases = this.lyricsPattern.text.split('\n');
    const phraseContainer = scene.add.container(0, 0);

    let yOffset = 0;
    phrases.forEach((phrase, index) => {
      const button = new PhraseButton(
        scene,
        TextButtonOptions.secondary({
          textConfig: {
            text: phrase,
            style: { ...FONT_STYLES.LYRIC_TEXT, wordWrap: { width: (options.width ?? 400) - 40 } },
          },
          padding: 10,
          cornerRadius: 5,
          onClick: () => {
            options.onClick();
          },
        }),
        phrase,
      );

      button.setY(yOffset);
      yOffset += button.height + 10; // Add padding between buttons

      phraseContainer.add(button);
      this.phraseButtons.push(button);
    });

    this.add(phraseContainer);
    // Automatically adjust the size of the container
    const bounds = phraseContainer.getBounds();
    this.setSize(bounds.width, bounds.height);
    phraseContainer.setPosition(-bounds.width/2, -bounds.height/2);
  }

  public getLyricsPattern(): LyricsPattern {
    return this.lyricsPattern;
  }

  public setDisabled(isDisabled: boolean) {
    this.phraseButtons.forEach(button => {
        button.setDisabled(isDisabled);
    });
  }
}
