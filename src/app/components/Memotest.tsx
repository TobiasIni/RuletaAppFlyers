'use client';

import { useState, useEffect } from 'react';
import { MemotestConfig } from '@/types/api';
import { getMemotestConfig } from '@/lib/api';
import MemotestPresentation from './MemotestPresentation';
import MemotestGame from './MemotestGame';
import MemotestResults from './MemotestResults';

interface MemotestProps {
  juegoId: number;
  onBack: () => void;
}

type MemotestState = 'loading' | 'presentation' | 'playing' | 'results';

export default function Memotest({ juegoId, onBack }: MemotestProps) {
  const [state, setState] = useState<MemotestState>('loading');
  const [memotestConfig, setMemotestConfig] = useState<MemotestConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameResults, setGameResults] = useState({ 
    pairsFound: 0, 
    totalPairs: 0, 
    timeUsed: 0 
  });

  useEffect(() => {
    const loadMemotestConfig = async () => {
      try {
        setState('loading');
        const config = await getMemotestConfig(juegoId);
        setMemotestConfig(config);
        setState('presentation');
        setError(null);
      } catch (err) {
        console.error('Error al cargar la configuración del memotest:', err);
        setError('Error al cargar el memotest. Por favor, intenta de nuevo.');
        setState('presentation'); // Mostrar presentación aunque haya error
      }
    };

    loadMemotestConfig();
  }, [juegoId]);

  const handleStart = () => {
    setState('playing');
  };

  const handleGameFinish = (pairsFound: number, totalPairs: number, timeUsed: number) => {
    setGameResults({ pairsFound, totalPairs, timeUsed });
    setState('results');
  };

  const handlePlayAgain = () => {
    setState('playing');
  };

  const handleBack = () => {
    onBack();
  };

  if (state === 'loading') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Cargando memotest...</p>
        </div>
      </div>
    );
  }

  if (error && !memotestConfig) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Menú
          </button>
        </div>
      </div>
    );
  }

  if (state === 'presentation' && memotestConfig) {
    return (
      <MemotestPresentation 
        memotestConfig={memotestConfig}
        onStart={handleStart}
        onBack={handleBack}
      />
    );
  }

  if (state === 'playing' && memotestConfig) {
    return (
      <MemotestGame 
        memotestConfig={memotestConfig}
        onFinish={handleGameFinish}
        onBack={handleBack}
      />
    );
  }

  if (state === 'results' && memotestConfig) {
    return (
      <MemotestResults 
        memotestConfig={memotestConfig}
        pairsFound={gameResults.pairsFound}
        totalPairs={gameResults.totalPairs}
        timeUsed={gameResults.timeUsed}
        gameTime={memotestConfig.memotest.tiempo || 60}
        onPlayAgain={handlePlayAgain}
        onBack={handleBack}
      />
    );
  }

  return null;
}
