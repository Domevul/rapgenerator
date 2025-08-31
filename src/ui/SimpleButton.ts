import Phaser from 'phaser';
import { FONT_STYLES } from '../constants';

export class SimpleButton extends Phaser.GameObjects.Container {
  private readonly buttonText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void) {
    super(scene, x, y);

    const buttonStyle = { ...FONT_STYLES.BUTTON, color: '#ffffff', backgroundColor: '#333333' };

    // Create the text object
    this.buttonText = scene.add.text(0, 0, text, buttonStyle).setOrigin(0.5);

    // Add text to this container
    this.add(this.buttonText);

    // Set the size of the container
    this.setSize(this.buttonText.width, this.buttonText.height);

    // Make it interactive
    this.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.buttonText.setAlpha(0.7);
      })
      .on('pointerup', () => {
        this.buttonText.setAlpha(1);
        onClick();
      })
      .on('pointerout', () => {
        this.buttonText.setAlpha(1);
      });

    // Add this container to the scene
    scene.add.existing(this);
  }
}
