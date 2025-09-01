import * as _ from 'lodash';
import * as Phaser from 'phaser';
import { LayoutContainer } from '../layout/layout-container';
import { TextButtonOptions } from "./text-button-options";

export class TextButton extends LayoutContainer {
    private _text: Phaser.GameObjects.Text;
    private _textConfig: Phaser.Types.GameObjects.Text.TextConfig;
    private _enabled: boolean;
    private _hovering: boolean = false;
    private _clicking: boolean = false;
    private _onClickAction: () => void;
    private hoverTween: Phaser.Tweens.Tween;
    private pressTween: Phaser.Tweens.Tween;

    constructor(scene: Phaser.Scene, options: TextButtonOptions) {
        options = TextButtonOptions.setDefaultOptions(options);
        super(scene, options);

        this._textConfig = options.textConfig;

        this.setText(options.textConfig)
            .setOnClick(options.onClick)
            .setEnabled(!options.disabled);

        this._setupHandlers();
    }

    /**
     * returns the `Phaser.GameObjects.Text` used to display text in this button.
     *
     * **WARNING!** this SHOULD NOT be modified directly. use the `TextButton.setText(config)`
     * function instead
     */
    get text(): Phaser.GameObjects.Text {
        return this._text;
    }

    /**
     * returns the current `Phaser.Types.GameObjects.Text.TextConfig` used
     * for the text in this `TextButton`
     */
    get textConfig(): Phaser.Types.GameObjects.Text.TextConfig {
        return this._textConfig;
    }

    /**
     * indicates if this button will run the `onClick` and `onHover` actions
     * when hovered or clicked
     */
    get enabled(): boolean {
        return this._enabled;
    }


    /**
     * sets the `text` and `style` to be added
     * @param config a `Phaser.Types.GameObjects.Text.TextConfig` object
     * containing the `text` and `style` to be applied to a `Phaser.GameObjects.Text`
     * object
     * @returns the current instance of this `TextButton`
     */
    setText(config?: Phaser.Types.GameObjects.Text.TextConfig): this {
        if (this._text) {
            this._text.destroy();
            this._text = null;
        }

        if (config) {
            config = _.merge(this._textConfig, config);
            const txt = this.scene.make.text(config, false);
            this.setContent(txt);
            this._text = txt;
            this._textConfig = config;
        }

        return this;
    }

    override setBackground(style?: Phaser.Types.GameObjects.Graphics.Styles): this {
        super.setBackground(style);
        return this;
    }

    /**
     * sets the function to be run when a pointer down event is fired on this `TextButton`
     * and also sets the behaviour when pointer up and pointer out events occur to reset the
     * `TextButton` back to its previous state
     * @param func a function to be run when the `Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN`
     * event is fired on this object
     * @returns the current instance of this `TextButton`
     */
    setOnClick(func?: () => void): this {
        this._onClickAction = func;
        return this;
    }

    /**
     * allows setting the `enabled` state of this `TextButton` so that hover and click events will
     * be handled if `true` and not if `false`
     * @param enabled a boolean indicating if `onClick` and `onHover` actions should be
     * run
     * @returns the current instance of this `TextButton`
     */
    setEnabled(enabled: boolean = true): this {
        this._enabled = enabled;
        return this;
    }

    private _setupHandlers(): void {
        this.setInteractive();
        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this._onHoverHandler, this);
        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this._onClickHandler, this);
        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this._offHoverHandler, this);
        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this._offClickHandler, this);
    }

    private _tweenTo(scale: number, duration: number = 100) {
        if (this.hoverTween) {
            this.hoverTween.stop();
            this.hoverTween = null;
        }
        this.hoverTween = this.scene.tweens.add({
            targets: this,
            scale: scale,
            duration: duration,
            ease: 'Power2'
        });
    }

    private _onClickHandler(): void {
        this._clicking = true;
        if (this.enabled) {
            this._tweenTo(0.95, 50);
            if (this._onClickAction) {
                this._onClickAction();
            }
        }
    }

    private _offClickHandler(): void {
        if (!this._clicking) return;
        this._clicking = false;
        if (this.enabled) {
            if (this._hovering) {
                this._tweenTo(1.05);
            } else {
                this._tweenTo(1.0);
            }
        }
    }

    private _onHoverHandler(): void {
        this._hovering = true;
        if (this.enabled && !this._clicking) {
            this._tweenTo(1.05);
        }
    }

    private _offHoverHandler(): void {
        this._hovering = false;
        if (this.enabled && !this._clicking) {
            this._tweenTo(1.0);
        }
    }
}
