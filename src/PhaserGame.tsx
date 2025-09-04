import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { LyricsSelectScene } from './scenes/LyricsSelectScene';
import { ResultScene } from './scenes/ResultScene';
import { PreloaderScene } from './scenes/PreloaderScene';

const PhaserGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameContainerRef.current && !gameInstanceRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        scale: {
          parent: gameContainerRef.current,
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: '100%',
          height: '100%',
        },
        scene: [PreloaderScene, MainMenuScene, LyricsSelectScene, BattleScene, ResultScene],
        backgroundColor: '#1a1a1a', // A dark background to see it
      };

      gameInstanceRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, []);

  // Note: The parent div for Phaser needs to be '#game-container' from index.html
  // But the component itself will render a div that we pass to the config.
  // The root component will place this inside '#game-container'.
  return <div ref={gameContainerRef} id="phaser-game-container" />;
};

export default PhaserGame;
