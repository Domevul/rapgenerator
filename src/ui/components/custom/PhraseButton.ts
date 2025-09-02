import { TextButton, TextButtonOptions } from '../';

export class PhraseButton extends TextButton {
  private phraseText: string;

  constructor(
    scene: Phaser.Scene,
    options: TextButtonOptions,
    phraseText: string,
  ) {
    super(scene, options);
    this.phraseText = phraseText;
    this.setText({ text: this.phraseText });
  }

  public getPhraseText(): string {
    return this.phraseText;
  }
}
