import React, { useState, useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';

// Lazy load the PhaserGame component
const PhaserGame = React.lazy(() => import('./PhaserGame'));

const App: React.FC = () => {
  const [gameContainer, setGameContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Ensure this only runs on the client
    const container = document.getElementById('game-container');
    setGameContainer(container);
  }, []);

  return (
    <div className="app relative w-full h-full flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-blue-500">
        Rap Generator UI
      </h1>

      <div className="mt-8">
        <Button onClick={() => console.log('Button clicked!')}>
          Click Me
        </Button>
      </div>

      {/* Render the Phaser game into its own container using a Portal */}
      {gameContainer && (
        <Suspense fallback={<div>Loading Game...</div>}>
          {ReactDOM.createPortal(<PhaserGame />, gameContainer)}
        </Suspense>
      )}
    </div>
  );
};

export default App;
